"use client";

import HeroSection from "@/ui/Landing/Hero";
import ProductList from "@/ui/product/product-list";
import { mockProducts } from "@/lib/mock-data";
import Testimonials from "@/ui/Landing/Testimonials";
import ValuesList from "@/ui/Landing/Values";
import { useQuery } from "@tanstack/react-query";
import { retrieveAnnouncements } from "@/lib/data/announcements";
// import CollectionList from "@/ui/collections/collection-list";

export default function Home() {
 
  return (
    <>
      <HeroSection />
      <div className="flex flex-col gap-22 pt-22 pb-22 container">
        <ProductList
          title="Items on sale"
          products={mockProducts}
          href="/shop"
          viewMore
          hideButtons={false}
        />
        <ProductList
          title="New Arrivals"
          products={mockProducts}
          href="/shop"
          viewMore
          hideButtons={false}
        />
        <ProductList
          title="New Arrivals"
          products={mockProducts}
          href="/shop"
          viewMore
          hideButtons={false}
        />
        <Testimonials />
        <ValuesList />
      </div>
    </>
  );
}
