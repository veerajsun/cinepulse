import cron from "node-cron";
import { config } from "../config/env";
import { logger } from "../utils/logger";
import { runRssIngestionPipeline } from "../services/rssService";

export function initRssScheduler(): void {
  const interval = config.rssFetchInterval;
  const cronExpression = `*/${interval} * * * *`;

  logger.info(`Initializing RSS Background Scheduler with cron expression: "${cronExpression}"`);

  // Run initial ingestion pipeline on startup asynchronously (non-blocking)
  setTimeout(() => {
    logger.info("Executing initial RSS feed ingestion startup task...");
    runRssIngestionPipeline().catch((err) => {
      logger.error(`Initial RSS ingestion task failed: ${err.message}`);
    });
  }, 1000);

  // Schedule cron task for periodic refreshes
  cron.schedule(cronExpression, async () => {
    logger.info("Running scheduled periodic RSS feed refresh...");
    try {
      await runRssIngestionPipeline();
    } catch (err: any) {
      logger.error(`Scheduled RSS ingestion error: ${err.message}`);
    }
  });
}
