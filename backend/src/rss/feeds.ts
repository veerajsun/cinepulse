import { RssFeedConfig } from "../types";

/**
 * CinePulse Central RSS Feed Registry
 * 
 * To add a new RSS feed:
 * 1. Add a new object to the RSS_FEEDS_REGISTRY array below:
 *    {
 *      id: "unique-feed-id",
 *      name: "Source Name",
 *      url: "https://example.com/feed/",
 *      category: "anime" | "web-series" | "movies" | "k-drama" | "general",
 *      enabled: true,
 *      priority: 1
 *    }
 * 2. Save and restart/rebuild the backend.
 * 3. The scheduler will automatically ingest and merge articles into the category.
 */
export const RSS_FEEDS_REGISTRY: RssFeedConfig[] = [
  // ─── ANIME & MANGA (Confirmed Registered Feeds) ───────────────────────────
  {
    id: "anime-daily",
    name: "The Anime Daily",
    url: "https://www.theanimedaily.com/feed/",
    category: "anime",
    enabled: true,
    priority: 1,
  },
  {
    id: "anime-corner",
    name: "Anime Corner",
    url: "https://animecorner.me/feed/",
    category: "anime",
    enabled: true,
    priority: 1,
  },
  {
    id: "otaku-usa-magazine",
    name: "Otaku USA Magazine",
    url: "https://otakuusamagazine.com/anime/feed/",
    category: "anime",
    enabled: true,
    priority: 1,
  },

  // ─── WEB SERIES & OTT (Confirmed Registered Feeds) ────────────────────────
  {
    id: "indian-express-web-series",
    name: "The Indian Express",
    url: "https://indianexpress.com/section/entertainment/web-series/feed/",
    category: "web-series",
    enabled: true,
    priority: 1,
  },
  {
    id: "hindustan-times-web-series",
    name: "Hindustan Times",
    url: "https://www.hindustantimes.com/feeds/rss/entertainment/web-series/rssfeed.xml",
    category: "web-series",
    enabled: true,
    priority: 1,
  },

  // ─── MOVIES (Architecture Ready for Feeds - Awaiting Exact URLs) ────────────
  // Example format when exact Movies RSS feed URLs are provided:
  // {
  //   id: "movies-source-id",
  //   name: "Movies Feed Name",
  //   url: "https://example.com/movies/feed/",
  //   category: "movies",
  //   enabled: true,
  // }

  // ─── K-DRAMA (Confirmed Registered Feeds) ───────────────────────────
  {
    id: "soompi-kdrama",
    name: "Soompi",
    url: "https://www.soompi.com/feed",
    category: "k-drama",
    enabled: true,
    priority: 1,
  },
  {
    id: "dramabeans-kdrama",
    name: "Dramabeans",
    url: "https://dramabeans.com/feed/",
    category: "k-drama",
    enabled: true,
    priority: 1,
  },
  {
    id: "mydramalist-kdrama",
    name: "MyDramaList",
    url: "https://mydramalist.com/rss",
    category: "k-drama",
    enabled: true,
    priority: 1,
  },
  {
    id: "kdrama-kisses",
    name: "Kdrama Kisses",
    url: "https://kdramakisses.com/feed",
    category: "k-drama",
    enabled: true,
    priority: 1,
  },
];
