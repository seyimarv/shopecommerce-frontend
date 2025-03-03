import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import QuantitySelector from "@/ui/common/components/quantityselector";
import { Product } from "../product-list";
import Thumbnail from "../Thumbnail";

interface CartProductProps extends Product {
  onRemove?: (id: string) => void;
  onQuantityChange?: (id: string, quantity: number) => void;
}

const CartProduct: React.FC<CartProductProps> = ({
  id,
  title,
  imgSrc,
  price,
  onRemove,
  onQuantityChange,
}) => {
  const handleQuantityChange = (quantity: number) => {
    if (onQuantityChange) {
      onQuantityChange(id, quantity);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(id);
    }
  };

  return (
    <div className="py-6 w-full border-b border-b-gray-200 last:border-b-0">
      <div className="flex gap-4">
        <Thumbnail image={imgSrc} size="square" className="w-25 h-20 !rounded-none" />
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center w-full">
            <span className="font-medium">{title}</span>
            <button
              className="text-gray-500 text-lg hover:text-gray-700 transition-colors"
              onClick={handleRemove}
              aria-label="Remove from cart"
            >
              <MdOutlineCancel />
            </button>
          </div>
          <div className="flex w-full justify-between items-center mt-4">
            <QuantitySelector
              min={1}
              max={5}
              initial={1}
              onChange={handleQuantityChange}
            />
            <span className="text-lg font-medium">
              ${price?.calculated_price?.toFixed(2) || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
