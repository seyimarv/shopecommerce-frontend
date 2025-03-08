"use client";

import HeroSection from "@/ui/Landing/Hero";
import ProductList from "@/ui/product/product-list";
import { mockProducts } from "@/lib/mock-data";
import Testimonials from "@/ui/Landing/Testimonials";
import ValuesList from "@/ui/Landing/Values";
import { useFetchCollections } from "@/lib/data/collections";
// import CollectionList from "@/ui/collections/collection-list";
import { Suspense } from "react";
import { useListProducts, useListProductsWithSort } from "@/lib/data/products";

export default function Home() {
  const { data, isLoading } = useFetchCollections();
  const {
    data: saleItems,
    isLoading: saleItemsLoading,
    error: saleItemsError,
  } = useListProductsWithSort();
  console.log(saleItems);
  if (saleItemsLoading) return <p>Loading collections...</p>;
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <HeroSection data={data} />
      </Suspense>
      <div className="flex flex-col gap-22 pt-22 pb-22 container">
        {/* <ProductList
          title="Items on sale"
          products={mockProducts}
          href="/shop"
          viewMore
          hideButtons={false}
        /> */}
        <ProductList
          title="New Arrivals"
          products={saleItems?.response?.products}
          href="/shop"
          viewMore
          hideButtons={false}
        />
        {/* <ProductList
          title="New Arrivals"
          products={mockProducts}
          href="/shop"
          viewMore
          hideButtons={false}
        /> */}
        <Testimonials />
        <ValuesList />
      </div>
    </>
  );
}
