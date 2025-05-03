"use client";

import { useFetchCollections } from "@/lib/data/collections";
import CollectionList from "@/ui/collections/collection-list";
import { Pagination } from "@/ui/common/components/pagination";
import PageSpinner from "@/ui/common/components/spinner/page-spinner";
import { Suspense } from "react";

const Collections = () => {
  const { data, isLoading } = useFetchCollections();
  return (
    <Suspense fallback={<PageSpinner />}>
      <CollectionList
        title="Collections"
        collections={data?.collections}
        isLoading={isLoading}
      />
      <Pagination totalPages={1} />
    </Suspense>
  );
};

export default Collections;
