import { HttpTypes } from "@medusajs/types";
import CartSummary from "./cartsummary";
import ShippingDetails from "./shippingdetails";
import PaymentDetails from "./paymentdetails";
import HelpSection from "./help";

type OrderProps = {
  order: HttpTypes.StoreOrder;
};

const OrderSummary = ({ order }: OrderProps) => {
  return (
    <div>
      <CartSummary order={order} />
      <ShippingDetails order={order} />
      <PaymentDetails order={order} />
      <HelpSection />
    </div>
  );
};

export default OrderSummary;
