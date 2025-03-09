"use client";

import { PRODUCT_LIMIT } from "@/lib/data/constants";
import { useListProducts } from "@/lib/data/products";
import { Pagination } from "@/ui/pagination";
import ProductList from "@/ui/product/product-list";
import { useSearchParams } from "next/navigation";

const Products = () => {
  const searchParams = useSearchParams();
  const p = searchParams.get("page") || "1";

  const page = parseInt(p, 10);
  const { data, isLoading, error } = useListProducts({
    pageParam: page,
    queryParams: {
      limit: PRODUCT_LIMIT,
    },
  });

  const totalPages = Math.ceil(data?.response?.count / PRODUCT_LIMIT);

  return (
    <>
      <ProductList
        isLoading={isLoading}
        title="All products"
        products={data?.response?.products}
      />
      <Pagination totalPages={totalPages} />
    </>
  );
};

export default Products;
