import React from "react";
import Card from "@/ui/common/components/Card";
import { HttpTypes } from "@medusajs/types";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";
import CollectionsSkeleton from "@/ui/common/components/Skeleton/collection-skeleton";
interface CollectionListProps {
  collections?: HttpTypes.StoreCollection[];
  title: string;
  className?: string;
  isLoading: boolean;
}

const CollectionList: React.FC<CollectionListProps> = ({
  collections,
  title,
  className,
  isLoading
}) => {
  return (
    <>
      <h2 className={`text-2xl sm:text-3xl md:text-4xl pb-4 sm:pb-6 md:pb-8 tracking-widest uppercase font-light`}>{title}</h2>
      <WithSkeleton isLoading={isLoading} skeleton={<CollectionsSkeleton />}>
        <div
          className={`grid ${"grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} gap-4 sm:gap-6 md:gap-8 gap-y-6 sm:gap-y-12 md:gap-y-20 ${className}`}
        >
          {collections?.map((collection) => (
            <Card
              key={collection.id}
              collection={collection}
              hideButtons={true}
              className="lg:h-120"
              variety="collections"
              href={`/collections/${collection.handle}`}
            />
          ))}
        </div>
      </WithSkeleton>
    </>
  );
};

export default CollectionList;
