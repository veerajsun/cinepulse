import React from "react";
import Link from "next/link";
import { Article } from "@/types/news";
import { ScorePill } from "./ScorePill";
import { Tv } from "lucide-react";

interface KeyArtCardProps {
  article: Article;
}

export const KeyArtCard: React.FC<KeyArtCardProps> = ({ article }) => {
  return (
    <article className="group rounded-xl overflow-hidden bg-surface-container-low border border-surface-container-highest/40 flex flex-col h-full hover:border-outline-variant/60 transition-all shadow-md">
      {/* 3:4 Portrait Key-Art Image Container */}
      <Link href={`/article/${article.slug}`} className="relative block overflow-hidden aspect-[3/4] bg-surface-container-high">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${article.image}')` }}
        />
        {/* Directional Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {article.episodes && (
            <span className="px-2 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur-md text-secondary font-label-caps text-[10px] uppercase tracking-wider border border-surface-container-highest/50">
              {article.episodes}
            </span>
          )}
          {article.score && (
            <ScorePill score={article.score} label="" className="ml-auto" />
          )}
        </div>

        {/* Bottom Title & Overlay Info */}
        <div className="absolute bottom-0 inset-x-0 p-space-md flex flex-col gap-space-xs">
          {article.platform && (
            <div className="flex items-center gap-1 font-metadata text-[11px] text-primary-fixed-dim">
              <Tv className="w-3 h-3 text-primary-fixed-dim" />
              <span>{article.platform}</span>
            </div>
          )}

          <h3 className="font-playfair text-headline-sm text-on-surface line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {article.title}
          </h3>

          <div className="flex items-center justify-between font-metadata text-metadata text-tertiary pt-1">
            <span>{article.sourceName}</span>
            <span className="text-primary font-label-md group-hover:underline">View Slate →</span>
          </div>
        </div>
      </Link>
    </article>
  );
};
