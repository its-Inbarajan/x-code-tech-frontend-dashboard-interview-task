import { cn } from "@/lib/utils";
import React from "react";

export const Loader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      aria-label="loader"
      className={cn(
        `w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin`,
        className
      )}
    />
  );
};
