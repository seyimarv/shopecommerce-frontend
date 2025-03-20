import { CartItemWithInventory } from "@/lib/data/cart";
import CartItem from "./cart-item";

interface CartTableProps {
  data: CartItemWithInventory[];
}

const CartTable = ({ data }: CartTableProps) => {
  const tableHeaderClass = "px-4 py-4 font-normal text-gray-900 uppercase text-sm";
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="text-secondary font-light">
          <th className={`${tableHeaderClass} text-left`}>Product</th>
          <th className={`${tableHeaderClass} text-left`}>Quantity</th>
          <th className={`${tableHeaderClass} text-right`}>Total</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <CartItem
            key={item.id}
            item={item}

          />
        ))}
      </tbody>
    </table>
  );
};

export default CartTable;
