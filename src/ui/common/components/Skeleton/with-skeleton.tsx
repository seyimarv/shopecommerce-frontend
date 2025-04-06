/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, FC } from "react";
import Spinner from "../spinner";

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
    return Skeleton ? <>{Skeleton}</> : <div className="flex flex-grow items-center justify-center h-full"><Spinner /></div>;
  }
  return <>{children}</>;
};

export default WithSkeleton;
