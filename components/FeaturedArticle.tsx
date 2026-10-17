import React from "react";
import Link from "next/link";
import { Article } from "@/types/news";
import { CategoryBadge } from "./CategoryBadge";
import { ScorePill } from "./ScorePill";
import { Clock } from "lucide-react";

interface FeaturedArticleProps {
  article: Article;
}

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article }) => {
  return (
    <article className="group relative rounded-xl overflow-hidden bg-surface-container-low flex flex-col justify-end min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] shadow-2xl border border-surface-container-highest/30">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ backgroundImage: `url('${article.image}')` }}
      />
      
      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/80 via-transparent to-transparent hidden sm:block" />

      {/* Article Metadata & Content */}
      <div className="relative z-10 p-space-md sm:p-space-lg lg:p-space-xl flex flex-col gap-space-sm max-w-3xl">
        <div className="flex flex-wrap items-center gap-space-xs">
          <CategoryBadge category="Exclusive / Lead" variant="primary" />
          {article.subCategory && <CategoryBadge category={article.subCategory} variant="secondary" />}
          {article.score && <ScorePill score={article.score} className="ml-auto sm:ml-0" />}
        </div>

        <Link href={`/article/${article.slug}`}>
          <h1 className="font-playfair text-headline-xl sm:text-headline-xl lg:text-display-hero text-on-surface leading-tight tracking-tight group-hover:text-primary transition-colors">
            {article.title}
          </h1>
        </Link>

        <p className="font-body-lead text-body-lead text-on-surface-variant line-clamp-2 sm:line-clamp-3">
          {article.excerpt}
        </p>

        <div className="pt-space-sm flex flex-wrap items-center justify-between gap-space-md font-metadata text-metadata text-tertiary border-t border-surface-container-highest/40 mt-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="font-label-md text-on-surface">{article.sourceName}</span>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-tertiary" />
              {article.readTime || "4 min read"}
            </span>
          </div>

          <Link
            href={`/article/${article.slug}`}
            className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:underline"
          >
            Read Full Dispatch →
          </Link>
        </div>
      </div>
    </article>
  );
};
