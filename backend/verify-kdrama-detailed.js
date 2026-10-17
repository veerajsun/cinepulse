const https = require('https');
const http = require('http');
const Parser = require('./node_modules/rss-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
      ['enclosure', 'enclosure', { keepArray: true }],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

const feeds = [
  { id: 'soompi-kdrama', name: 'Soompi', url: 'https://www.soompi.com/feed' },
  { id: 'dramabeans-kdrama', name: 'Dramabeans', url: 'https://dramabeans.com/feed/' },
  { id: 'mydramalist-kdrama', name: 'MyDramaList', url: 'https://mydramalist.com/rss' },
  { id: 'kdrama-kisses', name: 'Kdrama Kisses', url: 'https://kdramakisses.com/feed' },
];

function fetchFeed(feedUrl) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(feedUrl);
      const mod = parsed.protocol === 'https:' ? https : http;
      const req = mod.get(
        feedUrl,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'application/rss+xml, application/xml, application/atom+xml, text/xml, */*',
          },
          timeout: 8000,
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return resolve(fetchFeed(res.headers.location));
          }
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => resolve({ statusCode: res.statusCode, data, error: null }));
        }
      );
      req.on('error', (err) => resolve({ statusCode: 0, data: null, error: err.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ statusCode: 0, data: null, error: 'Connection timeout (8s)' });
      });
    } catch (e) {
      resolve({ statusCode: 0, data: null, error: e.message });
    }
  });
}

async function main() {
  console.log('========================================================================');
  console.log('              K-DRAMA RSS FEEDS INDIVIDUAL VERIFICATION                 ');
  console.log('========================================================================\n');

  const reportRows = [];

  for (const f of feeds) {
    console.log(`Checking Feed: ${f.name} (${f.url})`);
    const res = await fetchFeed(f.url);

    let parseStatus = 'Failed';
    let feedItemCount = 0;
    let errorMsg = res.error || (res.statusCode !== 200 ? `HTTP ${res.statusCode}` : 'None');

    if (res.statusCode === 200 && res.data) {
      try {
        const parsed = await parser.parseString(res.data);
        feedItemCount = parsed.items ? parsed.items.length : 0;
        parseStatus = 'Valid RSS/XML';
        errorMsg = 'None';
      } catch (err) {
        parseStatus = 'Parse Error';
        errorMsg = err.message;
      }
    }

    // Check DB record for this source
    const dbArticles = await prisma.article.findMany({
      where: {
        category: 'k-drama',
        sourceName: f.name,
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        canonicalUrl: true,
        publishedAt: true,
      },
    });

    const realImages = dbArticles.filter((a) => !a.imageUrl.includes('unsplash.com')).length;
    const fallbackImages = dbArticles.length - realImages;

    // Check RssSource table status
    const rssSourceRec = await prisma.rssSource.findUnique({
      where: { url: f.url },
    });

    reportRows.push({
      name: f.name,
      url: f.url,
      httpStatus: res.statusCode || 'N/A',
      parseStatus,
      itemsInFeed: feedItemCount,
      dbArticleCount: dbArticles.length,
      realImages,
      fallbackImages,
      lastFetchStatus: rssSourceRec ? rssSourceRec.lastFetchStatus : 'UNKNOWN',
      error: errorMsg,
      sampleImages: dbArticles.slice(0, 3).map((a) => a.imageUrl),
    });
  }

  console.log('\n--- VERIFICATION SUMMARY TABLE ---');
  console.table(
    reportRows.map((r) => ({
      'Feed Name': r.name,
      'Feed URL': r.url,
      'HTTP Status': r.httpStatus,
      'Parse Status': r.parseStatus,
      'Items in Feed': r.itemsInFeed,
      'Articles in DB': r.dbArticleCount,
      'Original Images': r.realImages,
      'Fallbacks': r.fallbackImages,
      'DB Fetch Status': r.lastFetchStatus,
      'Error / Issues': r.error,
    }))
  );

  console.log('\n--- SAMPLE IMAGE EXTRACTION PER FEED ---');
  for (const r of reportRows) {
    console.log(`\n[${r.name}] (${r.realImages} original, ${r.fallbackImages} fallback):`);
    r.sampleImages.forEach((img, i) => {
      const isFallback = img.includes('unsplash.com');
      console.log(`  ${i + 1}. ${isFallback ? '❌ (Category Fallback)' : '✅ ' + img.slice(0, 95)}`);
    });
  }

  // Deduplication check: check if any duplicate canonicalUrls or titles exist in k-drama
  const duplicates = await prisma.$queryRaw`
    SELECT "canonicalUrl", COUNT(*) as count 
    FROM "Article" 
    WHERE "category" = 'k-drama' 
    GROUP BY "canonicalUrl" 
    HAVING COUNT(*) > 1
  `;
  console.log(`\nDuplicate Canonical URLs in K-Drama: ${duplicates.length} (Expected: 0)`);

  await prisma.$disconnect();
}

main().catch(console.error);
