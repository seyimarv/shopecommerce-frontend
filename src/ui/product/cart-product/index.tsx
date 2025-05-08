import React, { useCallback, useState, useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";
import QuantitySelector from "@/ui/common/components/quantityselector";
import Thumbnail from "../Thumbnail";
import { convertToLocale } from "@/lib/utils/money";
import { useUpdateLineItem, useDeleteLineItem } from "@/lib/data/cart";
import { debounce } from "@/lib/utils/debounce";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";

interface CartProductProps {
  id: string;
  title: string;
  thumbnail?: string;
  price: number;
  quantity: number;
  productTitle?: string;
  max: number;
  currencyCode: string;
  handle?: string;
}

const CartProduct: React.FC<CartProductProps> = ({
  id,
  title,
  thumbnail,
  price,
  quantity: initialQuantity,
  productTitle,
  max,
  currencyCode,
  handle
}) => {
      const [quantity, setQuantity] = useState(initialQuantity)
      const { mutate: updateItem, isPending: isUpdatePending } =
          useUpdateLineItem();
      const { mutate: deleteItem, isPending: isDeletePending } =
          useDeleteLineItem();
  
      useEffect(() => {
          if (typeof max === 'number' && quantity > max) {
              setQuantity(max); 
              updateItem({ lineId: id, quantity: max }); 
          }
          if (typeof max === 'number' && initialQuantity > max) {
              setQuantity(max);
          } else if (quantity !== initialQuantity && initialQuantity <= max) {
              setQuantity(initialQuantity);
          }
      }, [id, max, quantity, updateItem, initialQuantity]);
  
      const debouncedUpdateQuantity = useCallback(
          debounce((newQuantity: number) => {
              if (typeof newQuantity === 'number' && !isNaN(newQuantity)) {
                  updateItem({ lineId: id, quantity: newQuantity });
              }
          }, 500), 
          [id, updateItem] 
      );
  
      const handleQuantityChange = (newQuantity: number) => {
          if (typeof newQuantity !== 'number' || isNaN(newQuantity)) {
              return;
          }
          const clampedQuantity = Math.max(1, typeof max === 'number' ? Math.min(newQuantity, max) : newQuantity);
          if (clampedQuantity !== quantity) {
              setQuantity(clampedQuantity);
              debouncedUpdateQuantity(clampedQuantity);
          }
      };
  
      const handleRemove = () => {
          if (isUpdatePending) return;
          deleteItem(id); 
      };
  


  return (
    <div className="py-6 w-full border-b border-b-gray-200 last:border-b-0">
      <div className="flex gap-4">
        {handle ? (
          <Link href={`/products/${handle}`}>
            <Thumbnail
              image={thumbnail}
              size="square"
              className="w-25 h-20 !rounded-none"
            />
          </Link>
        ) : (
          <Thumbnail
            image={thumbnail}
            size="square"
            className="w-25 h-20 !rounded-none"
          />
        )}
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center w-full">
            {handle ? (
              <Link href={`/products/${handle}`} className="font-medium hover:underline">
                {productTitle}
                {title && <>- {title}</>}
              </Link>
            ) : (
              <span className="font-medium">
                {productTitle}
                {title && <>- {title}</>}
              </span>
            )}

            {isUpdatePending || isDeletePending ? (
              <div className="animate-spin">
                <AiOutlineLoading3Quarters />
              </div>
            ) : (
              <button
                className="text-gray-500 text-lg hover:text-gray-700 transition-colors"
                onClick={handleRemove}
                aria-label="Remove from cart"
              >
                <MdOutlineCancel />
              </button>
            )}
          </div>
          <div className="flex w-full justify-between items-center mt-4">
            <QuantitySelector
              min={1}
              max={max ?? Infinity}
              quantity={quantity}
              onChange={handleQuantityChange}
            />
            <span className="text-lg font-medium">
              {convertToLocale({ amount: price, currency_code: currencyCode })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
