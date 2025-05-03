"use client";

import HeroSection from "@/ui/Landing/Hero";
import ProductList from "@/ui/product/product-list";
import Testimonials from "@/ui/Landing/Testimonials";
import ValuesList from "@/ui/Landing/Values";
import { useFetchCollections } from "@/lib/data/collections";
import { useListProductsWithSort, useListRestockedProducts } from "@/lib/data/products";
import Card from "@/ui/common/components/Card";
import HeroSkeleton from "@/ui/common/components/Skeleton/hero-skeleton";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";
import CardSkeleton from "@/ui/common/components/Skeleton/card-skeleton";

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
      <div className="flex flex-col gap-12 md:gap-22 pt-12 md:pt-22 pb-12 md:pb-22 container px-4 md:px-0">
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
          <h2 className={`text-xl md:text-2xl pb-4 md:pb-8 tracking-widest uppercase`}>
            Collections
          </h2>
          <WithSkeleton 
            isLoading={isLoading} 
            skeleton={
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-10 md:gap-y-20">
                {[...Array(4)].map((_, index) => (
                  <CardSkeleton key={index} type="collections" />
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-10 md:gap-y-20">
              {data?.collections?.map(({ id, title, metadata, handle }) => (
                <div key={id}>
                  <Card
                    collection={{
                      title,
                      metadata: metadata ?? undefined,
                      id,
                    }}
                    className="w-full lg:h-90"
                    variety="collections"
                    href={`/collections/${handle}`}
                  />
                </div>
              ))}
            </div>
          </WithSkeleton>
        </section>
        <Testimonials />
        <ValuesList />
      </div>
    </>
  );
}
