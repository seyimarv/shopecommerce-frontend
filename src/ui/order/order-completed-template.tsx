import OrderItems from "./items";
import OrderDetails from "./order-details";
import { HttpTypes } from "@medusajs/types";

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder;
};
const OrderCompletedTemplate = ({ order }: OrderCompletedTemplateProps) => {
  return (
    <div className="flex flex-col gap-3 p-10 w-2/3 m-auto">
      <h1 className="text-3xl ">Thank you!</h1>
      <h1 className="text-3xl ">Your order was placed successfully.</h1>
      <OrderDetails order={order} />
      <h2 className="text-2xl">Summary</h2>
      <OrderItems order={order} />
    </div>
  );
};

export default OrderCompletedTemplate;
