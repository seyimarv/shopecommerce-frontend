"use client";

import { useFetchCollection } from "@/lib/data/collections";
import ProductsFilter from "@/ui/product/products-filter";
import { notFound, useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  const { data: collection, isLoading } = useFetchCollection(id as string, true);

  if (!isLoading && !collection) {
    notFound();
  }


  return (
    <ProductsFilter title={collection?.title} collectionId={collection?.id} isCollectionLoading={isLoading} />
  );
};

export default Page;
