"use client";

import { useRetrieveCart } from "@/lib/data/cart";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";
import CheckoutTemplate from "@/ui/checkout";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Checkout = () => {
  const { data: cart, isLoading, error } = useRetrieveCart()
  return (
    <WithSkeleton isLoading={isLoading} skeleton={
      <div className="flex items-center justify-center min-h-screen">
        <AiOutlineLoading3Quarters className="animate-spin" />
      </div>} >
      <CheckoutTemplate />
    </WithSkeleton>
  );
};

export default Checkout;
