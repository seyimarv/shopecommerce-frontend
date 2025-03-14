"use client";

import HeroSection from "@/ui/Landing/Hero";
import ProductList from "@/ui/product/product-list";
import Testimonials from "@/ui/Landing/Testimonials";
import ValuesList from "@/ui/Landing/Values";
import { useFetchCollections } from "@/lib/data/collections";
// import CollectionList from "@/ui/collections/collection-list";
import { useListProducts, useListProductsWithSort } from "@/lib/data/products";
import Card from "@/ui/common/components/Card";
import HeroSkeleton from "@/ui/common/components/Skeleton/hero-skeleton";

export default function Home() {
  const { data, isLoading } = useFetchCollections();
  const {
    data: saleItems,
    isLoading: saleItemsLoading,
    error,
  } = useListProductsWithSort();
  console.log(saleItems);
  console.log(data);
  return (
    <>
      <HeroSkeleton isLoading={isLoading}>
        <HeroSection collections={data?.collections} />
      </HeroSkeleton>
      <div className="flex flex-col gap-22 pt-22 pb-22 container">
        <ProductList
          title="New Arrivals"
          products={saleItems?.response?.products}
          href="/shop"
          viewMore
          hideButtons={false}
          isLoading={isLoading}
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
                  href={`/collections/${id}`}
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
