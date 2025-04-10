import Divider from "../common/components/Divider";
import CartTable from "../cart/cart-table";
import { HttpTypes } from "@medusajs/types";
import OrderSummary from "./ordersummary";

type ItemsProps = {
  order: HttpTypes.StoreOrder;
};
const OrderItems = ({ order }: ItemsProps) => {
  const data = order.items;
  return (
    <div>
      <Divider className="mb-4" />
      <OrderSummary order={order} />
    </div>
  );
};

export default OrderItems;
