"use client";

import CartTable, { CartItem } from "./cart-table";
import EmptyCart from "./empty-cart";
import Summary from "./summary";
import { useState } from "react";

interface CartTemplateProps {
  data: CartItem[];
}

const CartTemplate: React.FC<CartTemplateProps> = ({ data }) => {
  const [isEmpty, setIsEmpty] = useState(data.length === 0);
  const subtotal = 30;

  return (
    <>
      {isEmpty ? (
        <EmptyCart />
      ) : (
        <div className="overflow-x-auto">
          <CartTable data={data} />
          <Summary subtotal={subtotal} />
        </div>
      )}
    </>
  );
};

export default CartTemplate;
