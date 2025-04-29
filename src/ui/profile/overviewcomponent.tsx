import { HttpTypes } from "@medusajs/types";
import Divider from "../common/components/Divider";
import OrdersList from "./order-list";
import OrdersComponent from "./orderscomponent";

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

  return (
    <div className=" flex flex-col gap-y-2 tracking-wide">
      <div className="flex items-center justify-between">
        {" "}
        <h3 className="lg:text-3xl text-lg">Hello {customer?.last_name}!</h3>
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
          <span className="font-bold lg:text-3xl text-2xl">
            {" "}
            {getProfileCompletion(customer)}%{" "}
          </span>
          <span className="uppercase">Completed</span>
        </div>
        <div>
          <h3 className="text-2xl mb-2">Addresses</h3>
          <span className="font-bold lg:text-3xl text-2xl">
            {" "}
            {customer?.addresses?.length || 0}{" "}
          </span>
          <span className="uppercase">Saved</span>
        </div>
      </div>

      <div className="">
        <h3 className="font-medium text-2xl my-5">Recent Orders</h3>

        <OrdersComponent isOverview />
      </div>
    </div>
  );
};

export default OverviewComponent;
