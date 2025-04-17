import CartTemplate from "@/ui/cart";

const Cart = () => {
  return (
    <div className="container px-4 sm:px-6 md:px-8 mt-8 md:mt-15 mb-12 md:mb-22">
      <h2 className="text-2xl md:text-3xl lg:text-4xl pb-4 md:pb-8 tracking-widest uppercase font-medium">
        Your cart
      </h2>
      <CartTemplate />
    </div>
  );
};

export default Cart;
