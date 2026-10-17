import React from "react";
import { SkeletonLoader } from "@/components/SkeletonLoader";

export default function Loading() {
  return (
    <div className="w-full py-space-xl">
      <div className="max-w-[1440px] mx-auto px-margin flex flex-col gap-space-xl">
        <SkeletonLoader variant="hero" />
        <SkeletonLoader variant="grid" count={6} />
      </div>
    </div>
  );
}
