import { HttpTypes } from "@medusajs/types";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa6";
import { convertToLocale } from "@/lib/utils/money";
import Divider from "../common/components/Divider";

type OverviewComponentProps = {
  customer: HttpTypes.StoreCustomer | null;
  orders: HttpTypes.StoreOrder[] | null;
};

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0;

  if (!customer) {
    return 0;
  }

  if (customer.email) {
    count++;
  }

  if (customer.first_name && customer.last_name) {
    count++;
  }

  if (customer.phone) {
    count++;
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  );

  if (billingAddress) {
    count++;
  }

  return (count / 4) * 100;
};

const OverviewComponent = ({ customer, orders }: OverviewComponentProps) => {
  console.log("Customer:", customer);
  console.log("Orders:", orders);

  return (
    <div className=" flex flex-col gap-y-2 tracking-wide">
      <div className="flex items-center justify-between">
        {" "}
        <h3 className="text-3xl">Hello {customer?.last_name}!</h3>
        <span className="">
          Signed in as:{" "}
          <span
            className="font-semibold"
            data-testid="customer-email"
            data-value={customer?.email}
          >
            {customer?.email}
          </span>
        </span>
      </div>

      <Divider className="my-4" />
      <div className="flex gap-12 items-center">
        <div>
          {" "}
          <h3 className="text-2xl mb-2">Profile</h3>
          <span className="font-bold text-3xl">
            {" "}
            {getProfileCompletion(customer)}%{" "}
          </span>
          <span className="uppercase">Completed</span>
        </div>
        <div>
          <h3 className="text-2xl mb-2">Addresses</h3>
          <span className="font-bold text-3xl">
            {" "}
            {customer?.addresses?.length || 0}{" "}
          </span>
          <span className="uppercase">Saved</span>
        </div>
      </div>

      <div className="">
        <h3 className="font-medium text-2xl my-5">Recent Orders</h3>
        <ul className="flex flex-col gap-y-4" data-testid="orders-wrapper">
          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order) => {
              return (
                <li
                  key={order.id}
                  className="border-2 border-gray-200 rounded-md"
                >
                  <Link href={`/account/orders/details/${order.id}`}>
                    <div className="bg-gray-50 flex justify-between items-center p-4">
                      <div className="grid grid-cols-3 grid-rows-2 text-small-regular gap-x-4 flex-1">
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
            <span>No recent orders</span>
          )}
        </ul>
      </div>
    </div>
  );
};

export default OverviewComponent;
