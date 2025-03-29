"use client";

import Addresses from "@/ui/checkout/addresses";

import ShippingOptions from "@/ui/checkout/shippingoptions";
import CartSummary from "@/ui/checkout/cartsummary";
import { useRetrieveCart } from "@/lib/data/cart";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";
import PaymentOptions from "@/ui/checkout/payment";
import CheckoutTemplate from "@/ui/checkout";

const Checkout = () => {
  const { data: cart, isLoading, error } = useRetrieveCart()
  return (
    <WithSkeleton isLoading={isLoading}>
      <CheckoutTemplate />
    </WithSkeleton>
  );
};

export default Checkout;
