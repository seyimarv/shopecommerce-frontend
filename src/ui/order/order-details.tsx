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
            Order date:
            <span> {new Date(order.created_at).toDateString()}</span>
          </h3>
          <h3 className="">
            Order number: <span>{order.display_id}</span>
          </h3>
        </div>
        <div>
          <h3>
            Order status: <span className=" uppercase">{order.status}</span>
          </h3>
          <h3>
            Payment status:{" "}
            <span className="uppercase">{order.payment_status}</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
