import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { HttpTypes } from "@medusajs/types";
import { getProductPrice } from "@/lib/utils/prices";
import Spinner from "@/ui/common/components/spinner";
import Button from "@/ui/common/components/button";

interface SearchResultsProps {
  results: HttpTypes.StoreProduct[];
  loading?: boolean;
  hasSearch: boolean;
  searchQuery: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading = false,
  hasSearch = false,
  searchQuery,
}) => {
  const getPrice = (product: HttpTypes.StoreProduct) => {
    const { cheapestPrice } = getProductPrice({ product });
    return cheapestPrice?.calculated_price || 0;
  };
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
            <Spinner size={40} />
          </div>
        </div>
      ) : (
        <>
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
                href={`/products/${item.handle}`}
                className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 h-15 w-15 relative mr-3">
                  <Image
                    src={item.thumbnail || " "}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="mt-1 text-base font-semibold">
                    ${getPrice(item)}
                  </p>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
        <Button isLink href="/products">
          View all results
        </Button>
        </>
      )}
      <div className="text-center py-12 text-gray-500">
        {hasSearch && results.length === 0 && !loading && (
          `No products found matching "${searchQuery}"`
        )}
      </div>
    </motion.div>
  );
};

export default SearchResults;
