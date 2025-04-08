import { OrderStatus, PaymentStatus } from "@/lib/constants";
import { HttpTypes } from "@medusajs/types";

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder;
  showStatus?: boolean;
};

const OrderDetails = ({ order }: OrderDetailsProps) => {
  return (
    <div className="flex flex-col gap-2 text-lg">
      <h3 className="">
        We have sent the order confirmation details to:{" "}
        <span className="font-bold">{order.email}</span>
      </h3>
      <div className="flex gap-5 tracking-wide">
        <div>
          <h3 className="">
            Order Date:
            <span> {new Date(order.created_at).toDateString()}</span>
          </h3>
          <h3 className="">
            Order Number: <span>{order.display_id}</span>
          </h3>
        </div>
        <div>
          <h3>
            Order Status:{" "}
            <span className=" uppercase">
              {OrderStatus[order.status as keyof typeof OrderStatus] ||
                order.status}
            </span>
          </h3>
          <h3>
            Payment Status:{" "}
            <span className="uppercase">
              {PaymentStatus[
                order.payment_status as keyof typeof PaymentStatus
              ] || order.payment_status}
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
