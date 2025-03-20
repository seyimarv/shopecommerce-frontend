import { CartItemWithInventory, useDeleteLineItem, useUpdateLineItem } from "@/lib/data/cart";
import Image from "next/image";
import QuantitySelector from "@/ui/common/components/quantityselector";
import DeleteButton from "@/ui/common/components/button/delete-button";
import { debounce } from "lodash";
import { useState, useCallback } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface CartItemProps {
    item: CartItemWithInventory;
}

const CartItem = ({ item }: CartItemProps) => {
    const [quantity, setQuantity] = useState(item.quantity)
    const { mutate: updateItem, isPending: isUpdatePending } =
        useUpdateLineItem();
    const { mutate: deleteItem, isPending: isDeletePending } =
        useDeleteLineItem();

    const debouncedUpdateQuantity = useCallback(
        debounce((quantity: number) => {
            updateItem({ lineId: item.id, quantity });
        }),
        [item.id, updateItem]
    );

    const handleQuantityChange = (quantity: number) => {
        setQuantity(quantity)
        debouncedUpdateQuantity(quantity);
    };

    const handleRemove = () => {
        deleteItem(item.id);
    };

    return (
        <tr key={item.id} className="border-t border-gray-300">
            <td className="p-4 flex gap-4 text-left">
                {item.thumbnail && (
                    <div className="relative w-24 h-24">
                        <Image
                            src={item.thumbnail}
                            alt={item.title || "Product image"}
                            fill
                            className="object-cover rounded-md"
                        />
                    </div>
                )}
                <div>
                    <p className="font-normal text-base tracking-wide">
                        {item.product?.title}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        {!item?.title.includes("Default") ? (item.title || item?.product?.title || "") : ""}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        {item.unit_price}
                    </p>
                </div>
            </td>
            <td className="p-4 text-center">
                <QuantitySelector
                    min={1}
                    max={item.inventory_quantity || Infinity}
                    quantity={quantity}
                    onChange={handleQuantityChange}
                />
            </td>
            <td className="p-4 text-right">
                <div className="flex flex-col justify-center items-end gap-2">
                    {
                        isUpdatePending || isDeletePending ? (
                            <div className="animate-spin w-fit">
                                <AiOutlineLoading3Quarters size={40} />
                            </div>
                        ) : (

                            <><span className="text-base tracking-wide">
                                {item.unit_price * item.quantity}
                            </span><DeleteButton onClick={handleRemove} /></>

                        )
                    }
                </div>
            </td>
        </tr>
    );
};

export default CartItem;