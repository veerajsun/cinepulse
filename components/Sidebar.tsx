import React from "react";
import { Article } from "@/types/news";
import { TrendingList } from "./TrendingList";
import { Newsletter } from "./Newsletter";

interface SidebarProps {
  trendingArticles: Article[];
}

export const Sidebar: React.FC<SidebarProps> = ({ trendingArticles }) => {
  return (
    <aside className="w-full flex flex-col gap-space-xl">
      {/* Box Office Spotlight Widget */}
      <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container-highest/40 flex flex-col gap-space-md">
        <div className="flex items-center justify-between border-b border-surface-container-highest/30 pb-space-xs">
          <h3 className="font-playfair text-headline-sm text-on-surface">Box Office Radar</h3>
          <span className="font-label-caps text-[10px] text-secondary">Global Weekend</span>
        </div>

        <div className="flex flex-col gap-space-sm font-metadata text-metadata">
          <div className="flex items-center justify-between p-2 rounded bg-surface-container-high/50">
            <span className="font-label-md text-on-surface">1. Dune: Part Two</span>
            <span className="font-bold text-secondary">$711.8M</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-surface-container-high/50">
            <span className="font-label-md text-on-surface">2. Inside Out 2</span>
            <span className="font-bold text-secondary">$1,698M</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-surface-container-high/50">
            <span className="font-label-md text-on-surface">3. Deadpool & Wolverine</span>
            <span className="font-bold text-secondary">$1,337M</span>
          </div>
        </div>
      </div>

      {/* Trending Dispatches List */}
      <TrendingList articles={trendingArticles} />

      {/* Newsletter */}
      <Newsletter />
    </aside>
  );
};
