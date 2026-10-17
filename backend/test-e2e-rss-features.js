const { prisma } = require("./dist/config/database");
const { isDuplicateItem, deduplicateUrl } = require("./dist/rss/deduplicator");
const { fetchRssFeedXml } = require("./dist/rss/fetcher");

async function runE2eTests() {
  console.log("=== CINEPULSE RSS & DATABASE INTEGRATION VERIFICATION ===");

  // 1. Database Connection & Total Article Count
  const totalArticles = await prisma.article.count();
  const totalSources = await prisma.rssSource.count();
  console.log(`[DB VERIFICATION] Total Articles in DB: ${totalArticles} | Total RSS Sources: ${totalSources}`);

  // 2. Multiple Feeds Per Category Verification
  const categories = ["movies", "web-series", "anime", "k-drama"];
  for (const cat of categories) {
    const articlesInCat = await prisma.article.findMany({
      where: { category: cat },
      select: { sourceName: true },
    });
    const uniqueSources = Array.from(new Set(articlesInCat.map((a) => a.sourceName)));
    console.log(`[MULTI-FEED MERGE] Category "${cat}": ${articlesInCat.length} articles merged from ${uniqueSources.length} sources [${uniqueSources.join(", ")}]`);
  }

  // 3. Duplicate Detection Test
  const firstArticle = await prisma.article.findFirst();
  if (firstArticle) {
    const canonical = deduplicateUrl(firstArticle.sourceUrl);
    const isDup = await isDuplicateItem(canonical, firstArticle.guid, firstArticle.slug, firstArticle.publishedAt);
    console.log(`[DUPLICATE DETECTION] Testing existing URL "${firstArticle.sourceUrl}": Duplicate detected = ${isDup} (Expected: true)`);
  }

  // 4. Fault Isolation Test for Invalid RSS Feeds
  console.log("[FAULT ISOLATION] Testing fetch from invalid feed URL (http://invalid-rss-domain-test.xyz)...");
  const invalidFetch = await fetchRssFeedXml("http://invalid-rss-domain-test.xyz");
  console.log(`  └─ Invalid Feed Result: ${invalidFetch === null ? "Null (Handled gracefully without crashing)" : "Failed"}`);

  await prisma.$disconnect();
  console.log("=== ALL E2E VERIFICATIONS COMPLETE ===");
}

runE2eTests().catch(console.error);
