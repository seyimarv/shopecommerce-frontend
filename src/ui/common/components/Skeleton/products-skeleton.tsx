import CardSkeleton from "./card-skeleton";

interface ProductsSkeleton {
  skeletonNumber?: number;
}

const ProductsSkeleton = ({ skeletonNumber = 4 }: ProductsSkeleton) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 gap-y-6 md:gap-y-20 ">
      {Array.from({ length: skeletonNumber }, (_, i) => i + 1).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductsSkeleton;
