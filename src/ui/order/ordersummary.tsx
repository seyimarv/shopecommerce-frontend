import { HttpTypes } from "@medusajs/types";
import CartSummary from "./cartsummary";
import ShippingDetails from "./shippingdetails";
import PaymentDetails from "./paymentdetails";

type OrderProps = {
  order: HttpTypes.StoreOrder;
};

const OrderSummary = ({ order }: OrderProps) => {
  return (
    <div>
      <CartSummary order={order} />
      <ShippingDetails order={order} />
      <PaymentDetails order={order} />
    </div>
  );
};

export default OrderSummary;
