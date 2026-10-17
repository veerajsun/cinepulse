"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Rss, Moon, Sun, User, Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Movies", href: "/movies" },
    { label: "Web Series", href: "/web-series" },
    { label: "Anime", href: "/anime" },
    { label: "K-Drama", href: "/k-drama" },
    { label: "Trending", href: "/trending" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-surface-container-highest/40">
      <div className="h-20 max-w-[1440px] mx-auto px-margin flex items-center justify-between gap-gutter">
        {/* Brand & Live Dispatch Badge */}
        <div className="flex items-center gap-space-md">
          <Link href="/" className="flex items-center gap-space-sm group">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container font-playfair font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              C
            </div>
            <span className="font-playfair text-headline-md tracking-tight text-on-surface group-hover:text-primary transition-colors">
              CinePulse
            </span>
          </Link>
          
          <div className="hidden xl:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container border border-surface-container-highest/60">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary-fixed">
              Live Dispatch
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-space-xs p-1 rounded-full bg-surface-container-lowest border border-surface-container-highest/30">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all ${
                isActive(item.href)
                  ? "bg-surface-container-high text-on-surface font-semibold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-space-sm">
          {/* Quick Search Button */}
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-space-sm px-space-md py-1.5 rounded-full bg-surface-container-low border border-surface-container-highest/50 text-on-surface-variant hover:border-outline-variant hover:text-on-surface transition-all group"
          >
            <Search className="w-4 h-4 text-tertiary group-hover:text-primary transition-colors" />
            <span className="font-metadata text-metadata text-tertiary">Search dispatch...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-metadata text-[10px] text-on-surface-variant border border-surface-container-highest">
              ⌘K
            </kbd>
          </Link>

          {/* RSS Feed Button */}
          <button
            aria-label="RSS Feed"
            className="w-9 h-9 rounded-full bg-surface-container-low border border-surface-container-highest/50 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
            onClick={() => alert("CinePulse RSS Feed: Available for syndicate integration.")}
          >
            <Rss className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full bg-surface-container-low border border-surface-container-highest/50 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* User Profile Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm">
            <User className="w-4 h-4" />
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            aria-label="Open menu"
            className="lg:hidden w-9 h-9 rounded-full bg-surface-container-low border border-surface-container-highest/50 flex items-center justify-center text-on-surface-variant hover:text-on-surface"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest/95 backdrop-blur-2xl border-b border-surface-container-highest/60 px-margin py-space-md flex flex-col gap-space-sm animate-in slide-in-from-top duration-200">
          <Link
            href="/search"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-space-sm px-space-md py-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest/50 text-on-surface-variant mb-2"
          >
            <Search className="w-4 h-4 text-tertiary" />
            <span className="font-metadata text-metadata">Search all dispatches & news...</span>
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-space-md py-2.5 rounded-xl font-label-md text-body-md transition-all ${
                isActive(item.href)
                  ? "bg-surface-container-high text-on-surface font-semibold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
