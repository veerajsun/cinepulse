import { Request, Response, NextFunction } from "express";
import * as newsService from "../services/newsService";
import { runRssIngestionPipeline } from "../services/rssService";

export async function getLatestNews(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string || "10", 10);
    const page = parseInt(req.query.page as string || "1", 10);
    const category = (req.query.category as string) || undefined;

    const result = await newsService.getLatestNews(page, limit, category);
    return res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedNews(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await newsService.getFeaturedNews();
    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTrendingNews(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string || "5", 10);
    const data = await newsService.getTrendingNews(limit);
    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getNewsByCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = req.params.category;
    const limit = parseInt(req.query.limit as string || "10", 10);
    const page = parseInt(req.query.page as string || "1", 10);

    const result = await newsService.getNewsByCategory(category, page, limit);
    return res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getNewsBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = req.params.slug;
    const data = await newsService.getNewsBySlug(slug);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }
    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function searchNews(req: Request, res: Response, next: NextFunction) {
  try {
    const q = (req.query.q as string) || "";
    const category = (req.query.category as string) || undefined;
    const page = parseInt(req.query.page as string || "1", 10);
    const limit = parseInt(req.query.limit as string || "10", 10);

    const result = await newsService.searchNews(q, category, page, limit);
    return res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRelatedNews(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = (req.params.slug || req.query.slug) as string;
    const category = (req.query.category as string) || undefined;
    const limit = parseInt(req.query.limit as string || "3", 10);

    if (!slug) {
      return res.status(400).json({ success: false, message: "Missing slug parameter" });
    }

    const data = await newsService.getRelatedNews(slug, category, limit);
    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function triggerRssIngest(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await runRssIngestionPipeline();
    return res.json({
      success: true,
      message: `RSS Ingestion complete. Processed ${result.feedsProcessed} feeds. Inserted ${result.totalInserted} articles.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
