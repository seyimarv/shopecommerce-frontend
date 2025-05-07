"use client";
import { useState } from "react";
import { convertToLocale } from "@/lib/utils/money";
import DiscountCode from "../discount-code";
import CheckoutItem from '../checkout-item';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useRetrieveCart } from "@/lib/data/cart";


const CartSummary = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { data: cart } = useRetrieveCart()

  return (
    <div className="shadow-sm rounded-md overflow-hidden">
      {/* Mobile Order Summary Toggle */}
      {isMobile && (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50"
          aria-expanded={isOpen}
          aria-controls="cart-summary-content"
        >
          <div className="flex items-center">
            <span className="font-medium text-xl">In your cart</span>
            {isOpen ? <FiChevronUp className="ml-2 font-medium transition-transform duration-300" /> : <FiChevronDown className="ml-2 transition-transform duration-300" />}
          </div>
          <div className="flex flex-col">
          <span className="font-medium line-through">
            {convertToLocale({ amount: cart?.discount_total ?? 0, currency_code: cart?.currency_code || "" })}
          </span>
          <span className="font-medium">
            {convertToLocale({ amount: cart?.total ?? 0, currency_code: cart?.currency_code || "" })}
          </span>
          </div>
        </button>
      )}
      <div 
        id="cart-summary-content"
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isMobile ? (isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0') : ''}`}
      >
        <div className={`p-4 ${isMobile ? 'overflow-y-auto max-h-[75vh]' : ''}`}>


        {!isMobile && (
          <h3 className="subtitle border-gray-200 border-b-2 pb-4">
            In Your Cart
          </h3>
        )}
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
      </div>
    </div>
  );
};

export default CartSummary;
