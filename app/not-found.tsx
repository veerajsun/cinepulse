import React from "react";
import Link from "next/link";
import { ArrowLeft, Film } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center py-space-xl px-margin text-center">
      <div className="w-20 h-20 rounded-full bg-surface-container-low border border-surface-container-highest flex items-center justify-center text-primary mb-space-md shadow-xl">
        <Film className="w-10 h-10 text-primary-fixed-dim" />
      </div>
      <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-2">
        Error 404
      </span>
      <h1 className="font-playfair text-display-hero text-on-surface mb-space-xs">
        Dispatch Not Found
      </h1>
      <p className="font-body-lead text-body-lead text-on-surface-variant max-w-md mb-space-lg">
        The story, review, or category you are looking for has been archived or moved to another desk.
      </p>
      <Link
        href="/"
        className="px-space-lg py-3 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary-container/90 transition-all inline-flex items-center gap-2 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Home Page
      </Link>
    </div>
  );
}
