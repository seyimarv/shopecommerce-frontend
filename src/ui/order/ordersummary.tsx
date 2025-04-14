import { HttpTypes } from "@medusajs/types";
import ShippingDetails from "./shippingdetails";
import PaymentDetails from "./paymentdetails";
import HelpSection from "./help";
import OrderCartSummary from "./order-cartsummary";

type OrderProps = {
  order: HttpTypes.StoreOrder;
};

const OrderSummary = ({ order }: OrderProps) => {
  return (
    <div>
      <OrderCartSummary order={order} />
      <ShippingDetails order={order} />
      <PaymentDetails order={order} />
      <HelpSection />
    </div>
  );
};

export default OrderSummary;
