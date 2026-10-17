import { PrismaClient } from "@prisma/client";
import { RSS_FEEDS_REGISTRY } from "../src/rss/feeds";

const prisma = new PrismaClient();

const INITIAL_MOCK_ARTICLES = [
  {
    id: "art-1",
    title: "‘Dune: Messiah’ Fast-Tracks Production with Denis Villeneuve: The Reckoning of Arrakis",
    slug: "dune-messiah-fast-tracks-production-with-denis-villeneuve-cinepulse",
    excerpt: "Warner Bros. and Legendary lock in winter shooting dates as Villeneuve wraps the final treatment, detailing the political isolation, sacred war fallout, and psychological labyrinth facing Paul Atreides.",
    content: "<p>Warner Bros. and Legendary Pictures have officially fast-tracked production for Dune: Messiah...</p>",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80",
    sourceName: "Variety Syndicate",
    sourceUrl: "https://variety.com/2026/film/news/dune-messiah-production-start",
    canonicalUrl: "https://variety.com/2026/film/news/dune-messiah-production-start",
    category: "movies",
    subCategory: "Cinema Dispatch",
    tags: JSON.stringify(["Dune Messiah", "Denis Villeneuve", "Timothée Chalamet", "Box Office"]),
    isFeatured: true,
    isTrending: true,
    readTime: "4 min read",
    score: 9.6,
    author: "Elena Rostova",
    guid: "variety-dune-messiah-2026",
    publishedAt: new Date("2026-09-24T12:00:00Z"),
  },
  {
    id: "art-2",
    title: "Christopher Nolan's Next Universal Epic Casts Florence Pugh & Robert Pattinson",
    slug: "christopher-nolans-next-universal-epic-casts-florence-pugh-robert-pattinson",
    excerpt: "Following the historic Oscar sweep of Oppenheimer, Christopher Nolan reunites with top tier talent for a top-secret IMAX thriller set for Summer 2026.",
    content: "<p>Full production details reveal a globe-trotting espionage narrative shot on IMAX 70mm film...</p>",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    sourceName: "Hollywood Wire",
    sourceUrl: "https://hollywoodreporter.com/2026/nolan-next-epic-casting",
    canonicalUrl: "https://hollywoodreporter.com/2026/nolan-next-epic-casting",
    category: "movies",
    subCategory: "Casting Dispatch",
    tags: JSON.stringify(["Christopher Nolan", "Florence Pugh", "Robert Pattinson", "IMAX"]),
    isFeatured: false,
    isTrending: true,
    readTime: "3 min read",
    score: 9.2,
    author: "Marcus Vance",
    guid: "thr-nolan-casting-2026",
    publishedAt: new Date("2026-09-24T10:30:00Z"),
  },
  {
    id: "art-3",
    title: "MAPPA Confirms Chainsaw Man Reze Arc Winter 2025 Release Window",
    slug: "mappa-confirms-chainsaw-man-reze-arc-winter-2025-release-window",
    excerpt: "The long-awaited theatrical feature film covering the Bomb Devil arc receives a stunning new visual teaser showcasing Denji and Reze in twilight Tokyo.",
    content: "<p>Studio MAPPA's chief producer promised unprecedented sakuga animation sequences...</p>",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
    sourceName: "Tokyo Anime Wire",
    sourceUrl: "https://animenewsnetwork.com/2026/chainsaw-man-reze-arc-winter",
    canonicalUrl: "https://animenewsnetwork.com/2026/chainsaw-man-reze-arc-winter",
    category: "anime",
    subCategory: "Seasonal Slate",
    tags: JSON.stringify(["Chainsaw Man", "MAPPA", "Reze Arc", "Anime Film"]),
    isFeatured: false,
    isTrending: true,
    readTime: "5 min read",
    score: 9.8,
    author: "Kenji Sato",
    episodes: "Theatrical Movie",
    platform: "Crunchyroll / Theatres",
    guid: "ann-chainsaw-man-reze-2026",
    publishedAt: new Date("2026-09-24T09:15:00Z"),
  },
  {
    id: "art-4",
    title: "Squid Game Season 3 Final Chapter Teaser Drops: The Final Gambit Unfolds",
    slug: "squid-game-season-3-final-chapter-teaser-drops",
    excerpt: "Director Hwang Dong-hyuk prepares the ultimate showdown between Gi-hun and the Front Man as Netflix sets the premiere date for the global phenomenon.",
    content: "<p>Gi-hun's relentless pursuit of the shadowy organization comes to a climax in Seoul...</p>",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    sourceName: "Hallyu Insider",
    sourceUrl: "https://soompi.com/2026/squid-game-season-3-teaser",
    canonicalUrl: "https://soompi.com/2026/squid-game-season-3-teaser",
    category: "k-drama",
    subCategory: "Ratings Radar",
    tags: JSON.stringify(["Squid Game 3", "Netflix", "Lee Jung-jae", "K-Drama"]),
    isFeatured: false,
    isTrending: true,
    readTime: "4 min read",
    score: 9.5,
    author: "Min-ji Park",
    episodes: "6 Episodes",
    platform: "Netflix",
    guid: "soompi-squid-game-3-2026",
    publishedAt: new Date("2026-09-24T08:00:00Z"),
  },
  {
    id: "art-5",
    title: "Severance Season 2 Review: Apple TV+ Delivers a Masterclass in Paranoiac Tension",
    slug: "severance-season-2-review-apple-tv-masterclass",
    excerpt: "Adam Scott and Patricia Arquette return in a brain-bending continuation that deepens the mystery of Lumon Industries with surgical precision.",
    content: "<p>Ben Stiller's direction remains unmatched in modern television...</p>",
    imageUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80",
    sourceName: "OTT Binge Radar",
    sourceUrl: "https://indiewire.com/2026/severance-season-2-review",
    canonicalUrl: "https://indiewire.com/2026/severance-season-2-review",
    category: "web-series",
    subCategory: "Binge Radar",
    tags: JSON.stringify(["Severance", "Apple TV+", "Adam Scott", "TV Review"]),
    isFeatured: true,
    isTrending: true,
    readTime: "6 min read",
    score: 9.9,
    author: "Sarah Jenkins",
    episodes: "10 Episodes",
    platform: "Apple TV+",
    guid: "indiewire-severance-2-2026",
    publishedAt: new Date("2026-09-23T18:00:00Z"),
  }
];

async function main() {
  console.log("Seeding RssSource entries...");
  for (const feed of RSS_FEEDS_REGISTRY) {
    await prisma.rssSource.upsert({
      where: { url: feed.url },
      update: {
        name: feed.name,
        category: feed.category,
        enabled: feed.enabled,
        priority: feed.priority || 1,
      },
      create: {
        id: feed.id,
        name: feed.name,
        url: feed.url,
        category: feed.category,
        enabled: feed.enabled,
        priority: feed.priority || 1,
      },
    });
  }

  console.log("Seeding initial Articles...");
  for (const article of INITIAL_MOCK_ARTICLES) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
