"use client";

import { useListProducts } from "@/lib/data/products";
import ProductDetails from "@/ui/product/product-details";
import { useParams, notFound } from "next/navigation";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";
import PageSpinner from "@/ui/common/components/spinner/page-spinner";

const Product = () => {
  const params = useParams();
  const productHandle = params.id as string;
  const { data, isLoading } = useListProducts({
    queryParams: {
      //@ts-expect-error
      handle: productHandle
    }
  });

  if (!isLoading && (!data?.response?.products || data.response.products.length === 0)) {
    notFound();
  }

  return (
    <WithSkeleton isLoading={isLoading} skeleton={<PageSpinner />}>
      <ProductDetails product={data?.response?.products[0]} />
    </WithSkeleton>
  );
};

export default Product;
