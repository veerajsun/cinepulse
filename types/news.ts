export type CategoryType = "movies" | "web-series" | "anime" | "k-drama" | "trending";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  image: string;
  sourceName: string;
  sourceUrl: string;
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Source {
  id: string;
  name: string;
  url: string;
  logo?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
  message?: string;
  success: boolean;
}

export interface SearchParams {
  q?: string;
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
}
