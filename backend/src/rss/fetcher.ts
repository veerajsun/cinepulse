import axios from "axios";
import { logger } from "../utils/logger";

export async function fetchRssFeedXml(url: string, timeoutMs: number = 10000): Promise<string | null> {
  try {
    const response = await axios.get(url, {
      timeout: timeoutMs,
      headers: {
        "User-Agent": "CinePulseBot/1.0 (+https://cinepulse.news)",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
      },
      maxRedirects: 5,
    });

    if (response.status >= 200 && response.status < 300 && response.data) {
      return typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    }
    return null;
  } catch (error: any) {
    logger.warn(`Failed to fetch RSS feed from ${url}: ${error.message}`);
    return null;
  }
}
