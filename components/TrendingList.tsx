import React from "react";
import Link from "next/link";
import { Article } from "@/types/news";
import { Clock } from "lucide-react";

interface TrendingListProps {
  articles: Article[];
  title?: string;
}

export const TrendingList: React.FC<TrendingListProps> = ({ articles, title = "Trending Dispatches" }) => {
  return (
    <div className="flex flex-col gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-surface-container-highest/40">
      <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-highest/30">
        <h3 className="font-playfair text-headline-sm text-on-surface flex items-center gap-space-xs">
          <span className="w-2 h-2 rounded-full bg-primary-container"></span>
          {title}
        </h3>
        <span className="font-label-caps text-label-caps uppercase text-tertiary">Real-Time Pulse</span>
      </div>

      <div className="flex flex-col divide-y divide-surface-container-highest/30">
        {articles.map((article, idx) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="py-space-md first:pt-0 last:pb-0 flex items-start gap-space-md group"
          >
            <span className="font-playfair font-bold text-3xl text-surface-container-highest group-hover:text-primary transition-colors shrink-0 w-8">
              0{idx + 1}
            </span>
            <div className="flex flex-col gap-1 flex-grow">
              <span className="font-label-caps text-[10px] uppercase tracking-wider text-secondary">
                {article.category}
              </span>
              <h4 className="font-playfair text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 font-metadata text-[11px] text-tertiary pt-1">
                <span>{article.sourceName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-tertiary" />
                  {article.readTime || "4m"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
