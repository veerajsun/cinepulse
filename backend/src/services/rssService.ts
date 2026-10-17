import { RSS_FEEDS_REGISTRY } from "../rss/feeds";
import { fetchRssFeedXml } from "../rss/fetcher";
import { parseRssXml } from "../rss/parser";
import { normalizeItem } from "../rss/normalizer";
import { isDuplicateItem } from "../rss/deduplicator";
import { prisma } from "../config/database";
import { logger } from "../utils/logger";
import { calculateReadTime } from "../utils/readTime";
import { discoverArticleImage } from "../rss/imageDiscovery";

export async function runRssIngestionPipeline(): Promise<{ totalInserted: number; feedsProcessed: number }> {
  const enabledFeeds = RSS_FEEDS_REGISTRY.filter((f) => f.enabled);
  logger.info(`Starting RSS Ingestion for ${enabledFeeds.length} feeds across categories...`);

  let totalInserted = 0;
  let feedsProcessed = 0;

  for (const feedConfig of enabledFeeds) {
    try {
      logger.info(`[Feed Fetch] Processing "${feedConfig.name}" (${feedConfig.category}) -> ${feedConfig.url}`);

      // Upsert RssSource status in DB
      await prisma.rssSource.upsert({
        where: { url: feedConfig.url },
        update: {
          name: feedConfig.name,
          category: feedConfig.category,
          enabled: feedConfig.enabled,
          priority: feedConfig.priority || 1,
        },
        create: {
          id: feedConfig.id,
          name: feedConfig.name,
          url: feedConfig.url,
          category: feedConfig.category,
          enabled: feedConfig.enabled,
          priority: feedConfig.priority || 1,
        },
      });

      const xml = await fetchRssFeedXml(feedConfig.url);
      if (!xml) {
        logger.warn(`Skipping feed "${feedConfig.name}" due to fetch failure or timeout.`);
        await prisma.rssSource.update({
          where: { url: feedConfig.url },
          data: { lastFetchedAt: new Date(), lastFetchStatus: "FAILED" },
        });
        continue;
      }

      const rawItems = await parseRssXml(xml);
      let feedInsertedCount = 0;

      for (const rawItem of rawItems) {
        const normalized = normalizeItem(rawItem, feedConfig.name, feedConfig.category);
        if (!normalized) continue;

        // If RSS didn't supply an image (using default fallback), attempt Open Graph metadata discovery
        let isDefaultImage =
          normalized.imageUrl.includes("unsplash.com") ||
          normalized.imageUrl.includes("s.w.org/images/core/emoji");

        if (isDefaultImage) {
          const discoveredImage = await discoverArticleImage(normalized.sourceUrl);
          if (discoveredImage) {
            normalized.imageUrl = discoveredImage;
            isDefaultImage = false;
          }
        }

        const isDup = await isDuplicateItem(
          normalized.canonicalUrl,
          normalized.guid,
          normalized.slug,
          normalized.publishedAt
        );

        const readTime = calculateReadTime(normalized.excerpt);

        if (isDup) {
          // If duplicate AND we now have a valid original image, patch existing stale records
          if (!isDefaultImage) {
            const existingArticles = await prisma.article.findMany({
              where: {
                OR: [
                  { canonicalUrl: normalized.canonicalUrl },
                  { guid: normalized.guid },
                  { slug: normalized.slug },
                ],
              },
              select: { id: true, imageUrl: true },
            });

            for (const existing of existingArticles) {
              const stale =
                existing.imageUrl.includes("unsplash.com") ||
                existing.imageUrl.includes("s.w.org/images/core/emoji");
              if (stale) {
                await prisma.article.update({
                  where: { id: existing.id },
                  data: { imageUrl: normalized.imageUrl },
                });
              }
            }
          }
          continue;
        }

        // Save new article to PostgreSQL / Prisma
        await prisma.article.create({
          data: {
            title: normalized.title,
            slug: normalized.slug,
            excerpt: normalized.excerpt,
            content: normalized.content,
            imageUrl: normalized.imageUrl,
            sourceName: normalized.sourceName,
            sourceUrl: normalized.sourceUrl,
            canonicalUrl: normalized.canonicalUrl,
            category: normalized.category,
            publishedAt: normalized.publishedAt,
            guid: normalized.guid,
            tags: JSON.stringify(normalized.tags),
            readTime: readTime,
            isFeatured: Math.random() > 0.7,
            isTrending: Math.random() > 0.6,
          },
        });

        feedInsertedCount++;
        totalInserted++;
      }

      // Heal any existing stored articles for this source that still carry a placeholder image
      const staleArticles = await prisma.article.findMany({
        where: {
          sourceName: feedConfig.name,
          imageUrl: { contains: "unsplash.com" },
        },
        select: { id: true, sourceUrl: true },
        take: 50,
      });

      for (const stale of staleArticles) {
        const discovered = await discoverArticleImage(stale.sourceUrl);
        if (discovered) {
          await prisma.article.update({
            where: { id: stale.id },
            data: { imageUrl: discovered },
          });
        }
      }

      await prisma.rssSource.update({
        where: { url: feedConfig.url },
        data: { lastFetchedAt: new Date(), lastFetchStatus: "SUCCESS" },
      });

      feedsProcessed++;
      logger.info(`[Feed Complete] "${feedConfig.name}": Inserted ${feedInsertedCount} new articles.`);
    } catch (err: any) {
      logger.error(`Error processing feed "${feedConfig.name}": ${err.message}`);
    }
  }

  // Post-sync healing: heal any remaining articles in the database that still carry fallback images
  try {
    const remainingStale = await prisma.article.findMany({
      where: {
        imageUrl: { contains: "unsplash.com" },
      },
      select: { id: true, sourceUrl: true, sourceName: true },
      take: 60,
    });

    const chunkSize = 5;
    for (let i = 0; i < remainingStale.length; i += chunkSize) {
      const chunk = remainingStale.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(async (item) => {
          const discovered = await discoverArticleImage(item.sourceUrl);
          if (discovered) {
            await prisma.article.update({
              where: { id: item.id },
              data: { imageUrl: discovered },
            });
          }
        })
      );
    }
  } catch (err: any) {
    logger.warn(`Post-sync image discovery pass encountered error: ${err.message}`);
  }

  logger.info(`RSS Ingestion Run Finished. Processed ${feedsProcessed} feeds. Total new articles: ${totalInserted}.`);
  return { totalInserted, feedsProcessed };
}
