import React from "react";

interface SkeletonLoaderProps {
  variant?: "hero" | "grid" | "article";
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = "grid",
  count = 3,
}) => {
  if (variant === "hero") {
    return (
      <div className="w-full h-[560px] rounded-xl bg-surface-container-low animate-pulse border border-surface-container-highest/30 p-space-xl flex flex-col justify-end gap-space-md">
        <div className="w-32 h-6 rounded bg-surface-container-high" />
        <div className="w-3/4 h-12 rounded bg-surface-container-high" />
        <div className="w-1/2 h-6 rounded bg-surface-container-high" />
      </div>
    );
  }

  if (variant === "article") {
    return (
      <div className="w-full flex flex-col gap-space-lg animate-pulse py-space-xl">
        <div className="w-24 h-6 rounded bg-surface-container-high" />
        <div className="w-full h-14 rounded bg-surface-container-high" />
        <div className="w-full h-96 rounded-xl bg-surface-container-high" />
        <div className="space-y-4">
          <div className="w-full h-4 rounded bg-surface-container-high" />
          <div className="w-5/6 h-4 rounded bg-surface-container-high" />
          <div className="w-4/6 h-4 rounded bg-surface-container-high" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl overflow-hidden bg-surface-container-low border border-surface-container-highest/30 flex flex-col h-80 animate-pulse p-space-md gap-space-md"
        >
          <div className="w-full h-40 rounded-lg bg-surface-container-high" />
          <div className="w-3/4 h-6 rounded bg-surface-container-high" />
          <div className="w-1/2 h-4 rounded bg-surface-container-high" />
        </div>
      ))}
    </div>
  );
};
