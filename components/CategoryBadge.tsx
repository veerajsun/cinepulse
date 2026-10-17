import React from "react";

interface CategoryBadgeProps {
  category: string;
  variant?: "primary" | "secondary" | "outline" | "kicker";
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  variant = "primary",
  className = "",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase tracking-widest shadow-sm px-2.5 py-1 rounded-full";
      case "secondary":
        return "bg-surface-container/80 backdrop-blur-md text-secondary font-metadata text-metadata px-2.5 py-1 rounded-full border border-surface-container-highest/50";
      case "outline":
        return "bg-surface-container-low text-on-surface-variant border border-surface-container-highest/60 font-metadata text-metadata px-2.5 py-1 rounded-full";
      case "kicker":
        return "font-label-caps text-label-caps uppercase tracking-widest text-primary-fixed-dim";
      default:
        return "bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase tracking-widest px-2.5 py-1 rounded-full";
    }
  };

  return (
    <span className={`${getVariantClasses()} ${className}`}>
      {category}
    </span>
  );
};
