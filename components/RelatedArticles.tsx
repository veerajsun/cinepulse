import React from "react";
import { Article } from "@/types/news";
import { ArticleCard } from "./ArticleCard";

interface RelatedArticlesProps {
  articles: Article[];
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="w-full pt-space-xl border-t border-surface-container-highest/40 flex flex-col gap-space-lg">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-headline-lg text-on-surface flex items-center gap-space-xs">
          <span className="w-2 h-2 rounded-full bg-primary-container"></span>
          Related Dispatches & Coverage
        </h2>
        <span className="font-label-caps text-label-caps text-tertiary uppercase">Deep Dive</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {articles.map((item) => (
          <ArticleCard key={item.id} article={item} />
        ))}
      </div>
    </section>
  );
};
