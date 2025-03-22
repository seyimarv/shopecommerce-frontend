"use client";

const CartSummary = () => {
  return (
    <div>
      <h3 className="text-3xl tracking-widest uppercase border-gray-200 border-b-2 pb-4">
        In Your Cart
      </h3>

      <div className="flex justify-between my-2">
        <span>Subtotal</span>
        <span>$1,199.00</span>
      </div>
      <div className="flex justify-between my-2">
        <span>Shipping</span>
        <span>$0.6</span>
      </div>
      <div className="flex justify-between text-2xl border-y-2 border-gray-200 py-4">
        <span>Total</span>
        <span>$0.7</span>
      </div>
    </div>
  );
};

export default CartSummary;
