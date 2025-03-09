/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, FC } from "react";

type WithSkeletonProps = {
  isLoading: boolean;
  skeleton?: any;
  children: ReactNode;
};

const WithSkeleton: FC<WithSkeletonProps> = ({
  isLoading,
  skeleton: Skeleton,
  children,
}) => {
  if (isLoading) {
    return Skeleton ? <>{Skeleton}</> : <h1>Loading...</h1>;
  }
  return <>{children}</>;
};

export default WithSkeleton;
