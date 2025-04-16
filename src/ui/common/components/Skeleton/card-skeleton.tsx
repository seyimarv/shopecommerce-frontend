"use client";
import React from "react";

interface CardSkeletonProps {
  type?: "collections" | "default";
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ type = "default" }) => {
  return (
    <div className="animate-pulse w-full flex flex-col gap-2 bg-gray-100">
      <div
        className={`bg-gray-300 w-full rounded-md ${
          type === "collections" 
            ? "aspect-[1/1] md:h-120" 
            : "aspect-[1/1] md:h-90"
        }`}
      />
      <div className="bg-gray-300 h-3 md:h-4 w-1/2 rounded-md" />
      <div className="bg-gray-300 h-3 md:h-4 w-1/2 rounded-md" />
    </div>
  );
};
export default CardSkeleton;
