"use client";
import OrderCartSummary from "@/ui/checkout/cartsummary";
import { CartWithInventory } from "@/lib/data/cart";
import { convertToLocale } from "@/lib/utils/money";
import DiscountCode from "../discount-code";
import CheckoutItem from '../checkout-item';

interface CartSummaryProps {
  cart: CartWithInventory | null;
}

const CartSummary = ({ cart }: CartSummaryProps) => {

  return (
    <div>
      <h3 className="subtitle border-gray-200 border-b-2 pb-4">
        In Your Cart
      </h3>
      <div className="my-4">
        {cart?.items?.length ? (
          cart.items.map((item) => (
            <CheckoutItem
              key={item.id}
              item={item}
              currencyCode={cart.currency_code || ''}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">Your cart is empty.</div>
        )}
      </div>
      <div className="flex flex-col gap-y-2 my-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            {convertToLocale({
              amount: (cart?.subtotal ?? 0) - (cart?.shipping_subtotal ?? 0),
              currency_code: cart?.currency_code || ""
            })}
          </span>
        </div>

        {!!cart?.discount_total && (
          <div className="flex justify-between">
            <span>Discount</span>
            <span className="text-emerald-600">
              - {convertToLocale({ amount: cart.discount_total ?? 0, currency_code: cart.currency_code || "" })}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {convertToLocale({ amount: cart?.shipping_subtotal ?? 0, currency_code: cart?.currency_code || "" })}
          </span>
        </div>

        {/* <div className="flex justify-between">
          <span>Taxes</span>
          <span>
            {convertToLocale({ amount: cart?.tax_total ?? 0, currency_code: cart?.currency_code || "" })}
          </span>
        </div> */}

        {!!cart?.gift_card_total && (
          <div className="flex justify-between">
            <span>Gift card</span>
            <span className="text-emerald-600">
              - {convertToLocale({ amount: cart.gift_card_total ?? 0, currency_code: cart.currency_code || "" })}
            </span>
          </div>
        )}
      </div>
      <div className="flex justify-between text-xl md:text-2xl border-y-2 border-gray-200 py-4">
        <span>Total</span>
        <span>
          {convertToLocale({ amount: cart?.total ?? 0, currency_code: cart?.currency_code || "" })}
        </span>
      </div>
      <DiscountCode />
    </div>
  );
};

export default CartSummary;
