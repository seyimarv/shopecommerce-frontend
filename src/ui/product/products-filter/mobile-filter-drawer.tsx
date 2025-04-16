"use client";

import { useState } from "react";
import { Drawer } from "@/ui/Layout/components/Drawer";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
import { AvailabiltyFilter, PriceFilter } from "./filter";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAvailability: string[];
  onAvailabilityChange: (availability: string[]) => void;
  inStockCount: number;
  outOfStockCount: number;
  minPrice: number | null;
  maxPrice: number | null;
  onPriceChange: (min: number | null, max: number | null) => void;
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  selectedAvailability,
  onAvailabilityChange,
  inStockCount,
  outOfStockCount,
  minPrice,
  maxPrice,
  onPriceChange
}: MobileFilterDrawerProps) {
  // Animation variants for drawer content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      className="md:hidden !max-w-[350px] h-[100vh]"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-lg font-medium">Filter</h2>
          <button
            className="text-gray-400"
            onClick={onClose}
            aria-label="Close filter drawer"
            data-drawer-toggle="true"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <motion.div
          className="flex-1 flex flex-col p-4 space-y-6"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Availability</h3>
            <AvailabiltyFilter
              selectedAvailability={selectedAvailability}
              onAvailabilityChange={onAvailabilityChange}
              inStockCount={inStockCount}
              outOfStockCount={outOfStockCount}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Price</h3>
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={onPriceChange}
            />
          </div>
        </motion.div>

        <div className="p-4 border-t border-gray-100">
          <button
            className="w-full py-3 bg-black text-white text-sm font-medium rounded-lg"
            onClick={onClose}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Drawer>
  );
}
