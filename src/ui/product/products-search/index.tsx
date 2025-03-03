import { useState, useCallback, useEffect } from "react";
import { SearchInput } from "@/ui/common/components/input/search-input";
import { Drawer } from "@/ui/Layout/components/Drawer";
import SearchResults from "./search-result";
import { mockProducts } from "@/lib/mock-data";
import { Product } from "../product-list";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    setTimeout(() => {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = mockProducts.filter((product) =>
        product.title.toLowerCase().includes(lowerCaseQuery)
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSearchResults([]);
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
      <div className="max-w-lg mx-auto mt-5 mb-6">
        <SearchInput
          className="border border-gray-200 rounded-full self-center bg-gray-50"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products..."
          autoFocus
        />
      </div>

      {/* {hasSearched && searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="text-center py-12 text-gray-500">
          No products found matching "{searchQuery}"
        </div>
      )} */}

      {(searchResults.length > 0 || isSearching || hasSearched) && (
        <SearchResults
          results={searchResults}
          loading={isSearching}
          hasSearch={hasSearched}
        />
      )}
    </Drawer>
  );
};

export default ProductSearch;
