"use client";

import HeroSection from "@/ui/Landing/Hero";
import ProductList from "@/ui/product/product-list";
import Testimonials from "@/ui/Landing/Testimonials";
import ValuesList from "@/ui/Landing/Values";
import { useFetchCollections } from "@/lib/data/collections";
import { useListProductsWithSort, useListRestockedProducts } from "@/lib/data/products";
import Card from "@/ui/common/components/Card";
import HeroSkeleton from "@/ui/common/components/Skeleton/hero-skeleton";

export default function Home() {
  const { data, isLoading } = useFetchCollections();
  const {
    data: newArrivals,
    isLoading: newArrivalsLoading,
  } = useListProductsWithSort({
    queryParams: {
      limit: 4,
    },
  });
  const {
    data: restocked,
    isLoading: restockedLoading,
  } = useListRestockedProducts({
    queryParams: {
      limit: 4,
    },
  });

  return (
    <>
      <HeroSkeleton isLoading={isLoading}>
        <HeroSection collections={data?.collections} />
      </HeroSkeleton>
      <div className="flex flex-col gap-22 pt-22 pb-22 container">
        <ProductList
          title="New Arrivals"
          products={newArrivals?.response?.products ?? []}
          href="/products"
          viewMore
          hideButtons={false}
          isLoading={newArrivalsLoading}
        />
        <ProductList
          title="Back in stock"
          products={restocked?.response?.products ?? []}
          href="/products/restocked"
          viewMore
          hideButtons={false}
          isLoading={restockedLoading}
        />
        <section>
          <h2 className={`text-2xl pb-8 tracking-widest uppercase`}>
            Collections
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-20">
            {data?.collections?.map(({ id, title, metadata, handle }) => (
              <div key={id}>
                <Card
                  collection={{
                    title,
                    metadata: metadata ?? undefined,
                  }}
                  className="h-90"
                  variety="collections"
                  href={`/collections/${handle}`}
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
