import React from "react";
import { getNewsByCategory, getTrendingNews } from "@/lib/api";
import { KeyArtCard } from "@/components/KeyArtCard";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { Sidebar } from "@/components/Sidebar";

export const metadata = {
  title: "K-Drama Dispatches & Ratings Radar — CinePulse",
  description: "Korean drama updates, viewership ratings radar, Studio Dragon slates, and Hallyu waves.",
};

export default async function KDramaPage() {
  const [kdramaArticles, trendingArticles] = await Promise.all([
    getNewsByCategory("k-drama", 12),
    getTrendingNews(5),
  ]);

  const leadArticle = kdramaArticles[0];

  return (
    <div className="w-full py-space-xl">
      <div className="max-w-[1440px] mx-auto px-margin flex flex-col gap-space-xl">
        {/* Category Header Banner */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container-highest/40 flex flex-col gap-space-xs">
          <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest">
            Hallyu Waves Desk
          </span>
          <h1 className="font-playfair text-display-hero text-on-surface">
            K-Drama & Korean Entertainment
          </h1>
          <p className="font-body-lead text-body-lead text-on-surface-variant max-w-2xl">
            Viewership ratings breakdowns, Studio Dragon & tvN production slates, Netflix Korean originals, and star casting announcements.
          </p>
        </div>

        {/* Lead Featured Article */}
        {leadArticle && <FeaturedArticle article={leadArticle} />}

        {/* Key-Art 3:4 Poster Grid & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            <h2 className="font-playfair text-headline-lg text-on-surface border-b border-surface-container-highest/30 pb-space-xs">
              Ratings Radar & Drama Slates
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-gutter">
              {kdramaArticles.map((article) => (
                <KeyArtCard key={article.id} article={article} />
              ))}
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
