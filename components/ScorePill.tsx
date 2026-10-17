import React from "react";

interface ScorePillProps {
  score: number;
  label?: string;
  className?: string;
}

export const ScorePill: React.FC<ScorePillProps> = ({ score, label = "Prestige Rating", className = "" }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 border border-secondary/60 text-secondary shadow-sm ${className}`}>
      <span className="material-symbols-outlined text-[14px]">star</span>
      <span className="font-label-md text-label-md font-bold text-secondary">{score.toFixed(1)}</span>
      {label && <span className="font-metadata text-[11px] text-tertiary hidden sm:inline">| {label}</span>}
    </div>
  );
};
