import { CartItemWithInventory, useDeleteLineItem, useUpdateLineItem } from "@/lib/data/cart";
import Image from "next/image";
import QuantitySelector from "@/ui/common/components/quantityselector";
import DeleteButton from "@/ui/common/components/button/delete-button";
import { debounce } from "lodash";
import { useState, useCallback, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { convertToLocale } from "@/lib/utils/money";
import Link from "next/link";
import Spinner from "@/ui/common/components/spinner";

interface CartItemProps {
    item: CartItemWithInventory;
    currencyCode: string;
    isMobile: boolean;
}

const CartItem = ({ item, currencyCode, isMobile }: CartItemProps) => {
    const [quantity, setQuantity] = useState(item.quantity)
    const { mutate: updateItem, isPending: isUpdatePending } =
        useUpdateLineItem();
    const { mutate: deleteItem, isPending: isDeletePending } =
        useDeleteLineItem();

    useEffect(() => {
        const maxInv = item.inventory_quantity;
        if (typeof maxInv === 'number') {
            if (quantity > maxInv) {
                setQuantity(maxInv);
                updateItem({ lineId: item.id, quantity: maxInv });
            }
        }
    }, [item.id, item.inventory_quantity, quantity, updateItem]);

    const debouncedUpdateQuantity = useCallback(
        debounce((newQuantity: number) => {
            if (typeof newQuantity === 'number' && !isNaN(newQuantity)) {
                updateItem({ lineId: item.id, quantity: newQuantity });
            }
        }, 500),
        [item.id, updateItem]
    );

    const handleQuantityChange = (newQuantity: number) => {
        if (typeof newQuantity !== 'number' || isNaN(newQuantity)) {
            return;
        }

        newQuantity = Math.max(1, newQuantity);

        setQuantity(newQuantity);
        debouncedUpdateQuantity(newQuantity);
    };

    const handleRemove = () => {
        if (isUpdatePending) return;
        deleteItem(item.id);
    };

    const isLoading = isUpdatePending || isDeletePending;

    // Mobile layout based on the image provided
    if (isMobile) {
        return (
            <div className="border-b border-gray-200 pt-2 pb-6 opacity-100 transition-opacity duration-300" style={{ opacity: isLoading ? 0.7 : 1 }}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex space-y-3">
                        <div className="flex gap-3 items-start">
                            {(item.thumbnail || item?.images?.[0]?.url) && (
                                <Link href={`/products/${item.product?.handle}`} className="relative w-16 h-16 flex-shrink-0">
                                    <Image
                                        src={item.thumbnail || item?.images?.[0]?.url || ""}
                                        alt={item.title || "Product image"}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </Link>
                            )}
                            <div className="flex-1 min-w-0">
                                <Link href={`/products/${item.product?.handle}`} className="font-normal text-sm tracking-wide hover:underline line-clamp-2">
                                    {item.product?.title}
                                </Link>
                                <p className="text-gray-500 text-xs mt-1">
                                    {!item?.title.includes("Default") ? (item.title || item?.product?.title || "") : ""}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {convertToLocale({ amount: item.unit_price, currency_code: currencyCode })}
                                </p>
                                <div className="mt-2 flex gap-2 items-center">
                                    <QuantitySelector
                                        min={1}
                                        max={item.inventory_quantity ?? Infinity}
                                        quantity={quantity}
                                        onChange={handleQuantityChange}
                                        compact={true}
                                    />
                                    <div>
                                        <DeleteButton onClick={handleRemove} size="small" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="flex flex-col items-end justify-between">
                        {!isLoading ? (
                            <>
                                <span className="text-base font-medium">
                                    {convertToLocale({ amount: item.unit_price * quantity, currency_code: currencyCode })}
                                </span>
                            </>
                        ) : (
                            <div>
                                <Spinner />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <tr key={item.id} className="border-t border-gray-300 opacity-100 transition-opacity duration-300" style={{ opacity: isLoading ? 0.7 : 1 }}>
            <td className="p-4 flex gap-4 text-left">
                {(item.thumbnail || item?.images?.[0]?.url) && (
                    <Link href={`/products/${item.product?.handle}`} className="relative w-24 h-24">
                        <Image
                            src={item.thumbnail || item?.images?.[0]?.url || ""}
                            alt={item.title || "Product image"}
                            fill
                            className="object-cover rounded-md"
                        />
                    </Link>
                )}
                <div>
                    <Link href={`/products/${item.product?.handle}`} className="font-normal text-base tracking-wide hover:underline">
                        {item.product?.title}
                    </Link>
                    <p className="text-gray-500 text-sm mt-1">
                        {!item?.title.includes("Default") ? (item.title || item?.product?.title || "") : ""}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        {convertToLocale({ amount: item.unit_price, currency_code: currencyCode })}
                    </p>
                </div>
            </td>
            <td className="p-4 text-center">
                <QuantitySelector
                    min={1}
                    max={item.inventory_quantity ?? Infinity}
                    quantity={quantity}
                    onChange={handleQuantityChange}
                />
            </td>
            <td className="p-4 text-right">
                <div className="flex flex-col justify-center items-end gap-2 relative">
                    {!isLoading && (
                        <>
                            <span className="text-base tracking-wide">
                                {convertToLocale({ amount: item.unit_price * quantity, currency_code: currencyCode })}
                            </span>
                            <DeleteButton onClick={handleRemove} size="medium" />
                        </>
                    )}
                    {isLoading && (
                        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                            <AiOutlineLoading3Quarters size={40} className="animate-spin text-gray-500" />
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default CartItem;