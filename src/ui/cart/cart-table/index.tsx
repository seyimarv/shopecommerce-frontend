import { CartItemWithInventory } from "@/lib/data/cart";
import CartItem from "./cart-item";

interface CartTableProps {
  data: CartItemWithInventory[];
  currencyCode: string;
}

const CartTable = ({ data, currencyCode }: CartTableProps) => {
  const tableHeaderClass = "px-4 py-4 font-normal text-gray-900 uppercase text-sm";
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <table className="w-full text-left text-sm hidden md:table">
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
              currencyCode={currencyCode}
              isMobile={false}
            />
          ))}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        <div className="grid grid-cols-2 border-b border-gray-200 pb-2 mb-4">
          <div className="text-left font-medium text-gray-900 uppercase text-sm">Product</div>
          <div className="text-right font-medium text-gray-900 uppercase text-sm">Total</div>
        </div>
        {data.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            currencyCode={currencyCode}
            isMobile={true}
          />
        ))}
      </div>
    </div>
  );
};

export default CartTable;
