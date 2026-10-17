import express from "express";
import cors from "cors";
import { config } from "./config/env";
import { logger } from "./utils/logger";
import newsRoutes from "./routes/newsRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { initRssScheduler } from "./rss/scheduler";

const app = express();

// Security & Middleware
app.use(
  cors({
    origin: [config.frontendUrl, "http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply Rate Limiter to public API routes
app.use("/api", apiRateLimiter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

// Mount News Routes
app.use("/api/news", newsRoutes);

// Centralized Error Handler
app.use(errorHandler);

// Start Express HTTP Server
const server = app.listen(config.port, () => {
  logger.info(`=================================================`);
  logger.info(`CinePulse Backend API Server running on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`CORS allowed origin: ${config.frontendUrl}`);
  logger.info(`=================================================`);

  // Initialize background RSS scheduler
  initRssScheduler();
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received. Closing HTTP server...");
  server.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });
});
