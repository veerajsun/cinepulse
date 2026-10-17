"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";

interface SearchBarProps {
  initialQuery?: string;
  initialCategory?: string;
  onSearch?: (query: string, category: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = "",
  initialCategory = "all",
  onSearch,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery || searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || searchParams.get("category") || "all");

  const categories = [
    { id: "all", label: "All Desks" },
    { id: "movies", label: "Movies" },
    { id: "web-series", label: "Web Series" },
    { id: "anime", label: "Anime" },
    { id: "k-drama", label: "K-Drama" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query, selectedCategory);
    } else {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) onSearch("", selectedCategory);
  };

  return (
    <div className="w-full flex flex-col gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-surface-container-highest/60 shadow-xl">
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
        <SearchIcon className="absolute left-4 w-5 h-5 text-tertiary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, web series, anime, directors, box office..."
          className="w-full pl-12 pr-12 py-3.5 rounded-full bg-surface-container-lowest border border-surface-container-highest text-on-surface font-body-md placeholder:text-tertiary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container shadow-inner"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 p-1 rounded-full text-tertiary hover:text-on-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Category Tabs Filter */}
      <div className="flex flex-wrap items-center gap-space-xs font-label-md text-label-md">
        <span className="text-tertiary text-metadata mr-2">Filter Desk:</span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setSelectedCategory(cat.id);
              if (onSearch) onSearch(query, cat.id);
            }}
            className={`px-space-md py-1 rounded-full transition-all ${
              selectedCategory === cat.id
                ? "bg-primary-container text-on-primary-container shadow-sm font-semibold"
                : "bg-surface-container border border-surface-container-highest/40 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};
