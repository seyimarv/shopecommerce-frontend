"use client";

import { CartWithInventory } from "@/lib/data/cart";
import { convertToLocale } from "@/lib/utils/money";

interface CartSummaryProps {
  cart: CartWithInventory | null;
}

const CartSummary = ({ cart }: CartSummaryProps) => {
  return (
    <div>
      <h3 className="text-3xl tracking-widest uppercase border-gray-200 border-b-2 pb-4">
        In Your Cart
      </h3>
      <div className="flex justify-between my-2">
        <span>Subtotal</span>
        <span>{convertToLocale({ amount: (cart?.subtotal || 0) - (cart?.shipping_subtotal || 0), currency_code: cart?.currency_code || "" })} </span>
      </div>
      <div className="flex justify-between my-2">
        <span>Shipping</span>
        <span>{convertToLocale({ amount: cart?.shipping_subtotal || 0, currency_code: cart?.currency_code || "" })} </span>
      </div>
      <div className="flex justify-between text-2xl border-y-2 border-gray-200 py-4">
        <span>Total</span>
        <span>{convertToLocale({ amount: cart?.total || 0, currency_code: cart?.currency_code || "" })} </span>
      </div>
    </div>
  );
};

export default CartSummary;
