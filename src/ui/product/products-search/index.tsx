import { useState, useCallback, useEffect, useRef } from "react";
import { SearchInput } from "@/ui/common/components/input/search-input";
import { Drawer } from "@/ui/Layout/components/Drawer";
import SearchResults from "./search-result";
import { useListProducts } from "@/lib/data/products";
import { debounce } from "@/lib/utils/debounce";
import { HttpTypes } from "@medusajs/types";
import { useRouter, usePathname } from "next/navigation";
import { useInView } from "@/lib/hooks/useInView";

const customContentAnimation = {
  hidden: { y: "0", opacity: 0 },
  visible: { y: "0%", opacity: 1 },
};

const ProductSearch = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { isInView: isBannerInView } = useInView({ id: "banner" });
  const { isInView: isHeaderInView } = useInView({ id: "header" });
  const router = useRouter();
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HttpTypes.StoreProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedSetQuery = useCallback(
    debounce((query: string) => {
      setDebouncedQuery(query);
      setHasSearched(query.trim() !== "");
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSetQuery(searchQuery);
  }, [searchQuery, debouncedSetQuery]);

  const { data: products, isLoading, error } = useListProducts({
    queryParams: {
      limit: 12,
      // @ts-expect-error
      q: debouncedQuery,
    },
    enabled: debouncedQuery.trim() !== "",
  });

  useEffect(() => {
    setIsSearching(isLoading);
    if (!isLoading && products?.response?.products) {
      setSearchResults(products.response.products);
    } else if (!isLoading && debouncedQuery.trim() === "") {
      setSearchResults([]);
    }
    if (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
  }, [isLoading, products, debouncedQuery, error]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (pathname !== prevPathnameRef.current && isOpen) {
      onClose();
    }
    prevPathnameRef.current = pathname;
  }, [pathname, isOpen, onClose]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  const drawerClassName =
    isBannerInView && isHeaderInView
      ? "!top-[2.5rem] h-[calc(100vh-2.5rem)]"
      : isHeaderInView
        ? "!top-[0] h-[calc(100vh)]"
        : "h-full";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="top"
      wrapperClassName={drawerClassName}
      contentAnimation={customContentAnimation}
    >
      <div className="w-full px-4 md:max-w-lg md:px-0 mx-auto mt-5 mb-6 overflow-hidden">
        <SearchInput
          className="border border-gray-200 rounded-full self-center bg-gray-50 w-full text-base"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products..."
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>

      {(searchResults.length > 0 || isSearching || (hasSearched && searchQuery)) && (
        <SearchResults
          results={searchResults}
          loading={isSearching || isLoading}
          hasSearch={hasSearched && !!searchQuery}
          searchQuery={searchQuery}
          onClose={onClose}
        />
      )}
    </Drawer>
  );
};

export default ProductSearch;
