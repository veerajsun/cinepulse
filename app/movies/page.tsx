import React from "react";
import { getNewsByCategory, getTrendingNews } from "@/lib/api";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { ArticleCard } from "@/components/ArticleCard";
import { Sidebar } from "@/components/Sidebar";

export const metadata = {
  title: "Movies & Box Office — CinePulse",
  description: "Film news, box office analysis, festival coverage, and critical reviews.",
};

export default async function MoviesPage() {
  const [movieArticles, trendingArticles] = await Promise.all([
    getNewsByCategory("movies", 12),
    getTrendingNews(5),
  ]);

  const leadArticle = movieArticles[0];
  const gridArticles = movieArticles.slice(1);

  return (
    <div className="w-full py-space-xl">
      <div className="max-w-[1440px] mx-auto px-margin flex flex-col gap-space-xl">
        {/* Category Header Banner */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container-highest/40 flex flex-col gap-space-xs">
          <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest">
            Editorial Desk
          </span>
          <h1 className="font-playfair text-display-hero text-on-surface">
            Movies & Box Office
          </h1>
          <p className="font-body-lead text-body-lead text-on-surface-variant max-w-2xl">
            Prestige coverage of theatrical releases, festival premieres, box office analytics, and critical film reviews.
          </p>
        </div>

        {/* Hero Lead & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-8 flex flex-col gap-space-xl">
            {leadArticle && <FeaturedArticle article={leadArticle} />}

            <div className="flex flex-col gap-space-md pt-space-md">
              <h2 className="font-playfair text-headline-lg text-on-surface border-b border-surface-container-highest/30 pb-space-xs">
                Recent Film Dispatches
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {gridArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <Sidebar trendingArticles={trendingArticles} />
          </div>
        </div>
      </div>
    </div>
  );
}
