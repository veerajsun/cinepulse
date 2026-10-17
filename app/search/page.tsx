import React, { Suspense } from "react";
import { searchNews } from "@/lib/api";
import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "@/components/SearchResults";
import { SkeletonLoader } from "@/components/SkeletonLoader";

export const metadata = {
  title: "Search Dispatches & News — CinePulse",
  description: "Search movies, web series, anime, K-drama, box office reviews, and directors.",
};

interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
  };
}

async function SearchContent({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const category = searchParams.category || "all";

  const results = await searchNews({ q: query, category });

  return (
    <div className="flex flex-col gap-space-xl">
      <SearchBar initialQuery={query} initialCategory={category} />
      <SearchResults articles={results} query={query} category={category} />
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="w-full py-space-xl">
      <div className="max-w-[1440px] mx-auto px-margin flex flex-col gap-space-xl">
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container-highest/40 flex flex-col gap-space-xs">
          <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest">
            Dispatch Search Engine
          </span>
          <h1 className="font-playfair text-display-hero text-on-surface">
            Search & Discovery
          </h1>
          <p className="font-body-lead text-body-lead text-on-surface-variant max-w-2xl">
            Explore our comprehensive archive of cinematic news, reviews, studio slates, and streaming developments.
          </p>
        </div>

        <Suspense fallback={<SkeletonLoader variant="grid" count={6} />}>
          <SearchContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
