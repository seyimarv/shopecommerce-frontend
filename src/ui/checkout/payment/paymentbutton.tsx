"use client"
import { isManual, isPaystack, isStripe } from "@/lib/constants"
// import { placeOrder } from "@lib/data/cart"
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
    // All hooks must be at the top level of the component
    const paystackRef = useRef<InstanceType<typeof Paystack>>(null)
    const router = useRouter();
    const { mutate, isPending } = usePlaceOrder();
    
    // Early return after hooks
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



// const StripePaymentButton = ({
//   cart,
//   notReady,
// }: {
//   cart: HttpTypes.StoreCart
//   notReady: boolean
// }) => {
//   const [submitting, setSubmitting] = useState(false)
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)

//   const onPaymentCompleted = async () => {
//     await placeOrder()
//       .catch((err) => {
//         setErrorMessage(err.message)
//       })
//       .finally(() => {
//         setSubmitting(false)
//       })
//   }

//   const stripe = useStripe()
//   const elements = useElements()
//   const card = elements?.getElement("card")

//   const session = cart.payment_collection?.payment_sessions?.find(
//     (s) => s.status === "pending"
//   )

//   const disabled = !stripe || !elements ? true : false

//   const handlePayment = async () => {
//     setSubmitting(true)

//     if (!stripe || !elements || !card || !cart) {
//       setSubmitting(false)
//       return
//     }

//     await stripe
//       .confirmCardPayment(session?.data.client_secret as string, {
//         payment_method: {
//           card: card,
//           billing_details: {
//             name:
//               cart.billing_address?.first_name +
//               " " +
//               cart.billing_address?.last_name,
//             address: {
//               city: cart.billing_address?.city ?? undefined,
//               country: cart.billing_address?.country_code ?? undefined,
//               line1: cart.billing_address?.address_1 ?? undefined,
//               line2: cart.billing_address?.address_2 ?? undefined,
//               postal_code: cart.billing_address?.postal_code ?? undefined,
//               state: cart.billing_address?.province ?? undefined,
//             },
//             email: cart.email,
//             phone: cart.billing_address?.phone ?? undefined,
//           },
//         },
//       })
//       .then(({ error, paymentIntent }) => {
//         if (error) {
//           const pi = error.payment_intent

//           if (
//             (pi && pi.status === "requires_capture") ||
//             (pi && pi.status === "succeeded")
//           ) {
//             onPaymentCompleted()
//           }

//           setErrorMessage(error.message || null)
//           return
//         }

//         if (
//           (paymentIntent && paymentIntent.status === "requires_capture") ||
//           paymentIntent.status === "succeeded"
//         ) {
//           return onPaymentCompleted()
//         }

//         return
//       })
//   }

//   return (
//     <>
//       <Button
//         disabled={disabled || notReady}
//         onClick={handlePayment}
//         size="large"
//         isLoading={submitting}
//         data-testid={dataTestId}
//       >
//         Place order
//       </Button>
//       {/* <ErrorMessage
//         error={errorMessage}
//         data-testid="stripe-payment-error-message"
//       /> */}
//     </>
//   )
// }

// const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
//   const [submitting, setSubmitting] = useState(false)
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)

//   const onPaymentCompleted = async () => {
//     await placeOrder()
//       .catch((err) => {
//         setErrorMessage(err.message)
//       })
//       .finally(() => {
//         setSubmitting(false)
//       })
//   }

//   const handlePayment = () => {
//     setSubmitting(true)

//     onPaymentCompleted()
//   }

//   return (
//     <>
//       <Button
//         disabled={notReady}
//         isLoading={submitting}
//         onClick={handlePayment}
//         size="large"
//         data-testid="submit-order-button"
//       >
//         Place order
//       </Button>
//       <ErrorMessage
//         error={errorMessage}
//         data-testid="manual-payment-error-message"
//       />
//     </>
//   )
// }

export default PaymentButton