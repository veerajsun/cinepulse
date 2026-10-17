import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-space-xs py-space-xl">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange && onPageChange(currentPage - 1)}
        className="p-2 rounded-lg bg-surface-container-low border border-surface-container-highest/60 text-on-surface-variant hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {Array.from({ length: totalPages }).map((_, idx) => {
        const pageNum = idx + 1;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange && onPageChange(pageNum)}
            className={`w-10 h-10 rounded-lg font-label-md text-label-md transition-all ${
              currentPage === pageNum
                ? "bg-primary-container text-on-primary-container font-bold shadow-md"
                : "bg-surface-container-low border border-surface-container-highest/40 text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange && onPageChange(currentPage + 1)}
        className="p-2 rounded-lg bg-surface-container-low border border-surface-container-highest/60 text-on-surface-variant hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
