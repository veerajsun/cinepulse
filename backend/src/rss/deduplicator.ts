import { prisma } from "../config/database";

export function deduplicateUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const params = parsed.searchParams;
    
    // Strip common tracking and RSS campaign queries
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref", "source", "rss", "feed"].forEach(
      (p) => params.delete(p)
    );

    let cleanUrl = `${parsed.origin}${parsed.pathname}`;
    const searchString = params.toString();
    if (searchString) {
      cleanUrl += `?${searchString}`;
    }
    return cleanUrl.toLowerCase().replace(/\/$/, "");
  } catch {
    return url.toLowerCase().trim();
  }
}

export async function isDuplicateItem(canonicalUrl: string, guid: string, slug: string, publishedAt: Date): Promise<boolean> {
  try {
    // Tier 1 & 2: Exact Canonical URL or GUID check
    const existingUrl = await prisma.article.findFirst({
      where: {
        OR: [
          { canonicalUrl: canonicalUrl },
          { sourceUrl: canonicalUrl },
          { guid: guid },
        ],
      },
    });
    if (existingUrl) return true;

    // Tier 3: Title Slug similarity check within a 48-hour time window
    const twoDaysAgo = new Date(publishedAt.getTime() - 48 * 60 * 60 * 1000);
    const twoDaysAhead = new Date(publishedAt.getTime() + 48 * 60 * 60 * 1000);

    const existingSlug = await prisma.article.findFirst({
      where: {
        slug: slug,
        publishedAt: {
          gte: twoDaysAgo,
          lte: twoDaysAhead,
        },
      },
    });
    if (existingSlug) return true;

    return false;
  } catch (err) {
    // If DB fails during check, default to false to allow insert
    return false;
  }
}
