import { Article, ApiResponse, CategoryType, SearchParams } from "@/types/news";
import { MOCK_ARTICLES } from "@/data/mockNews";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  if (!API_BASE_URL) {
    return null;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3000ms timeout for reliable local API calls
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: "no-store",
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }
    const json: ApiResponse<T> = await response.json();
    return json.data;
  } catch (err) {
    return null;
  }
}

export async function getLatestNews(limit: number = 10): Promise<Article[]> {
  const apiData = await fetchFromApi<Article[]>(`/news/latest?limit=${limit}`);
  if (apiData) return apiData;
  return MOCK_ARTICLES.slice(0, limit);
}

export async function getFeaturedNews(): Promise<Article[]> {
  const apiData = await fetchFromApi<Article[]>(`/news/featured`);
  if (apiData) return apiData;
  return MOCK_ARTICLES.filter((item) => item.isFeatured);
}

export async function getTrendingNews(limit: number = 5): Promise<Article[]> {
  const apiData = await fetchFromApi<Article[]>(`/news/trending?limit=${limit}`);
  if (apiData) return apiData;
  return MOCK_ARTICLES.filter((item) => item.isTrending).slice(0, limit);
}

export async function getNewsByCategory(category: CategoryType, limit: number = 10): Promise<Article[]> {
  if (category === "trending") {
    return getTrendingNews(limit);
  }
  const apiData = await fetchFromApi<Article[]>(`/news/category/${category}?limit=${limit}`);
  if (apiData) return apiData;
  return MOCK_ARTICLES.filter((item) => item.category === category).slice(0, limit);
}

export async function getNewsBySlug(slug: string): Promise<Article | null> {
  const apiData = await fetchFromApi<Article>(`/news/slug/${slug}`);
  if (apiData) return apiData;
  const found = MOCK_ARTICLES.find((item) => item.slug === slug);
  return found || MOCK_ARTICLES[0];
}

export async function searchNews(params: SearchParams): Promise<Article[]> {
  const query = params.q?.toLowerCase() || "";
  const category = params.category?.toLowerCase();
  
  const apiData = await fetchFromApi<Article[]>(`/news/search?q=${encodeURIComponent(query)}&category=${category || ""}`);
  if (apiData) return apiData;

  return MOCK_ARTICLES.filter((item) => {
    const matchesQuery = !query || item.title.toLowerCase().includes(query) || item.excerpt.toLowerCase().includes(query) || item.tags?.some((t) => t.toLowerCase().includes(query));
    const matchesCategory = !category || category === "all" || item.category === category;
    return matchesQuery && matchesCategory;
  });
}

export async function getRelatedNews(currentSlug: string, category: CategoryType, limit: number = 3): Promise<Article[]> {
  const apiData = await fetchFromApi<Article[]>(`/news/related?slug=${currentSlug}&category=${category}&limit=${limit}`);
  if (apiData) return apiData;

  return MOCK_ARTICLES.filter((item) => item.slug !== currentSlug && (item.category === category || item.isFeatured)).slice(0, limit);
}
