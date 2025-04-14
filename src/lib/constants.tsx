import React from "react";
// import { CreditCard } from "@medusajs/icons"

// import Ideal from "@modules/common/icons/ideal"
// import Bancontact from "@modules/common/icons/bancontact"
// import PayPal from "@modules/common/icons/paypal"
import Paystack from "@/ui/common/icons/paystack";

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element | string }
> = {
  //   pp_stripe_stripe: {
  //     title: "Credit card",
  //     icon: <CreditCard />,
  //   },
  //   "pp_stripe-ideal_stripe": {
  //     title: "iDeal",
  //     icon: <Ideal />,
  //   },
  //   "pp_stripe-bancontact_stripe": {
  //     title: "Bancontact",
  //     icon: <Bancontact />,
  //   },
  //   pp_paypal_paypal: {
  //     title: "PayPal",
  //     icon: <PayPal />,
  //   },
  pp_system_default: {
    title: "Bank Transfer",
    icon: "",
  },
  pp_paystack_paystack: {
    title: "Paystack",
    icon: <Paystack />,
  },
  // Add more payment providers here
};

// This only checks if it is native stripe for card payments, it ignores the other stripe-based providers
export const isStripe = (providerId?: string) => {
  return providerId?.startsWith("pp_stripe_");
};
export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal");
};
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default");
};
export const isPaystack = (providerId?: string) => {
  return providerId?.startsWith("pp_paystack_paystack");
};

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
];

export const PaymentStatus = {
  authorized: "Your order has been recieved",
  captured: "Your payment has been received",
  refunded: "Your order has been refunded",
};

export const OrderStatus = {
  not_fulfilled: "Your order is yet to be processed",
  delivered: "Your order has been delivered",
};
