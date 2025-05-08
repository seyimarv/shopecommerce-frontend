"use client"

import Image from "next/image";
import clsx from "clsx";
import React from "react";
import { motion } from "framer-motion";

interface ThumbnailProps {
  image?: string | null;
  sale?: boolean;
  size?: "small" | "medium" | "large" | "full" | "square";
  className?: string;
  isHovered?: boolean;
  images?: any[]
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  image,
  size = "full",
  className,
  isHovered,
  images
}) => {
  // Check if className contains aspect ratio
  const hasAspectRatio = className?.includes('aspect-');
  const initialImage = image || images?.[0]?.url
  return (
    <motion.div
      className={clsx("relative overflow-hidden rounded-sm", {
        // Only override the default square aspect ratio in special cases
        // "aspect-[11/14]": !hasAspectRatio && isFeatured,
        // "aspect-[9/16]": !hasAspectRatio && !isFeatured && size === "full" && size !== "square",
        // Default to square aspect ratio
        "aspect-[1/1]": !hasAspectRatio,
        "w-[180px]": size === "small",
        "w-[290px]": size === "medium",
        "w-[440px]": size === "large",
        "w-full": size === "full",
      }, className)}
      initial={{ scale: 1 }}
      animate={{ scale: isHovered ? 1.05 : 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <ImageOrPlaceholder image={initialImage} />
    </motion.div>
  );
};

interface ImageOrPlaceholderProps {
  image?: string | null;
}

const ImageOrPlaceholder: React.FC<ImageOrPlaceholderProps> = ({ image }) => {
  return image ? (
    <Image
      src={image}
      alt="Thumbnail"
      className="absolute inset-0 object-cover object-center"
      draggable={false}
      quality={50}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center">
      <div>Placeholder</div>
    </div>
  );
};

export default Thumbnail;
