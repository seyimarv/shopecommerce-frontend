import CardSkeleton from "./card-skeleton";

interface CollectionsSkeleton {
  skeletonNumber?: number;
}

const CollectionsSkeleton = ({ skeletonNumber = 3 }: CollectionsSkeleton) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-20 ">
      {Array.from({ length: skeletonNumber }, (_, i) => i + 1).map((_, i) => (
        <CardSkeleton key={i} type="collections" />
      ))}
    </div>
  );
};

export default CollectionsSkeleton;
