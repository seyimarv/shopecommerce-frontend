"use client";

import { useRetrieveCustomer } from "@/lib/data/customer";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";
import { useRouter } from "next/navigation";
import { useLogout } from "@/lib/data/customer";
import { useEffect } from "react";
import ProfileLayout from "@/ui/profile/profile-layout";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: customer, isLoading, isFetching } = useRetrieveCustomer();

  const { mutate: logout } = useLogout();
  const router = useRouter();

  const logOut = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    if (!isFetching && !customer) {
      router.push("/login");
    }
  }, [isFetching, customer, router]);

  return (
    <WithSkeleton isLoading={isLoading}>
      {
        customer && (
          <ProfileLayout logOut={logOut}>{children}</ProfileLayout>
        )
      }
    </WithSkeleton>
  );
};

export default AccountLayout;
