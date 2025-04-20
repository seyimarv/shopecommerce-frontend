import CartTemplate from "@/ui/cart";

const Cart = () => {
  return (
    <div className="container px-4 sm:px-6 md:px-8 mt-8 md:mt-15 mb-12 md:mb-22">
      <h2 className="title pb-4 md:pb-8">
        Your cart
      </h2>
      <CartTemplate />
    </div>
  );
};

export default Cart;
