import { prisma } from "../config/database";
import { ArticleDTO, CategoryType, PaginationDTO } from "../types";

function mapArticleToDto(article: any): ArticleDTO {
  let parsedTags: string[] = [];
  try {
    if (article.tags) {
      parsedTags = typeof article.tags === "string" ? JSON.parse(article.tags) : article.tags;
    }
  } catch {
    parsedTags = [];
  }

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content || undefined,
    image: article.imageUrl,
    sourceName: article.sourceName,
    sourceUrl: article.sourceUrl,
    canonicalUrl: article.canonicalUrl,
    publishedAt: article.publishedAt.toISOString(),
    category: article.category as CategoryType,
    subCategory: article.subCategory || undefined,
    tags: parsedTags,
    isFeatured: article.isFeatured,
    isTrending: article.isTrending,
    readTime: article.readTime || "4 min read",
    score: article.score || 9.0,
    author: article.author || "Syndicate Wire",
    episodes: article.episodes || undefined,
    platform: article.platform || undefined,
    rank: article.rank || undefined,
  };
}

export async function getLatestNews(page: number = 1, limit: number = 10, category?: string) {
  const skip = (page - 1) * limit;
  const whereClause: any = {};
  if (category && category !== "all") {
    whereClause.category = category;
  }

  const [totalItems, articles] = await Promise.all([
    prisma.article.count({ where: whereClause }),
    prisma.article.findMany({
      where: whereClause,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  const pagination: PaginationDTO = {
    currentPage: page,
    totalPages,
    totalItems,
    pageSize: limit,
  };

  return {
    data: articles.map(mapArticleToDto),
    pagination,
  };
}

export async function getFeaturedNews(): Promise<ArticleDTO[]> {
  const articles = await prisma.article.findMany({
    where: { isFeatured: true },
    orderBy: { publishedAt: "desc" },
    take: 5,
  });

  if (articles.length === 0) {
    const fallback = await prisma.article.findMany({
      orderBy: { publishedAt: "desc" },
      take: 5,
    });
    return fallback.map(mapArticleToDto);
  }

  return articles.map(mapArticleToDto);
}

export async function getTrendingNews(limit: number = 5): Promise<ArticleDTO[]> {
  const articles = await prisma.article.findMany({
    where: { isTrending: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  if (articles.length === 0) {
    const fallback = await prisma.article.findMany({
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
    return fallback.map(mapArticleToDto);
  }

  return articles.map(mapArticleToDto);
}

export async function getNewsByCategory(category: string, page: number = 1, limit: number = 10) {
  return getLatestNews(page, limit, category);
}

export async function getNewsBySlug(slug: string): Promise<ArticleDTO | null> {
  const article = await prisma.article.findUnique({
    where: { slug },
  });
  if (!article) return null;
  return mapArticleToDto(article);
}

export async function searchNews(query: string = "", category?: string, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  const whereClause: any = {};

  if (category && category !== "all") {
    whereClause.category = category;
  }

  if (query) {
    whereClause.OR = [
      { title: { contains: query } },
      { excerpt: { contains: query } },
      { tags: { contains: query } },
    ];
  }

  const [totalItems, articles] = await Promise.all([
    prisma.article.count({ where: whereClause }),
    prisma.article.findMany({
      where: whereClause,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  const pagination: PaginationDTO = {
    currentPage: page,
    totalPages,
    totalItems,
    pageSize: limit,
  };

  return {
    data: articles.map(mapArticleToDto),
    pagination,
  };
}

export async function getRelatedNews(slug: string, category?: string, limit: number = 3): Promise<ArticleDTO[]> {
  const whereClause: any = {
    slug: { not: slug },
  };
  if (category) {
    whereClause.category = category;
  }

  const articles = await prisma.article.findMany({
    where: whereClause,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  return articles.map(mapArticleToDto);
}
