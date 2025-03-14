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
      <h2 className={`text-4xl pb-8 tracking-widest uppercase`}>{title}</h2>
      <WithSkeleton isLoading={isLoading} skeleton={<CollectionsSkeleton />}>
        <div
          className={`grid ${"grid-cols-2 md:grid-cols-3"} gap-4 gap-y-20 ${className}`}
        >
          {collections?.map((collection) => (
            <Card
              key={collection.id}
              collection={collection}
              hideButtons={true}
              className="h-120"
              variety="collections"
              href={`/collections/${collection.id}`}
            />
          ))}
        </div>
      </WithSkeleton>
    </>
  );
};

export default CollectionList;
