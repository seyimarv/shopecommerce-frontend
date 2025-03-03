import React from "react";
import Thumbnail from "@/ui/product/Thumbnail";
import { Product } from "@/ui/product/product-list";
import QuantitySelector from "@/ui/common/components/quantityselector";
import DeleteButton from "@/ui/common/components/button/delete-button";

export interface CartItem extends Product {
  quantity: number;
}

interface CartTableProps {
  data: CartItem[];
  onQuantityChange?: (productId: string, quantity: number) => void;
  onRemoveItem?: (productId: string) => void;
}

const CartTable: React.FC<CartTableProps> = ({
  data,
  onQuantityChange = () => {},
  onRemoveItem = () => {},
}) => {
  const tableHeaderClass =
    "px-4 py-4 font-normal text-gray-900 uppercase text-sm";
  const tableBodyClass = "px-4 py-8 align-top";

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
          <tr key={item.id} className="border-t border-gray-300">
            <td className={`${tableBodyClass} flex gap-4 text-left`}>
              <Thumbnail
                image={item.imgSrc}
                size="square"
                className="w-25 h-20 !rounded-none"
              />
              <div>
                <p className="font-normal text-base tracking-wide">
                  {item.title}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  ${item.price.calculated_price?.toFixed(2)}
                </p>
              </div>
            </td>
            <td className={`${tableBodyClass} text-center`}>
              <QuantitySelector
                min={1}
                max={5}
                initial={item.quantity}
                onChange={(value) => onQuantityChange(item.id, value)}
              />
            </td>
            <td className={`${tableBodyClass} text-right`}>
              <div className="flex flex-col justify-center items-end gap-2">
                {item.price.calculated_price && (
                  <span className="text-base tracking-wide">
                   20USD
                  </span>
                )}
                <DeleteButton onClick={() => onRemoveItem(item.id)} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CartTable;
