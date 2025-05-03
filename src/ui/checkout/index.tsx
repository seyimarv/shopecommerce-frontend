"use client"

import { useRetrieveCart } from "@/lib/data/cart";
import Addresses from "./addresses";
import CartSummary from "./cartsummary";
import PaymentOptions from "./payment";
import ShippingOptions from "./shippingoptions";
import { useEffect } from "react";
import { getCheckoutStep } from "@/lib/utils/checkout";
import { useRouter } from "next/navigation";
import WithSkeleton from "../common/components/Skeleton/with-skeleton";
import EmptyCart from "../cart/empty-cart";
import PageSpinner from "../common/components/spinner/page-spinner";

const CheckoutTemplate = () => {
    const { data: cart, isLoading } = useRetrieveCart()
    const router = useRouter();

    useEffect(() => {
        if (getCheckoutStep(cart) === "address") {
            router.push("?step=address");
        }
        else if (getCheckoutStep(cart) === "delivery") {
            router.push("?step=delivery");
        } else if (getCheckoutStep(cart) === "payment") {
            router.push("?step=payment");
        }
    }, [router]);

    return (
        <WithSkeleton isLoading={isLoading} skeleton={
            <PageSpinner />
        }>
            {
                cart && cart.items.length > 0 ? (
                <div className="container mx-auto px-4 mt-8 lg:mt-16 flex flex-col lg:flex-row gap-y-8 lg:gap-x-24">
                    <div className="w-full lg:w-3/5 order-2 lg:order-1 space-y-8">
                        <Addresses />
                        <ShippingOptions disabled={getCheckoutStep(cart) === "address"} />
                        <PaymentOptions />
                    </div>
                    <div className="w-full lg:w-2/5 order-1 lg:order-2">
                        <CartSummary cart={cart} />
                    </div>
                </div>
            ) : (
                <EmptyCart />
            )
            }
        </WithSkeleton>
    )
}

export default CheckoutTemplate