"use client";

import { useFetchCollections } from "@/lib/data/collections";
import CollectionList from "@/ui/collections/collection-list";
import { Pagination } from "@/ui/pagination";

const Collections = () => {
  const { data, isLoading, error } = useFetchCollections();
  return (
    <>
      <CollectionList
        title="Collections"
        collections={data?.collections}
        isLoading={isLoading}
      />
      <Pagination totalPages={1} />
    </>
  );
};

export default Collections;
