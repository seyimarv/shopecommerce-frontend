import { ReactNode } from "react";
import WithSkeleton from "./with-skeleton";

interface HeroSkeletonProps {
  isLoading: boolean;
  children: ReactNode;
}

const HeroSkeleton: React.FC<HeroSkeletonProps> = ({ isLoading, children }) => {
  return (
    <WithSkeleton
      isLoading={isLoading}
      skeleton={
        <div className="animate-pulse h-[calc(100vh-14rem)] md:h-[calc(100vh-7rem)] w-full bg-gray-200"></div>
      }
    >
      {children}
    </WithSkeleton>
  );
};

export default HeroSkeleton;
