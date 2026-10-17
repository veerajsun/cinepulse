import React from "react";
import { getNewsByCategory, getTrendingNews } from "@/lib/api";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { ArticleCard } from "@/components/ArticleCard";
import { Sidebar } from "@/components/Sidebar";

export const metadata = {
  title: "Web Series & OTT Binge Radar — CinePulse",
  description: "Streaming dispatches, platform hubs, television reviews, and episodic markers.",
};

export default async function WebSeriesPage() {
  const [seriesArticles, trendingArticles] = await Promise.all([
    getNewsByCategory("web-series", 12),
    getTrendingNews(5),
  ]);

  const leadArticle = seriesArticles[0];
  const gridArticles = seriesArticles.slice(1);

  return (
    <div className="w-full py-space-xl">
      <div className="max-w-[1440px] mx-auto px-margin flex flex-col gap-space-xl">
        {/* Category Header Banner */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container-highest/40 flex flex-col gap-space-xs">
          <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest">
            Streaming Desk
          </span>
          <h1 className="font-playfair text-display-hero text-on-surface">
            Web Series & OTT Radar
          </h1>
          <p className="font-body-lead text-body-lead text-on-surface-variant max-w-2xl">
            Insiders look into Netflix, Apple TV+, HBO Max, Disney+, and prime original series debuts, season renewals, and episodic breakdowns.
          </p>
        </div>

        {/* Hero Lead & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-8 flex flex-col gap-space-xl">
            {leadArticle && <FeaturedArticle article={leadArticle} />}

            <div className="flex flex-col gap-space-md pt-space-md">
              <h2 className="font-playfair text-headline-lg text-on-surface border-b border-surface-container-highest/30 pb-space-xs">
                Platform Hub Dispatches
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
