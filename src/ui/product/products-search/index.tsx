import { useState, useCallback, useEffect, useRef } from "react";
import { SearchInput } from "@/ui/common/components/input/search-input";
import { Drawer } from "@/ui/Layout/components/Drawer";
import SearchResults from "./search-result";
import { useListProducts } from "@/lib/data/products";
import { debounce } from "@/lib/utils/debounce";
import { HttpTypes } from "@medusajs/types";
import { useRouter, usePathname } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HttpTypes.StoreProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { data: products, isLoading, error } = useListProducts({
    queryParams: {
      limit: 12,
      q: searchQuery,
    },
  });
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim() === "") {
        setSearchResults([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);
      if (products?.response?.products) {
        setSearchResults(products.response.products);
      }
      setIsSearching(false);
    }, 300),
    [products]
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  }, [debouncedSearch]);

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
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="top"
      wrapperClassName="!top-[2.5rem]"
      contentAnimation={customContentAnimation}
    >
      <div className="max-w-lg mx-auto mt-5 mb-6">
        <SearchInput
          className="border border-gray-200 rounded-full self-center bg-gray-50"
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
        />
      )}
     
    </Drawer>
  );
};

export default ProductSearch;
