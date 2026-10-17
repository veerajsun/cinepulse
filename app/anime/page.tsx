import React from "react";
import { getNewsByCategory, getTrendingNews } from "@/lib/api";
import { KeyArtCard } from "@/components/KeyArtCard";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { Sidebar } from "@/components/Sidebar";

export const metadata = {
  title: "Anime & Manga — CinePulse",
  description: "Japanese animation news, studio wires, seasonal slates, and manga announcements.",
};

export default async function AnimePage() {
  const [animeArticles, trendingArticles] = await Promise.all([
    getNewsByCategory("anime", 12),
    getTrendingNews(5),
  ]);

  const leadArticle = animeArticles[0];

  return (
    <div className="w-full py-space-xl">
      <div className="max-w-[1440px] mx-auto px-margin flex flex-col gap-space-xl">
        {/* Category Header Banner */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container-highest/40 flex flex-col gap-space-xs">
          <span className="font-label-caps text-label-caps uppercase text-primary-fixed-dim tracking-widest">
            Studio Wires & Manga Desk
          </span>
          <h1 className="font-playfair text-display-hero text-on-surface">
            Anime & Japanese Animation
          </h1>
          <p className="font-body-lead text-body-lead text-on-surface-variant max-w-2xl">
            Seasonal slates from Studio MAPPA, Ufotable, Wit Studio, CloverWorks, plus theatrical releases and Crunchyroll streaming radar.
          </p>
        </div>

        {/* Lead Featured Article */}
        {leadArticle && <FeaturedArticle article={leadArticle} />}

        {/* Key-Art 3:4 Poster Grid & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            <h2 className="font-playfair text-headline-lg text-on-surface border-b border-surface-container-highest/30 pb-space-xs">
              Seasonal Key-Art & Slate Dispatches
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-gutter">
              {animeArticles.map((article) => (
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
