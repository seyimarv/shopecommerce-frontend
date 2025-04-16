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
import { isProductSoldOut } from "@/lib/utils/soldout";

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

  return (
    <div className="space-y-8">

      <h2 className="text-4xl pb-8 tracking-widest uppercase">
        {
          !isCollectionLoading && !hideTitle && (
            <>
              {title || "All products"}
            </>
          )
        }
      </h2>

      <div className="flex justify-between items-center mt-3 mb-5">
        <div className="flex items-center gap-4">
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
        <div className="flex items-center gap-4">
          <SortBy value={selectedSort} onChange={handleSortChange} />
          <span className="text-sm text-gray-600">
            {isLoading || isCollectionLoading ? <>
              <AiOutlineLoading className="animate-spin" />
            </> : `${data?.response.count || 0} products`}
          </span>
        </div>
      </div>
      <ProductList products={sortProducts(data?.response.products ?? [], selectedSort?.value as SortOptions)} isLoading={isLoading || isCollectionLoading} />
      {isSearch && !isLoading && !isCollectionLoading && data?.response.count === 0 && (
        <div className="text-center py-16 text-gray-500">
          No products found matching "{searchQuery}". Try a different search.
        </div>
      )}
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default ProductsFilter;
