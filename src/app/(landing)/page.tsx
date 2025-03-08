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
import Card from "@/ui/common/components/Card";

export default function Home() {
  const { data, isLoading } = useFetchCollections();
  const {
    data: saleItems,
    isLoading: saleItemsLoading,
    error: saleItemsError,
  } = useListProductsWithSort();
  console.log(saleItems);
  console.log(data);
  if (saleItemsLoading) return <p>Loading collections...</p>;
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <HeroSection collections={data?.collections} />
      </Suspense>
      <div className="flex flex-col gap-22 pt-22 pb-22 container">
        <ProductList
          title="New Arrivals"
          products={saleItems?.response?.products}
          href="/shop"
          viewMore
          hideButtons={false}
        />
        <section>
          <h2 className={`text-2xl pb-8 tracking-widest uppercase`}>
            Collections
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-20">
            {data?.collections?.map(({ id, title, metadata }) => (
              <div key={id}>
                <Card
                  collection={{
                    title,
                    metadata: metadata ?? undefined,
                  }}
                  className="h-90"
                  variety="collections"
                />
              </div>
            ))}
          </div>
        </section>
        <Testimonials />
        <ValuesList />
      </div>
    </>
  );
}
