import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { HttpTypes } from "@medusajs/types";
import { getProductPrice } from "@/lib/utils/prices";
import Spinner from "@/ui/common/components/spinner";
import Button from "@/ui/common/components/button";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

interface SearchResultsProps {
  results: HttpTypes.StoreProduct[];
  loading?: boolean;
  hasSearch: boolean;
  searchQuery: string;
  onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading = false,
  hasSearch = false,
  searchQuery,
  onClose,
}) => {
  const getPrice = (product: HttpTypes.StoreProduct) => {
    const { cheapestPrice } = getProductPrice({ product });
    return cheapestPrice?.calculated_price || "";
  };
  const isMobile = useIsMobile();
  return (
    <motion.div
      className="w-full container mt-5 h-full"
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: hasSearch ? (isMobile ? "100vh" : "70vh") : 0,
        opacity: hasSearch ? 1 : 0,
      }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      <div className="max-h-[90vh]">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Spinner size={40} />
            </div>
          </div>
        ) : (
          <>
            <ul className="max-h-[80vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
              {results.map((item) => (
                <motion.li
                  key={item.id}
                  className="py-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/products/${item?.handle}`}
                    className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 h-15 w-15 relative mr-3">
                      <Image
                        src={item?.thumbnail || item?.images?.[0]?.url || ""}
                        alt={item?.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      <p className="mt-1 text-base">
                        {getPrice(item)}
                      </p>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
            {
              hasSearch && results.length > 0 && (
                <div className="mt-5 flex justify-center" onClick={onClose}>
                  <Button isLink href={`/search?q=${searchQuery}`} >
                    View all results
                  </Button>
                </div>
              )
            }
          </>
        )}

        <div className="text-center py-12  h-full w-full flex items-center justify-center flex-col">
          <span className="text-gray-500">{hasSearch && results.length === 0 && !loading && (
            `No products found matching "${searchQuery}"`
          )}</span>
          {hasSearch && results.length === 0 && (
            <div className="mt-4 flex justify-center" onClick={onClose}>
              <Button isLink href={"/products"} >
                View all products
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchResults;
