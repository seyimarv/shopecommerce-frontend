import React from "react";
import Card from "@/ui/common/components/Card";

interface Collection {
  id: string;
  title: string;
  imgSrc: string;
  href?: string;
}

interface CollectionListProps {
  collections: Collection[];
  title: string;
  className?: string;
}

const CollectionList: React.FC<CollectionListProps> = ({
  collections,
  title,
  className,
}) => {
  return (
    <>
      <h2 className={`text-4xl pb-8 tracking-widest uppercase`}>{title}</h2>

      <div
        className={`grid ${"grid-cols-2 md:grid-cols-3"} gap-4 gap-y-20 ${className}`}
      >
        {collections.map((collection) => (
          <Card
            key={collection.id}
            {...collection}
            hideButtons={true}
            className="h-120"
            type="collections"
            imgSrc={collection.imgSrc}
            href={collection?.href}
          />
        ))}
      </div>
    </>
  );
};

export default CollectionList;
