import React from "react";
import { getTrendingNews, getLatestNews } from "@/lib/api";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { ArticleCard } from "@/components/ArticleCard";
import { TrendingList } from "@/components/TrendingList";
import { Sidebar } from "@/components/Sidebar";

export const metadata = {
  title: "Real-Time Trending Pulse — CinePulse",
  description: "Most read entertainment stories, viral dispatches, and cross-platform popularity rankings.",
};

export default async function TrendingPage() {
  const [trendingArticles, latestArticles] = await Promise.all([
    getTrendingNews(10),
    getLatestNews(6),
  ]);

  const topTrending = trendingArticles[0];

  return (
    <div className="w-full py-space-xl">
      <div className="max-w-[1440px] mx-auto px-margin flex flex-col gap-space-xl">
        {/* Category Header Banner */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container-highest/40 flex flex-col gap-space-xs">
          <span className="font-label-caps text-label-caps uppercase text-primary-container tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Live Analytics
          </span>
          <h1 className="font-playfair text-display-hero text-on-surface">
            Real-Time Entertainment Pulse
          </h1>
          <p className="font-body-lead text-body-lead text-on-surface-variant max-w-2xl">
            Ranked by reader velocity, global social sentiment, and viral syndicate traffic across all major desks.
          </p>
        </div>

        {/* Top #1 Trending Lead */}
        {topTrending && <FeaturedArticle article={topTrending} />}

        {/* Grid & Trending List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            <h2 className="font-playfair text-headline-lg text-on-surface border-b border-surface-container-highest/30 pb-space-xs">
              Most Read Stories Across All Desks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {trendingArticles.slice(1).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-space-xl">
            <TrendingList articles={trendingArticles} title="Live Popularity Rank" />
            <Sidebar trendingArticles={latestArticles.slice(0, 4)} />
          </div>
        </div>
      </div>
    </div>
  );
}
