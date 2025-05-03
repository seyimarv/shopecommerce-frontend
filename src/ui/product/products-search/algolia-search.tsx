import { useState, useEffect } from "react";
import { Drawer } from "@/ui/Layout/components/Drawer";
import Image from "next/image";
import Link from "next/link";
import { Hits, InstantSearch, SearchBox, useInstantSearch } from "react-instantsearch";
import { searchClient } from "@/lib/data/algoliasearch";
import { FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";
import { HttpTypes } from "@medusajs/types";
import { getProductPrice } from "@/lib/utils/prices";
import PreviewPrice from "@/ui/common/components/Card/PreviewPrice";

const Hit = ({ hit }: { hit: HttpTypes.StoreProduct }) => {
  const { cheapestPrice } = getProductPrice({
    product: hit,
  })
  return (
    <>
      {/* <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden relative">
        {hit.thumbnail ? (
          <Image
            src={hit.thumbnail}
            alt={hit.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
        )}
      </div>
      <div className="flex flex-col gap-y-1 flex-grow">
        <h3 className="font-medium text-gray-900">{hit.title}</h3>
        {hit.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{hit.description}</p>
        )}
      </div> */}
      {/* <Link
        href={`/products/${hit.handle}`}
        className="absolute inset-0"
        aria-label={`View Product: ${hit.title}`}
      /> */}
      <motion.div
        key={hit.id}
        className="py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          href={`/products/${hit.handle}`}
          className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <div className="flex-shrink-0 h-15 w-15 relative mr-3">
            <Image
              src={hit.thumbnail}
              alt={hit.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-col flex-1">
            <h3 className="text-lg font-medium">{hit.title}</h3>
            <p className="mt-1 text-base font-semibold">
              <PreviewPrice price={cheapestPrice} />
            </p>
          </div>
        </Link>
      </motion.div>
    </>
  )
}


const customContentAnimation = {
  hidden: { y: "0", opacity: 0 },
  visible: { y: "0%", opacity: 1 },
};

type Hit = HttpTypes.StoreProduct
// Custom component to show search status and empty results
const SearchStatus = () => {
  const { results, status, indexUiState } = useInstantSearch();
  const query = indexUiState.query || "";
  const isSearching = status === "loading";
  const hasNoResults = results?.nbHits === 0 && !!query;

  if (isSearching) {
    return (
      <div className="flex items-center justify-center py-8">
        <FiLoader className="animate-spin mr-2" />
        <span>Searching...</span>
      </div>
    );
  }

  if (hasNoResults) {
    return (
      <div className="text-center py-12 text-gray-500">
        No products found matching "{query}"
      </div>
    );
  }

  return null;
};

const ProductSearch = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Reset search when drawer opens
  const [searchKey, setSearchKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Force InstantSearch to reset by changing its key
      setSearchKey(prev => prev + 1);
    }
  }, [isOpen]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="top"
      wrapperClassName="!top-[2.5rem]"
      contentAnimation={customContentAnimation}
    >
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_PRODUCT_INDEX_NAME || "products"}
        key={searchKey}
      >
        <div className="max-w-lg mx-auto mt-5 mb-6">
          <SearchBox
            placeholder="Search products..."
            autoFocus
            classNames={{
              root: "w-full",
              form: "relative",
              input: "w-full py-3 px-5 pr-10 rounded-full border border-gray-200 bg-gray-50 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
              submit: "absolute right-3 top-1/2 -translate-y-1/2",
              reset: "absolute right-10 top-1/2 -translate-y-1/2",
              loadingIndicator: "absolute right-3 top-1/2 -translate-y-1/2",
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-8">
          <SearchStatus />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Hits
                hitComponent={Hit}
                classNames={{
                  root: "mt-4",
                  list: "divide-y divide-gray-100 rounded-lg overflow-hidden bg-white",
                }}
              />
            </motion.div>
          </div>
        </div>
      </InstantSearch>
    </Drawer>
  );
};

export default ProductSearch;
