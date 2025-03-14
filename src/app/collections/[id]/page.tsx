"use client";

import { useFetchCollection } from "@/lib/data/collections";
import ProductsFilter from "@/ui/product/products-filter";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  const { data: collection, isLoading } = useFetchCollection(id as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ProductsFilter title={collection?.title} collectionId={id as string} />
  );
};

export default Page;
