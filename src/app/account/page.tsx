"use client"

import { useRetrieveCustomer } from "@/lib/data/customer";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";
import { useRouter } from "next/navigation";
import { useLogout } from "@/lib/data/customer";
import Button from "@/ui/common/components/button";
import { useEffect } from "react";


const AccountPage = () => {
    const { data: customer, isLoading, error } = useRetrieveCustomer();
    const { mutate: logout, isPending } = useLogout();
    const router = useRouter()

    useEffect(() => {
        if (!customer) {
            router.push("/login")
        }
    }, [customer])

    return (
        <WithSkeleton isLoading={isLoading || isPending}>
            {
                customer && (
                    <>
                        <h1>Logout</h1>
                        <Button onClick={() => logout()}>Logout</Button>
                    </>
                )
            }
        </WithSkeleton>
    );
};

export default AccountPage;