import Link from "next/link";
import Button from "../common/components/button";
import { FaChevronDown } from "react-icons/fa";
import { convertToLocale } from "@/lib/utils/money";
import { HttpTypes } from "@medusajs/types";

const OrdersList = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  return (
    <div className="">
      <ul className="flex flex-col gap-y-4">
        {orders && orders.length > 0 ? (
          orders.map((order) => {
            return (
              <li
                key={order.id}
                className="border-2 border-gray-200 rounded-md"
              >
                <Link href={`/account/orders/details/${order.id}`}>
                  <div className="bg-gray-50 flex justify-between items-center p-4">
                    <div className="grid grid-cols-3 grid-rows-2 text-small-regular lg:gap-x-4 gap-x-2 flex-1">
                      <span className="font-semibold">Date placed</span>
                      <span className="font-semibold">Order number</span>
                      <span className="font-semibold">Total amount</span>
                      <span data-testid="order-created-date">
                        {new Date(order.created_at).toDateString()}
                      </span>
                      <span>#{order.display_id}</span>
                      <span>
                        {convertToLocale({
                          amount: order.total,
                          currency_code: order.currency_code,
                        })}
                      </span>
                    </div>
                    <button className="flex items-center justify-between">
                      <span className="sr-only">
                        Go to order #{order.display_id}
                      </span>
                      <FaChevronDown className="-rotate-90" />
                    </button>
                  </div>
                </Link>
              </li>
            );
          })
        ) : (
          <div className="flex flex-col gap-4 md:flex-row md:gap-4 md:items-center">
            <span>You don't have any orders yet, let us change that!</span>
            <Button isLink href="/products" className="w-fit">Continue Shopping</Button>
          </div>
        )}
      </ul>
    </div>
  );
};

export default OrdersList;
