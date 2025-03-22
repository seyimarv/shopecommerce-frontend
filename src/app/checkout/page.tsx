"use client";

import Addresses from "@/ui/checkout/addresses";

import ShippingOptions from "@/ui/checkout/shippingoptions";
import CartSummary from "@/ui/checkout/cartsummary";
import PaymentOptions from "@/ui/checkout/payment";

const Checkout = () => {
  return (
    <div className="container mt-15 flex gap-15">
      <div className="w-3/5">
        <Addresses />
        <ShippingOptions />
        <PaymentOptions />
      </div>
      <div className="w-2/5">
        <CartSummary />
      </div>
    </div>
  );
};

export default Checkout;
