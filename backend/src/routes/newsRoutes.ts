import { Router } from "express";
import * as newsController from "../controllers/newsController";

const router = Router();

router.get("/latest", newsController.getLatestNews);
router.get("/featured", newsController.getFeaturedNews);
router.get("/trending", newsController.getTrendingNews);
router.get("/category/:category", newsController.getNewsByCategory);
router.get("/slug/:slug", newsController.getNewsBySlug);
router.get("/search", newsController.searchNews);
router.get("/related", newsController.getRelatedNews);
router.get("/related/:slug", newsController.getRelatedNews);
router.get("/ingest", newsController.triggerRssIngest);

// Generic /api/news endpoint supporting query params ?category=...&q=...&limit=...
router.get("/:slug", (req, res, next) => {
  // If slug is a known category or 'news', delegate accordingly
  const slug = req.params.slug;
  if (["movies", "web-series", "anime", "k-drama", "general", "trending"].includes(slug)) {
    return newsController.getNewsByCategory(req, res, next);
  }
  return newsController.getNewsBySlug(req, res, next);
});

router.get("/", (req, res, next) => {
  if (req.query.q) {
    return newsController.searchNews(req, res, next);
  }
  return newsController.getLatestNews(req, res, next);
});

export default router;
