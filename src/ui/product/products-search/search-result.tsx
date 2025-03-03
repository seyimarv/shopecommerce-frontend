import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "../product-list";

interface SearchResultsProps {
  results: Product[];
  loading?: boolean;
  hasSearch: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading = false,
  hasSearch = false,
}) => {
  return (
    <motion.div
      className="w-full container mt-5"
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: hasSearch ? "60vh" : 0,
        opacity: hasSearch ? 1 : 0,
      }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-500">Searching products...</p>
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {results.map((item) => (
            <motion.li
              key={item.id}
              className="py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={item.href || ""}
                className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 h-15 w-15 relative mr-3">
                  <Image
                    src={item.imgSrc}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="mt-1 text-base font-semibold">
                    ${item.price.calculated_price}
                  </p>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default SearchResults;
