"use client";

import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-surface-container-highest/40 pt-space-xl pb-space-lg text-on-surface">
      <div className="max-w-[1440px] mx-auto px-margin">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-xl border-b border-surface-container-highest/30">
          
          {/* Brand Manifesto & Info */}
          <div className="lg:col-span-2 flex flex-col gap-space-md pr-0 lg:pr-space-lg">
            <Link href="/" className="flex items-center gap-space-sm group">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container font-playfair font-bold text-xl shadow-md">
                C
              </div>
              <span className="font-playfair text-headline-md tracking-tight text-on-surface group-hover:text-primary transition-colors">
                CinePulse
              </span>
            </Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
              Prestige entertainment journalism bridging legacy cinematic trades with modern global fandoms. Real-time dispatches, critical reviews, box office analytics, and streaming radars.
            </p>
            <div className="flex items-center gap-space-xs font-metadata text-metadata text-tertiary">
              <span>© 2026 CinePulse Syndicate. All rights reserved.</span>
            </div>
          </div>

          {/* Column 1: Vertical Desks */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-primary-fixed-dim">
              Editorial Desks
            </h4>
            <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <li><Link href="/movies" className="hover:text-on-surface transition-colors">Film News & Reviews</Link></li>
              <li><Link href="/movies" className="hover:text-on-surface transition-colors">Box Office Radar</Link></li>
              <li><Link href="/web-series" className="hover:text-on-surface transition-colors">OTT Binge Hub</Link></li>
              <li><Link href="/anime" className="hover:text-on-surface transition-colors">Japanese Animation</Link></li>
              <li><Link href="/k-drama" className="hover:text-on-surface transition-colors">Korean Drama Dispatch</Link></li>
              <li><Link href="/trending" className="hover:text-on-surface transition-colors">Real-Time Pulse</Link></li>
            </ul>
          </div>

          {/* Column 2: Company & Legal */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-primary-fixed-dim">
              Syndication
            </h4>
            <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <li><a href="#" className="hover:text-on-surface transition-colors">RSS Wire Feeds</a></li>
              <li><a href="#" className="hover:text-on-surface transition-colors">Press & Contact</a></li>
              <li><a href="#" className="hover:text-on-surface transition-colors">Editorial Ethics Policy</a></li>
              <li><a href="#" className="hover:text-on-surface transition-colors">Privacy & Terms</a></li>
              <li><a href="#" className="hover:text-on-surface transition-colors">API Access</a></li>
            </ul>
          </div>

          {/* Column 3: Dispatch Newsletter */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-primary-fixed-dim">
              Daily Dispatch
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Get the midnight industry wire delivered straight to your inbox.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed to CinePulse Daily Dispatch!"); }} className="flex flex-col gap-space-xs mt-1">
              <input
                type="email"
                placeholder="Enter email address..."
                className="w-full px-space-md py-2 rounded-lg bg-surface-container-low border border-surface-container-highest/60 text-on-surface font-body-sm placeholder:text-tertiary focus:outline-none focus:border-primary-container"
                required
              />
              <button
                type="submit"
                className="w-full py-2 px-space-md rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary-container/90 transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm font-metadata text-metadata text-tertiary">
          <span>Cinematic Editorial Noir Design System • Built with Next.js App Router</span>
          <div className="flex items-center gap-space-md">
            <Link href="/" className="hover:text-on-surface">Home</Link>
            <Link href="/search" className="hover:text-on-surface">Search</Link>
            <Link href="/trending" className="hover:text-on-surface">Trending</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
