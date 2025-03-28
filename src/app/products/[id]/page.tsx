"use client";

import { useListProducts } from "@/lib/data/products";
import ProductDetails from "@/ui/product/product-details";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { HttpTypes } from "@medusajs/types";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";

const Product = () => {
  const params = useParams();
  const productHandle = params.id as string;

  // Fetch all products and filter by handle on the client side
  const { data, isLoading } = useListProducts({
    queryParams: {
      handle: productHandle
    }
  });

  // Check if product exists, if not return notFound page
  if (!isLoading && (!data?.response?.products || data.response.products.length === 0)) {
    notFound();
  }

  return (
    <WithSkeleton isLoading={isLoading}>
      <ProductDetails product={data?.response?.products[0]} />
    </WithSkeleton>
  );
};

export default Product;
