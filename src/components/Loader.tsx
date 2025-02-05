// src/components/Loader.tsx
import React from "react";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  className = "",
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-slate-200 border-t-slate-800`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
