import Parser from "rss-parser";
import { logger } from "../utils/logger";

const rssParser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
      ["enclosure", "enclosure", { keepArray: true }],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

export interface RawParsedItem {
  title?: string;
  link?: string;
  guid?: string;
  pubDate?: string;
  creator?: string;
  summary?: string;
  contentSnippet?: string;
  content?: string;
  contentEncoded?: string;
  categories?: string[];
  mediaContent?: any;
  mediaThumbnail?: any;
  enclosure?: any;
}

export async function parseRssXml(xml: string): Promise<RawParsedItem[]> {
  try {
    const feed = await rssParser.parseString(xml);
    return (feed.items || []) as RawParsedItem[];
  } catch (err: any) {
    logger.error(`Error parsing RSS XML: ${err.message}`);
    return [];
  }
}
