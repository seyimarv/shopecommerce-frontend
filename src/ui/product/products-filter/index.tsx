"use client";

import { useState, useEffect } from "react";
import { AvailabiltyFilter, PriceFilter } from "./filter";
import SortBy, { sortingOptions } from "./sort";
import { Option } from "@/ui/common/components/Select";
import { useListProductsWithSort } from "@/lib/data/products";
import { SortOptions, sortProducts } from "@/lib/utils/sort-products";

import ProductList from "@/ui/product/product-list";
import { Pagination } from "@/ui/common/components/pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AiOutlineLoading } from "react-icons/ai";
import { FiFilter } from "react-icons/fi";
import { isProductSoldOut } from "@/lib/utils/soldout";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import MobileFilterDrawer from "./mobile-filter-drawer";

interface ProductsFilterProps {
  title?: string;
  collectionId?: string;
  isCollectionLoading?: boolean;
  isSearch?: boolean;
  hideTitle?: boolean;
  restocked?: boolean;
}

const sortOptionToMedusaSort: Record<string, SortOptions> = {
  featured: "-created_at",
  "best-selling": "-created_at",
  "alpha-asc": "title",
  "alpha-desc": "-title",
  // "price-asc": "variants.prices.amount",
  // "price-desc": "-variants.prices.amount",
  "date-old": "created_at",
  "date-new": "-created_at",
};

const ITEMS_PER_PAGE = 12;

const ProductsFilter = ({ title, collectionId, isCollectionLoading, isSearch, hideTitle, restocked }: ProductsFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchQuery = searchParams.get("q") || "";

  const currentPage = Number(searchParams.get("page")) || 1;
  const availabilityParam = searchParams.get("availability")?.split(",") || [];
  const minPriceParam = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
  const maxPriceParam = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
  const sortParam = searchParams.get("sort");
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(availabilityParam);
  const [minPrice, setMinPrice] = useState<number | null>(minPriceParam);
  const [maxPrice, setMaxPrice] = useState<number | null>(maxPriceParam);
  const [selectedSort, setSelectedSort] = useState<Option | undefined>(
    sortParam ? { value: sortParam, label: sortingOptions.find(o => o.value === sortParam)?.label || "" } : undefined
  );
  const [inStockCount, setInStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);

  const { data, isLoading } = useListProductsWithSort({
    page: currentPage,
    queryParams: {
      limit: ITEMS_PER_PAGE,
      ...(isSearch && { q: searchQuery }),
    },
    sortBy: selectedSort
      ? sortOptionToMedusaSort[selectedSort.value as string]
      : undefined,
    filters: {
      availability: selectedAvailability,
      minPrice,
      maxPrice,
    },
    collectionId,
    isRestocked: restocked,
  })


  useEffect(() => {
    if (data?.response?.products) {
      const inStock = data.response.products.filter((p) =>
        !isProductSoldOut(p)
      ).length;
      const outOfStock = data.response.products.length - inStock;
      setInStockCount(inStock);
      setOutOfStockCount(outOfStock);
    }
  }, [data]);

  const updateUrlParams = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const handlePriceChange = (min: number | null, max: number | null) => {
    setMinPrice(min);
    setMaxPrice(max);
    updateUrlParams({
      minPrice: min?.toString() || null,
      maxPrice: max?.toString() || null,
      page: "1"
    });
  };

  const handleAvailabilityChange = (availability: string[]) => {
    setSelectedAvailability(availability);
    updateUrlParams({
      availability: availability.length ? availability.join(",") : null,
      page: "1"
    });
  };

  const handleSortChange = (option: Option) => {
    setSelectedSort(option);
    updateUrlParams({
      sort: option.value as string,
      // page: "1"
    });
  };

  const totalPages = Math.ceil((data?.response.count || 0) / ITEMS_PER_PAGE);
  const isMobile = useIsMobile()

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  return (
    <>
      {isMobile && (
        <MobileFilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          selectedAvailability={selectedAvailability}
          onAvailabilityChange={handleAvailabilityChange}
          inStockCount={inStockCount}
          outOfStockCount={outOfStockCount}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={handlePriceChange}
        />
      )}

      <div className="space-y-4 md:space-y-6 lg:space-y-8">

        <h2 className="text-2xl sm:text-3xl md:text-4xl pb-4 sm:pb-6 md:pb-8 tracking-widest uppercase font-light">
          {
            !isCollectionLoading && !hideTitle && (
              <>
                {title || "All products"}
              </>
            )
          }
        </h2>

        <div className="flex justify-between items-center mt-2 sm:mt-3 mb-4 sm:mb-5 flex-wrap gap-y-3">

          <div className="items-center gap-4 hidden md:flex">
            <span className="text-sm">Filter:</span>
            <AvailabiltyFilter
              selectedAvailability={selectedAvailability}
              onAvailabilityChange={handleAvailabilityChange}
              inStockCount={inStockCount}
              outOfStockCount={outOfStockCount}
            />
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
            />
          </div>
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 py-1.5 sm:py-2 px-2 sm:px-3 border rounded-lg text-xs sm:text-sm font-medium md:hidden"
          >
            <FiFilter size={14} />
            <span>Filter</span>
          </button>


          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <SortBy value={selectedSort} onChange={handleSortChange} />
            <span className="text-xs sm:text-sm text-gray-600">
              {isLoading || isCollectionLoading ? <>
                <AiOutlineLoading className="animate-spin" />
              </> : `${data?.response.count || 0} products`}
            </span>
          </div>
        </div>

        <ProductList products={sortProducts(data?.response.products ?? [], selectedSort?.value as SortOptions)} isLoading={isLoading! || isCollectionLoading!} />
        {isSearch && !isLoading && !isCollectionLoading && data?.response.count === 0 && (
          <div className="text-center py-8 sm:py-12 md:py-16 text-gray-500 text-sm sm:text-base">
            No products found matching "{searchQuery}". Try a different search.
          </div>
        )}
        <div className="pt-4 sm:pt-6 md:pt-8">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </>
  );
};

export default ProductsFilter;
