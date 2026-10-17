"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("CinePulse Runtime Error:", error);
  }, [error]);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center py-space-xl px-margin text-center">
      <div className="w-16 h-16 rounded-full bg-error-container/30 border border-error/40 flex items-center justify-center text-error mb-space-md">
        <AlertTriangle className="w-8 h-8 text-error" />
      </div>
      <span className="font-label-caps text-label-caps text-error uppercase tracking-widest mb-2">
        System Interruption
      </span>
      <h1 className="font-playfair text-headline-xl text-on-surface mb-space-xs">
        Failed to Load Dispatch Stream
      </h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mb-space-lg">
        An unexpected error occurred while fetching news feeds. Please try refreshing the wire or return to the main dashboard.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-space-sm">
        <button
          onClick={() => reset()}
          className="px-space-lg py-2.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary-container/90 transition-all inline-flex items-center gap-2 shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
        <Link
          href="/"
          className="px-space-lg py-2.5 rounded-full bg-surface-container-low border border-surface-container-highest text-on-surface font-label-md text-label-md hover:bg-surface-container transition-all inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Home Dashboard
        </Link>
      </div>
    </div>
  );
}
