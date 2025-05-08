import OrderItems from "./items";
import OrderDetails from "./order-details";
import { HttpTypes } from "@medusajs/types";

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder;
};
const OrderCompletedTemplate = ({ order }: OrderCompletedTemplateProps) => {
  return (
    <>
      <div className="flex flex-col gap-y-4 p-4 sm:p-10 w-full max-w-3xl mx-auto my-5">
        <h1 className="text-2xl md:text-3xl ">Thank you!</h1>
        <h1 className="text-xl md:text-3xl ">Your order was placed successfully.</h1>
        <OrderDetails order={order} />
        <h2 className="font-semibold tracking-wide text-lg md:text-2xl mt-4">Summary</h2>
        <OrderItems order={order} />
      </div>
    </>
  );
};

export default OrderCompletedTemplate;
