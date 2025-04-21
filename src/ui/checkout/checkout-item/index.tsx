import React from 'react';
import Link from 'next/link';
import { CartItemWithInventory } from '@/lib/data/cart';
import { convertToLocale } from '@/lib/utils/money';
import Thumbnail from '@/ui/product/Thumbnail';

interface CheckoutItemProps {
    item: Omit<CartItemWithInventory, 'beforeInsert'>;
    currencyCode: string;
}

const CheckoutItem: React.FC<CheckoutItemProps> = ({ item, currencyCode }) => {
    const original_unit_price = item.unit_price;
    const current_unit_price =
        item.total != null && item.quantity > 0
            ? item.total / item.quantity
            : original_unit_price;
    const hasReducedPrice = (item.discount_total ?? 0) > 0 || (item.total != null && item.subtotal != null && item.total < item.subtotal);

    return (
        <div className="flex gap-4 py-4 border-b border-gray-200 last-of-type:border-none justify-between w-full">
            <div className='flex gap-2'>
                {item.thumbnail && (
                    <Thumbnail image={item.thumbnail} size='full' className='!w-16 !h-16' />
                )}
                <div className="flex flex-col flex-grow justify-between min-w-0">
                    <div>
                        <h3 className="text-sm font-medium truncate">
                            {item.product?.title}
                        </h3>
                        {item.variant?.title && item.variant.title.toLowerCase() !== 'default variant' && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate" title={item.variant.title}>
                                {item.variant.title}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-0.5">
                            Quantity: {item.quantity}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col text-sm">
                {hasReducedPrice && (
                    <span className="text-gray-500 line-through">
                        {convertToLocale({
                            amount: original_unit_price,
                            currency_code: currencyCode
                        })}
                    </span>
                )}
                <span className={`font-medium ${hasReducedPrice ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {convertToLocale({
                        amount: current_unit_price,
                        currency_code: currencyCode
                    })}
                </span>
            </div>
        </div>
    );
};

export default CheckoutItem;