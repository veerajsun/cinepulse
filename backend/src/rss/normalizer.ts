import { RawParsedItem } from "./parser";
import { NormalizedItem, CategoryType } from "../types";
import { generateSlug } from "../utils/slugify";
import { deduplicateUrl } from "./deduplicator";

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
}

/**
 * Checks whether a URL looks like a genuine article image.
 * Returns false for tracking pixels, emoji, SVG placeholders, icons, etc.
 * Does NOT require the URL to have an image file extension —
 * CDN/dynamic image URLs often lack extensions.
 */
function isUsableImageUrl(url: string): boolean {
  if (!url) return false;
  if (!/^https?:\/\//i.test(url)) return false;

  const lo = url.toLowerCase();

  // WordPress emoji (s.w.org/images/core/emoji/*)
  if (lo.includes("s.w.org/images/core/emoji")) return false;

  // Obvious tracking pixels / 1×1 images
  if (/pixel|1x1|tracking|beacon/i.test(lo)) return false;

  // SVG-only URLs (may still be inline icons)
  if (/\.svg(\?|#|$)/i.test(lo)) return false;

  // Obvious UI/logo/avatar/icon/button paths
  if (/\/(logo|avatar|icon|spinner|spacer|blank|button|sign-up)\./i.test(lo) || /sign-up-button/i.test(lo)) return false;

  // GIF animations used as loaders
  if (/loading[-_]?spinner|ajax-loader/i.test(lo)) return false;

  return true;
}

/**
 * Resolve a possibly-relative URL against baseUrl.
 * Returns the original string if resolution fails.
 */
function resolveUrl(raw: string, baseUrl?: string): string {
  if (!raw) return raw;
  if (/^https?:\/\//i.test(raw)) return raw; // already absolute
  if (!baseUrl) return raw;
  try {
    return new URL(raw, baseUrl).href;
  } catch {
    return raw;
  }
}

/**
 * Scan all <img> tags in HTML and return the first URL that passes
 * isUsableImageUrl(). Checks src, data-src, and data-original attributes.
 */
function extractImageFromHtml(html: string, baseUrl?: string): string | null {
  if (!html) return null;

  // Match every <img ...> tag
  const imgTagRe = /<img\b[^>]*>/gi;
  // Match individual attributes we care about
  const attrRe = /(?:src|data-src|data-original)=["']([^"']+)["']/gi;

  let imgTag: RegExpExecArray | null;
  while ((imgTag = imgTagRe.exec(html)) !== null) {
    const tag = imgTag[0];
    let attr: RegExpExecArray | null;
    attrRe.lastIndex = 0; // reset for each tag
    while ((attr = attrRe.exec(tag)) !== null) {
      const candidate = resolveUrl(attr[1], baseUrl);
      if (isUsableImageUrl(candidate)) {
        return candidate;
      }
    }
  }

  return null;
}

/**
 * Extract a URL from a media:content / media:thumbnail element.
 * rss-parser 3.x returns these as either:
 *   - an object  { $: { url: "..." }, ... }
 *   - an array   [{ $: { url: "..." } }, ...]
 *   - rarely a plain string
 */
function extractMediaUrl(field: any): string | null {
  if (!field) return null;
  const items: any[] = Array.isArray(field) ? field : [field];
  for (const el of items) {
    if (!el) continue;
    // Standard rss-parser shape: el.$.url
    const u =
      (el.$ && el.$.url) ||
      el.url ||
      (typeof el === "string" ? el : null);
    if (u && isUsableImageUrl(u)) return u;
  }
  return null;
}

/**
 * Extract an image URL from an enclosure element.
 * Accepts any MIME type starting with "image/" or URLs with image extensions.
 */
function extractEnclosureUrl(field: any): string | null {
  if (!field) return null;
  const items: any[] = Array.isArray(field) ? field : [field];
  for (const el of items) {
    if (!el) continue;
    const u    = (el.$ && el.$.url)  || el.url  || null;
    const type = (el.$ && el.$.type) || el.type || "";
    if (
      u &&
      (type.startsWith("image/") || /\.(jpe?g|png|webp|gif|avif|bmp)$/i.test(u)) &&
      isUsableImageUrl(u)
    ) {
      return u;
    }
  }
  return null;
}

// Category-level fallback images (used only when the feed provides no image)
const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  movies:
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
  "web-series":
    "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80",
  anime:
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
  "k-drama":
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
  general:
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80",
};

export function normalizeItem(
  raw: RawParsedItem,
  sourceName: string,
  targetCategory: CategoryType
): NormalizedItem | null {
  const title  = raw.title?.trim();
  const rawUrl = raw.link?.trim() || raw.guid?.trim();

  if (!title || !rawUrl) return null;

  const canonicalUrl = deduplicateUrl(rawUrl);
  const slug         = generateSlug(title);
  const guid         = raw.guid?.trim() || canonicalUrl;

  // ── Excerpt (max 300 chars, no HTML) ──────────────────────────────────────
  let rawExcerpt =
    raw.contentSnippet ||
    raw.summary        ||
    raw.content        ||
    raw.contentEncoded ||
    "";
  let excerpt = stripHtml(rawExcerpt);
  if (excerpt.length > 300) excerpt = excerpt.substring(0, 297) + "...";
  if (!excerpt) excerpt = title;

  // ── Image extraction (priority order) ────────────────────────────────────
  let imageUrl: string | null = null;

  // 1. media:content
  imageUrl = extractMediaUrl(raw.mediaContent);

  // 2. media:thumbnail
  if (!imageUrl) imageUrl = extractMediaUrl(raw.mediaThumbnail);

  // 3. enclosure (image type or image extension)
  if (!imageUrl) imageUrl = extractEnclosureUrl(raw.enclosure);

  // 4. content:encoded HTML — scan all <img> tags, skip emoji / junk
  if (!imageUrl && raw.contentEncoded) {
    imageUrl = extractImageFromHtml(raw.contentEncoded, rawUrl);
  }

  // 5. summary / description HTML
  if (!imageUrl && raw.summary) {
    imageUrl = extractImageFromHtml(raw.summary, rawUrl);
  }

  // 6. generic content field
  if (!imageUrl && raw.content) {
    imageUrl = extractImageFromHtml(raw.content, rawUrl);
  }

  // 7. Category default fallback (only when the feed truly has no image)
  if (!imageUrl) {
    imageUrl =
      CATEGORY_DEFAULT_IMAGES[targetCategory] ||
      CATEGORY_DEFAULT_IMAGES.general;
  }

  // ── Date parsing ──────────────────────────────────────────────────────────
  let publishedAt = new Date();
  if (raw.pubDate) {
    const d = new Date(raw.pubDate);
    if (!isNaN(d.getTime())) publishedAt = d;
  }

  const tags = raw.categories
    ? raw.categories.filter((c) => typeof c === "string").map((c) => c.trim())
    : [];

  return {
    title,
    slug,
    excerpt,
    content: excerpt,
    imageUrl,
    sourceName,
    sourceUrl:    rawUrl,
    canonicalUrl,
    publishedAt,
    guid,
    category: targetCategory,
    tags,
  };
}
