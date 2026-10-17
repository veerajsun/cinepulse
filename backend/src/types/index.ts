export type CategoryType = "movies" | "web-series" | "anime" | "k-drama" | "general" | "trending";

export interface ArticleDTO {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  image: string; // mapped from imageUrl for frontend compatibility
  sourceName: string;
  sourceUrl: string;
  canonicalUrl?: string;
  publishedAt: string;
  category: CategoryType;
  subCategory?: string;
  tags?: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  readTime?: string;
  score?: number;
  author?: string;
  episodes?: string;
  platform?: string;
  rank?: number;
}

export interface PaginationDTO {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface ApiResponseDTO<T> {
  success: boolean;
  data: T;
  pagination?: PaginationDTO;
  message?: string;
}

export interface RssFeedConfig {
  id: string;
  name: string;
  url: string;
  category: CategoryType;
  enabled: boolean;
  priority?: number;
  fetchInterval?: number;
}

export interface NormalizedItem {
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  imageUrl: string;
  sourceName: string;
  sourceUrl: string;
  canonicalUrl: string;
  publishedAt: Date;
  guid: string;
  category: CategoryType;
  tags: string[];
}
