"use client";

import { useState, useEffect } from "react";
import { AvailabiltyFilter, PriceFilter } from "./filter";
import SortBy from "./sort";
import { Option } from "@/ui/common/components/Select";
import { useListProductsWithSort } from "@/lib/data/products";
import { SortOptions } from "@/lib/utils/sort-products";

import ProductList from "@/ui/product/product-list";
import { Pagination } from "@/ui/common/components/pagination";
import { useSearchParams } from "next/navigation";

interface ProductsFilterProps {
  title?: string;
  collectionId?: string;
}

const sortOptionToMedusaSort: Record<string, SortOptions> = {
  featured: "-created_at",
  "best-selling": "-created_at",
  "alpha-asc": "title",
  "alpha-desc": "-title",
  "price-asc": "variants.calculated_price",
  "price-desc": "-variants.calculated_price",
  "date-old": "created_at",
  "date-new": "-created_at",
};

const ITEMS_PER_PAGE = 12;

const ProductsFilter = ({ title, collectionId }: ProductsFilterProps) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    []
  );
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedSort, setSelectedSort] = useState<Option>();
  const [inStockCount, setInStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);

  const { data, isLoading } = useListProductsWithSort({
    page: currentPage,
    queryParams: {
      limit: ITEMS_PER_PAGE,
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
  });

  useEffect(() => {
    if (data?.response?.products) {
      const inStock = data.response.products.filter((p) =>
        p.variants?.some((v) => v.inventory_quantity ?? 0 > 0)
      ).length;
      const outOfStock = data.response.products.length - inStock;
      setInStockCount(inStock);
      setOutOfStockCount(outOfStock);
    }
  }, [data]);

  const handlePriceChange = (min: number | null, max: number | null) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleAvailabilityChange = (availability: string[]) => {
    setSelectedAvailability(availability);
  };

  const handleSortChange = (option: Option) => {
    setSelectedSort(option);
  };

  const totalPages = Math.ceil((data?.response.count || 0) / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <h2 className="text-4xl pb-8 tracking-widest uppercase">
        {title || "All products"}
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
            {isLoading ? "Loading..." : `${data?.response.count || 0} products`}
          </span>
        </div>
      </div>
      <ProductList products={data?.response.products} isLoading={isLoading} />
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default ProductsFilter;
