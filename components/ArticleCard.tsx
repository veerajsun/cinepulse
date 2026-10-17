import React from "react";
import Link from "next/link";
import { Article } from "@/types/news";
import { ScorePill } from "./ScorePill";
import { Clock } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  aspectRatio?: "16:9" | "4:3" | "3:4";
  showExcerpt?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  aspectRatio = "16:9",
  showExcerpt = true,
}) => {
  return (
    <article className="group rounded-xl overflow-hidden bg-surface-container-low border border-surface-container-highest/40 flex flex-col h-full hover:border-outline-variant/60 transition-all shadow-md">
      {/* Thumbnail Container */}
      <Link href={`/article/${article.slug}`} className="relative block overflow-hidden aspect-video bg-surface-container-high">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${article.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Category tag overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-primary font-label-caps text-[10px] uppercase tracking-wider border border-surface-container-highest/50">
            {article.subCategory || article.category}
          </span>
        </div>

        {article.score && (
          <div className="absolute bottom-3 right-3">
            <ScorePill score={article.score} label="" />
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-space-md flex flex-col flex-grow justify-between gap-space-sm">
        <div className="flex flex-col gap-space-xs">
          <Link href={`/article/${article.slug}`}>
            <h3 className="font-playfair text-headline-sm text-on-surface line-clamp-2 group-hover:text-primary transition-colors leading-snug">
              {article.title}
            </h3>
          </Link>
          
          {showExcerpt && (
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Card Footer Metadata */}
        <div className="pt-space-xs flex items-center justify-between font-metadata text-metadata text-tertiary border-t border-surface-container-highest/30">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-label-md text-on-surface truncate">{article.sourceName}</span>
            <span>•</span>
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3 text-tertiary" />
              {article.readTime || "3m"}
            </span>
          </div>
          <Link href={`/article/${article.slug}`} className="text-primary hover:underline font-label-md shrink-0">
            Dispatch →
          </Link>
        </div>
      </div>
    </article>
  );
};
