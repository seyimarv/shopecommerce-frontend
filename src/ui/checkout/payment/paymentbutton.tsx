"use client"
import { isManual, isPaystack, isStripe } from "@/lib/constants"
import { HttpTypes } from "@medusajs/types"
import Button from "@/ui/common/components/button"
import React, { useRef, useState } from "react"
import Paystack from "paystack-inline-ts"
import { useRouter } from "next/navigation"
import { usePlaceOrder } from "@/lib/data/cart"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

type PaymentButtonProps = {
    cart: HttpTypes.StoreCart
}

const PaystackPaymentButton = ({
    session,
    notReady,
}: {
    session: HttpTypes.StorePaymentSession | undefined
    notReady: boolean
}) => {
    const paystackRef = useRef<InstanceType<typeof Paystack>>(null)
    const router = useRouter();
    const { mutate, isPending } = usePlaceOrder();
    
    if (notReady || !session) return null

    const accessCode = session.data.access_code as string
    console.log(accessCode)

    if (!accessCode) throw new Error("Transaction access code is not defined")

    const handlePlaceOrder = () => {
        mutate(
            {},
            {
                onSuccess: (data) => {
                    if (data.orderId) {
                        router.push(`/order/${data.orderId}/confirmed`);
                    } else {
                        console.log("Order not completed, cart returned:", data.cart);
                    }
                },
                onError: (err) => {
                    console.error("Error placing order:", err);
                }
            }
        );
    };


    return (
        <Button
            onClick={() => {
                if (!paystackRef.current) {
                    paystackRef.current = new Paystack()
                }

                const paystack = paystackRef.current

                paystack.resumeTransaction({
                    accessCode,
                    async onSuccess() {
                        handlePlaceOrder()
                    },
                    onError(error: unknown) {
                        console.error(error)
                    },
                })
            }}
        >
            {isPending ? (
                <>
                    Pay with Paystack <AiOutlineLoading3Quarters className="ml-2 inline animate-spin" />
                </>
            ) : (
                "Pay with Paystack"
            )}
        </Button>
    )
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
    cart,
}) => {
    const notReady =
        !cart ||
        !cart.shipping_address ||
        !cart.email ||
        (cart.shipping_methods?.length ?? 0) < 1

    const paymentSession = cart.payment_collection?.payment_sessions?.[0]

    switch (true) {
        case isStripe(paymentSession?.provider_id):
            return (
                <></>
            )
        case isManual(paymentSession?.provider_id):
            return (
                <></>
            )
        case isPaystack(paymentSession?.provider_id):
            return (
                <PaystackPaymentButton notReady={notReady} session={paymentSession} />
            )
        default:
            return <Button disabled>Select a payment method</Button>
    }
}


export default PaymentButton