import Image from "next/image";
import { HttpTypes } from "@medusajs/types";
import Divider from "../common/components/Divider";
import { convertToLocale } from "@/lib/utils/money";

type OrderProps = {
  order: HttpTypes.StoreOrder;
};
const CartSummary = ({ order }: OrderProps) => {
  const { items } = order;

  return (
    <div className="">
      <div className="space-y-6">
        {items?.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 border-b pb-4 border-gray-200"
          >
            <div className="relative w-20 h-20 rounded overflow-hidden">
              <Image
                src={item.thumbnail ?? "/placeholder-image.png"}
                alt={`Thumbnail ${item.id}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.product.title}</h3>
              <p className="text-sm text-gray-500">
                Variant: {item.variant?.title ?? "N/A"}
              </p>
              <p className="text-sm mt-1">
                {item.quantity} x{" "}
                {convertToLocale({
                  amount: item.unit_price,
                  currency_code: order.currency_code,
                })}
              </p>
            </div>
            <div className="text-right font-medium">
              {convertToLocale({
                amount: item.unit_price * item.quantity,
                currency_code: order.currency_code,
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-2 text-lg text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            {convertToLocale({
              amount: order.item_total,
              currency_code: order.currency_code,
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {convertToLocale({
              amount: order.shipping_total,
              currency_code: order.currency_code,
            })}
          </span>
        </div>
      </div>

      {!!order.discount_total && (
        <div className="flex justify-between text-red-600">
          <span>Discount</span>
          <span>
            -{" "}
            {convertToLocale({
              amount: order.discount_total,
              currency_code: order.currency_code,
            })}
          </span>
        </div>
      )}

      {!!order.gift_card_total && (
        <div className="flex justify-between text-purple-600">
          <span>Gift Card</span>
          <span>
            -{" "}
            {convertToLocale({
              amount: order.gift_card_total,
              currency_code: order.currency_code,
            })}
          </span>
        </div>
      )}
      <Divider className="mt-3" />
      <div className="flex justify-between text-xl font-bold mt-2">
        <span>Total</span>
        <span>
          {convertToLocale({
            amount: order.total,
            currency_code: order.currency_code,
          })}
        </span>
      </div>
      <Divider className="mt-4" />
    </div>
  );
};

export default CartSummary;
