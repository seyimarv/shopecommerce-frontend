"use client";

import { useRetrieveCustomer } from "@/lib/data/customer";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";
import { useRouter } from "next/navigation";
import { useLogout } from "@/lib/data/customer";
import { useEffect } from "react";
import ProfileLayout from "@/ui/profile/profile-layout";
import Overview from "@/ui/profile/overviewcomponent";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: customer, isLoading, error } = useRetrieveCustomer();

  const { mutate: logout, isPending } = useLogout();
  const router = useRouter();

  const logOut = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    if (!isLoading && !customer) {
      router.push("/login");
    }
  }, [isLoading, customer]);

  return (
    <WithSkeleton isLoading={isLoading}>
      <ProfileLayout logOut={logOut}>{children}</ProfileLayout>
    </WithSkeleton>
  );
};

export default AccountLayout;
