import React from "react";
import { Article } from "@/types/news";
import { CategoryBadge } from "./CategoryBadge";
import { ScorePill } from "./ScorePill";
import { ExternalLink, Clock, Calendar, User } from "lucide-react";

interface ArticleHeroProps {
  article: Article;
}

export const ArticleHero: React.FC<ArticleHeroProps> = ({ article }) => {
  return (
    <div className="flex flex-col gap-space-lg w-full">
      {/* Category and Badges */}
      <div className="flex flex-wrap items-center gap-space-xs">
        <CategoryBadge category={article.category} variant="primary" />
        {article.subCategory && <CategoryBadge category={article.subCategory} variant="secondary" />}
        {article.score && <ScorePill score={article.score} />}
      </div>

      {/* Article Title */}
      <h1 className="font-playfair text-headline-xl sm:text-headline-xl lg:text-display-hero text-on-surface leading-tight tracking-tight">
        {article.title}
      </h1>

      {/* Subhead / Excerpt */}
      {article.excerpt && (
        <p className="font-body-lead text-body-lead text-on-surface-variant leading-relaxed max-w-4xl">
          {article.excerpt}
        </p>
      )}

      {/* Author and Metadata Bar */}
      <div className="py-space-md border-y border-surface-container-highest/40 flex flex-wrap items-center justify-between gap-space-md font-metadata text-metadata text-tertiary">
        <div className="flex flex-wrap items-center gap-space-md">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary-fixed-dim" />
            <span className="font-label-md text-on-surface">{article.author || "Variety Syndicate"}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-tertiary" />
            <span>{new Date(article.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-tertiary" />
            <span>{article.readTime || "4 min read"}</span>
          </div>
        </div>

        {/* Source Attribution Button */}
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-space-md py-1.5 rounded-full bg-surface-container-low border border-surface-container-highest/60 text-secondary hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md shadow-sm"
        >
          <span>Source: {article.sourceName}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 2.39:1 Anamorphic Image Cover */}
      <div className="relative rounded-xl overflow-hidden aspect-[21/9] bg-surface-container-high shadow-2xl border border-surface-container-highest/40 my-space-md">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${article.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />
      </div>

      {/* Original Source Excerpt Callout (RSS compliance requirement) */}
      <div className="p-space-md rounded-xl bg-surface-container-low/70 border border-secondary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md my-2">
        <div className="flex flex-col gap-1">
          <span className="font-label-caps text-[10px] text-secondary uppercase tracking-widest">
            Syndicated Wire Notice
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            This article is an executive summary curated from <strong>{article.sourceName}</strong>. Read the full unabridged dispatch at the primary source.
          </p>
        </div>
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-space-md py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:bg-secondary/90 transition-colors shrink-0 shadow-md flex items-center gap-1.5"
        >
          <span>Read Original Source</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
