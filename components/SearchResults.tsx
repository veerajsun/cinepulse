import React from "react";
import { Article } from "@/types/news";
import { ArticleCard } from "./ArticleCard";
import { KeyArtCard } from "./KeyArtCard";
import { SearchX } from "lucide-react";

interface SearchResultsProps {
  articles: Article[];
  query?: string;
  category?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ articles, query, category }) => {
  if (articles.length === 0) {
    return (
      <div className="w-full py-space-xl px-space-lg rounded-xl bg-surface-container-low border border-surface-container-highest/40 flex flex-col items-center text-center gap-space-md my-space-lg">
        <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-tertiary">
          <SearchX className="w-7 h-7 text-primary-fixed-dim" />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <h3 className="font-playfair text-headline-md text-on-surface">No Dispatches Found</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            We couldn&apos;t find any stories matching {query ? `"${query}"` : "your criteria"}. Try searching for broader terms like "Dune", "Chainsaw Man", "Box Office", or "Netflix".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-space-lg">
      <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-highest/30">
        <h2 className="font-playfair text-headline-sm text-on-surface">
          Search Dispatches ({articles.length})
        </h2>
        {query && (
          <span className="font-metadata text-metadata text-secondary">
            Results for &ldquo;{query}&rdquo;
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {articles.map((article) => {
          if (article.category === "anime" || article.category === "k-drama") {
            return <KeyArtCard key={article.id} article={article} />;
          }
          return <ArticleCard key={article.id} article={article} />;
        })}
      </div>
    </div>
  );
};
