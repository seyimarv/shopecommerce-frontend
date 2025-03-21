"use client";

import Addresses from "@/ui/checkout/addresses";
import CartSummary from "@/ui/checkout/cartsummary";

const Checkout = () => {
  return (
    <div className="container mt-15 flex gap-15">
      <div className="w-3/5">
        <Addresses />
      </div>
      <div className="w-2/5">
        <CartSummary />
      </div>
    </div>
  );
};

export default Checkout;
