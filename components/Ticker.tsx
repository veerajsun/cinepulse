"use client";

import React from "react";
import Link from "next/link";
import { MOCK_FLASH_NEWS } from "@/data/mockNews";

export const Ticker: React.FC = () => {
  return (
    <section className="w-full bg-surface-container-lowest text-on-surface py-2.5 overflow-hidden border-b border-surface-container-highest/30">
      <div className="max-w-[1440px] mx-auto px-margin flex items-center gap-space-md">
        <div className="flex items-center gap-space-xs shrink-0 px-2.5 py-0.5 rounded bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          <span>Flash</span>
        </div>
        <div className="relative overflow-hidden w-full whitespace-nowrap flex items-center">
          <div className="flex items-center gap-space-lg font-metadata text-metadata text-on-surface-variant animate-marquee">
            {MOCK_FLASH_NEWS.concat(MOCK_FLASH_NEWS).map((item, idx) => (
              <React.Fragment key={idx}>
                <span className="inline-flex items-center gap-space-xs">
                  <span className="text-secondary font-label-md uppercase">{item.tag}:</span>
                  <Link href="/search" className="hover:text-primary transition-colors">
                    {item.title}
                  </Link>
                </span>
                <span className="text-tertiary-container">•</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
