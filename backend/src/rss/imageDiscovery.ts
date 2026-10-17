import http from "http";
import https from "https";
import { URL } from "url";
import { RSS_FEEDS_REGISTRY } from "./feeds";
import { logger } from "../utils/logger";

// In-memory cache for discovered article images during process lifetime
const imageDiscoveryCache = new Map<string, string | null>();
// Domains that consistently block or fail discovery
const blockedHostnames = new Set<string>();

// Known trusted entertainment news domains in CinePulse
const KNOWN_TRUSTED_DOMAINS = [
  "hollywoodreporter.com",
  "variety.com",
  "collider.com",
  "deadline.com",
  "indiewire.com",
  "tvline.com",
  "screendaily.com",
  "theanimedaily.com",
  "animecorner.me",
  "otakuusamagazine.com",
  "indianexpress.com",
  "hindustantimes.com",
  "soompi.com",
  "allkpop.com",
  "crunchyroll.com",
  "animenewsnetwork.com",
];

/**
 * Returns list of trusted hostnames from registry and known trusted publishers.
 */
function getTrustedHostnames(): string[] {
  const hosts = new Set<string>(KNOWN_TRUSTED_DOMAINS);
  for (const feed of RSS_FEEDS_REGISTRY) {
    try {
      const parsed = new URL(feed.url);
      hosts.add(parsed.hostname.toLowerCase().replace(/^www\./, ""));
    } catch {
      // Ignore invalid config URLs
    }
  }
  return Array.from(hosts);
}

/**
 * Checks if target URL matches one of the trusted feed domains.
 */
function isTrustedDomain(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (blockedHostnames.has(hostname)) {
      return false;
    }
    const trustedHosts = getTrustedHostnames();
    return trustedHosts.some((trusted) => hostname === trusted || hostname.endsWith(`.${trusted}`));
  } catch {
    return false;
  }
}

/**
 * Decodes HTML entities commonly found in meta tags.
 */
function decodeHtmlEntities(str: string): string {
  if (!str) return str;
  return str
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"');
}

/**
 * Validates whether an image URL is a genuine usable article photo.
 */
function isValidDiscoveredImage(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== "string") return false;
  const trimmed = urlStr.trim();
  if (!/^https?:\/\//i.test(trimmed)) return false;

  const lo = trimmed.toLowerCase();
  if (lo.includes("s.w.org/images/core/emoji")) return false;
  if (/pixel|1x1|tracking|beacon/i.test(lo)) return false;
  if (/\.svg(\?|#|$)/i.test(lo)) return false;
  if (/\/(logo|avatar|icon|spinner|spacer|blank|button|sign-up)\./i.test(lo) || /sign-up-button/i.test(lo)) return false;
  if (/loading[-_]?spinner|ajax-loader/i.test(lo)) return false;

  return true;
}

/**
 * Resolves a possibly-relative URL against baseUrl.
 */
function resolveUrl(raw: string, baseUrl: string): string {
  if (!raw) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  try {
    return new URL(raw, baseUrl).href;
  } catch {
    return raw;
  }
}

/**
 * Extract Open Graph, Twitter, JSON-LD, or featured image metadata from HTML.
 */
function extractMetaImage(html: string, baseUrl: string): string | null {
  if (!html) return null;

  const patterns = [
    // Open Graph
    /<meta[^>]+property=["']og:image(?::url|:secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::url|:secure_url)?["']/i,
    // Twitter Card
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
    // Link rel image_src
    /<link[^>]+rel=["'](?:image_src|thumbnail)["'][^>]+href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:image_src|thumbnail)["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const decoded = decodeHtmlEntities(match[1].trim());
      const resolved = resolveUrl(decoded, baseUrl);
      if (isValidDiscoveredImage(resolved)) {
        return resolved;
      }
    }
  }

  // Fallback: JSON-LD Schema.org NewsArticle image
  const jsonLdMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis);
  if (jsonLdMatch) {
    for (const tag of jsonLdMatch) {
      const content = tag.replace(/<\/?script[^>]*>/gi, "");
      try {
        const parsed = JSON.parse(content);
        const imgCandidate =
          (typeof parsed.image === "string" ? parsed.image : null) ||
          (Array.isArray(parsed.image) && typeof parsed.image[0] === "string" ? parsed.image[0] : null) ||
          (parsed.image && typeof parsed.image.url === "string" ? parsed.image.url : null);
        if (imgCandidate && isValidDiscoveredImage(imgCandidate)) {
          return resolveUrl(decodeHtmlEntities(imgCandidate.trim()), baseUrl);
        }
      } catch {
        // Skip invalid JSON-LD blocks
      }
    }
  }

  return null;
}

/**
 * Fetches the <head> of an article HTML page (up to 400KB) and extracts
 * the original featured image from Open Graph / Twitter metadata.
 */
export async function discoverArticleImage(articleUrl: string, maxRedirects: number = 3): Promise<string | null> {
  if (!articleUrl || typeof articleUrl !== "string") return null;

  // 1. Check in-memory cache
  if (imageDiscoveryCache.has(articleUrl)) {
    return imageDiscoveryCache.get(articleUrl) || null;
  }

  // 2. Validate domain against trusted feed registry
  if (!isTrustedDomain(articleUrl)) {
    imageDiscoveryCache.set(articleUrl, null);
    return null;
  }

  return new Promise((resolve) => {
    let settled = false;
    let timer: NodeJS.Timeout | null = null;

    const finalize = (img: string | null) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      imageDiscoveryCache.set(articleUrl, img);
      resolve(img);
    };

    try {
      const parsed = new URL(articleUrl);
      const httpModule = parsed.protocol === "https:" ? https : http;

      timer = setTimeout(() => {
        finalize(null);
      }, 3000); // 3000ms fast timeout

      const req = httpModule.get(
        articleUrl,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
        },
        (res) => {
          // Handle HTTP redirects
          if (
            res.statusCode &&
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location &&
            maxRedirects > 0
          ) {
            const redirectUrl = resolveUrl(res.headers.location, articleUrl);
            req.destroy();
            discoverArticleImage(redirectUrl, maxRedirects - 1).then((img) => {
              finalize(img);
            });
            return;
          }

          if (res.statusCode === 403 || res.statusCode === 401) {
            // Publisher blocked bot requests; mark domain as blocked for current cycle
            blockedHostnames.add(parsed.hostname.toLowerCase().replace(/^www\./, ""));
            req.destroy();
            finalize(null);
            return;
          }

          if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
            req.destroy();
            finalize(null);
            return;
          }

          let html = "";
          res.on("data", (chunk) => {
            html += chunk;
            // Stop streaming once head section is read or size limit (400KB) is reached
            if (html.length > 400000 || html.includes("</head>")) {
              req.destroy();
              const found = extractMetaImage(html, articleUrl);
              finalize(found);
            }
          });

          res.on("end", () => {
            const found = extractMetaImage(html, articleUrl);
            finalize(found);
          });

          res.on("close", () => {
            const found = extractMetaImage(html, articleUrl);
            finalize(found);
          });
        }
      );

      req.on("error", (err) => {
        logger.debug(`Image discovery network error for ${articleUrl}: ${err.message}`);
        finalize(null);
      });

      req.on("close", () => {
        finalize(null);
      });
    } catch (err: any) {
      logger.debug(`Image discovery error for ${articleUrl}: ${err.message}`);
      finalize(null);
    }
  });
}
