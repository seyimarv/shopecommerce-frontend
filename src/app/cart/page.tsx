import { mockProducts } from "@/lib/mock-data";
import CartTemplate from "@/ui/cart";

const Cart = () => {
  return (
    <div className="container mt-15 mb-22">
      <h2 className="text-4xl pb-8 tracking-widest uppercase">
        Your cart
      </h2>
      <CartTemplate data={mockProducts} />
    </div>
  );
};

export default Cart;
