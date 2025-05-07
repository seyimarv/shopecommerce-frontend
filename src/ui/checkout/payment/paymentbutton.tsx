"use client"
import { isManual, isPaystack, isStripe } from "@/lib/constants"
import { HttpTypes } from "@medusajs/types"
import Button from "@/ui/common/components/button"
import React, { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CartWithInventory, usePlaceOrder } from "@/lib/data/cart"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

type PaymentButtonProps = {
    cart: CartWithInventory
}

type PaystackInstance = any;

const PaystackPaymentButton = ({
    session,
    notReady,
    cart
}: {
    session: HttpTypes.StorePaymentSession | undefined
    notReady: boolean
    cart: CartWithInventory
}) => {
    const paystackRef = useRef<PaystackInstance>(null)
    const router = useRouter();
    const { mutate: placeOrderMutate, isPending: isPlacingOrder } = usePlaceOrder();
    const [isLoadingPaystack, setIsLoadingPaystack] = useState(false);

    if (notReady || !session) {
        return <Button disabled>Processing...</Button>;
    }

    const accessCode = session.data.access_code as string

    if (!accessCode) {
        console.error("Paystack access code is not defined");
    }

    const handlePlaceOrder = () => {
        placeOrderMutate(
            {
                cartId: cart.id, 
                cart: cart 
            },
            {
                onSuccess: (data) => {
                    const orderId = (data as { orderId?: string })?.orderId;
                    if (orderId) {
                        router.push(`/order/${orderId}/confirmed`);
                    } else {
                        console.log("Order not completed or orderId missing, cart data:", data);
                    }
                },
                onError: (err) => {
                    console.error("Error placing order:", err);
                }
            }
        );
    };

    const initializeAndPay = async () => {
        setIsLoadingPaystack(true);
        try {
            const Paystack = (await import("paystack-inline-ts")).default;
            
            if (!paystackRef.current) {
                paystackRef.current = new Paystack();
            }

            const paystackInstance = paystackRef.current;

            if (!paystackInstance) {
                console.error("Failed to initialize Paystack");
                setIsLoadingPaystack(false);
                return;
            }

            paystackInstance.resumeTransaction({
                accessCode,
                onSuccess() {
                    handlePlaceOrder();
                },
                onError(error: unknown) {
                    console.error("Paystack transaction error:", error);
                },
                onClose() {
                    console.log("Paystack transaction closed by user");
                }
            });
        } catch (error) {
            console.error("Failed to load or initialize Paystack:", error);
        } finally {
            setIsLoadingPaystack(false); 
        }
    };

    return (
        <Button
            onClick={initializeAndPay}
            disabled={isPlacingOrder || isLoadingPaystack || notReady}
        >
            {isPlacingOrder || isLoadingPaystack ? (
                <>
                    Processing Payment <AiOutlineLoading3Quarters className="ml-2 inline animate-spin" />
                </>
            ) : (
                "Pay with Paystack"
            )}
        </Button>
    )
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ cart }) => {
    const notReady =
        !cart ||
        !cart.shipping_address ||
        !cart.email ||
        (cart.shipping_methods?.length ?? 0) < 1;

    const paymentSession = cart.payment_collection?.payment_sessions?.[0];

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return 
    }

    // if (notReady && !paymentSession) {
    //     return <Button disabled>Complete shipping and select payment</Button>;
    // }
    
    // if (!paymentSession) {
    //     return <Button disabled>Select a payment method</Button>;
    // }

    switch (true) {
        case isStripe(paymentSession?.provider_id):
            return <Button disabled>Pay with Stripe</Button>; 
        case isManual(paymentSession?.provider_id):
            return null; 
        case isPaystack(paymentSession?.provider_id):
            return (
                <PaystackPaymentButton cart={cart} notReady={notReady} session={paymentSession} />
            );
        default:
            return <Button disabled>select a payment method</Button>;
    }
};

export default PaymentButton;