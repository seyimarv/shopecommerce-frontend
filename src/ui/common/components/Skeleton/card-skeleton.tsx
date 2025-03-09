"use client";
import React from "react";

interface CardSkeletonProps {
  type?: "collections" | "default";
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ type = "default" }) => {
  return (
    <div className="animate-pulse w-full flex flex-col gap-2 bg-gray-100">
      <div
        className={`bg-gray-300 ${
          type === "collections" ? "h-120" : "h-90"
        } w-full rounded-md`}
      />
      <div className="bg-gray-300 h-4 w-1/2 rounded-md" />
      <div className="bg-gray-300 h-4 w-1/2 rounded-md" />
    </div>
  );
};
export default CardSkeleton;
