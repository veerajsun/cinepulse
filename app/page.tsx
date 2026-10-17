import React from "react";
import Link from "next/link";
import { getLatestNews, getFeaturedNews, getTrendingNews } from "@/lib/api";
import { Ticker } from "@/components/Ticker";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { ArticleCard } from "@/components/ArticleCard";
import { KeyArtCard } from "@/components/KeyArtCard";
import { Sidebar } from "@/components/Sidebar";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const [featuredArticles, latestArticles, trendingArticles] = await Promise.all([
    getFeaturedNews(),
    getLatestNews(12),
    getTrendingNews(5),
  ]);

  const masterArticle = featuredArticles[0] || latestArticles[0];
  const movieArticles = latestArticles.filter((a) => a.category === "movies").slice(0, 3);
  const animeArticles = latestArticles.filter((a) => a.category === "anime").slice(0, 4);
  const kdramaArticles = latestArticles.filter((a) => a.category === "k-drama").slice(0, 4);
  const webSeriesArticles = latestArticles.filter((a) => a.category === "web-series").slice(0, 3);

  return (
    <div className="w-full flex flex-col">
      {/* 1. Flash Ticker Strip */}
      <Ticker />

      {/* 2. Hero Dispatch & Sidebar Grid */}
      <section className="w-full py-space-lg lg:py-space-xl">
        <div className="max-w-[1440px] mx-auto px-margin">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* Main 8-cols: Featured Hero */}
            <div className="lg:col-span-8 flex flex-col gap-space-xl">
              {masterArticle && <FeaturedArticle article={masterArticle} />}

              {/* Secondary Lead Articles Grid */}
              <div className="flex flex-col gap-space-md pt-space-md">
                <div className="flex items-center justify-between border-b border-surface-container-highest/30 pb-space-xs">
                  <h2 className="font-playfair text-headline-lg text-on-surface flex items-center gap-space-xs">
                    <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                    Cinema & Box Office Wire
                  </h2>
                  <Link href="/movies" className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1">
                    View All Movies <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                  {movieArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4-cols: Sidebar */}
            <div className="lg:col-span-4">
              <Sidebar trendingArticles={trendingArticles} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Anime & Manga Slate (3:4 Key-Art Poster Grid) */}
      <section className="w-full py-space-xl bg-surface-container-lowest/60 border-y border-surface-container-highest/30">
        <div className="max-w-[1440px] mx-auto px-margin flex flex-col gap-space-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest">
                Studio Wires & Seasonal Slates
              </span>
              <h2 className="font-playfair text-headline-lg text-on-surface">
                Anime & Manga Hub
              </h2>
            </div>
            <Link href="/anime" className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1">
              Full Anime Slate <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {animeArticles.map((article) => (
              <KeyArtCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. K-Drama Ratings Radar */}
      <section className="w-full py-space-xl">
        <div className="max-w-[1440px] mx-auto px-margin flex flex-col gap-space-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-primary-fixed-dim tracking-widest">
                Hallyu Waves & Ratings Radar
              </span>
              <h2 className="font-playfair text-headline-lg text-on-surface">
                Korean Drama Dispatches
              </h2>
            </div>
            <Link href="/k-drama" className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1">
              Explore K-Drama <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {kdramaArticles.map((article) => (
              <KeyArtCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Web Series & OTT Binge Radar */}
      <section className="w-full py-space-xl bg-surface-container-lowest/40 border-t border-surface-container-highest/30">
        <div className="max-w-[1440px] mx-auto px-margin flex flex-col gap-space-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest">
                Platform Hubs & Episode Recaps
              </span>
              <h2 className="font-playfair text-headline-lg text-on-surface">
                Web Series & OTT Binge Radar
              </h2>
            </div>
            <Link href="/web-series" className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1">
              All OTT Dispatches <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {webSeriesArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
