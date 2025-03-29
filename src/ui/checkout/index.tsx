import { useRetrieveCart } from "@/lib/data/cart";
import cart from "../cart";
import Addresses from "./addresses";
import CartSummary from "./cartsummary";
import PaymentOptions from "./payment";
import ShippingOptions from "./shippingoptions";
import { useEffect } from "react";
import { getCheckoutStep } from "@/lib/utils/checkout";
import { useRouter } from "next/navigation";

const CheckoutTemplate = () => {
    const { data: cart } = useRetrieveCart()
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
        <>
            {
                cart &&
                <div className="container mt-15 flex gap-15">
                    <div className="w-3/5">
                        <Addresses />
                        <ShippingOptions disabled={getCheckoutStep(cart) === "address"} />
                        <PaymentOptions disabled={getCheckoutStep(cart) === "address" || "delivery"} />
                    </div>
                    <div className="w-2/5">
                        <CartSummary cart={cart} />
                    </div>
                </div>
            }
        </>
    )
}

export default CheckoutTemplate