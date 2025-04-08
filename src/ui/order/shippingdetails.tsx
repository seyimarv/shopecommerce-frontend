import { convertToLocale } from "@/lib/utils/money";
import { HttpTypes } from "@medusajs/types";
import Divider from "../common/components/Divider";
type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder;
};

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-wide my-3">Delivery</h2>
      <div className="flex items-start gap-x-8">
        <div className="flex flex-col w-1/3">
          <h3 className="font-medium  text-xl">Shipping Address</h3>
          <h3>
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </h3>
          <h3>
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </h3>
          <h3>
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </h3>
          <h3>{order.shipping_address?.country_code?.toUpperCase()}</h3>
        </div>

        <div className="flex flex-col w-1/3">
          <h3 className="font-medium text-xl">Contact</h3>
          <h3>{order.shipping_address?.phone}</h3>
          <h3>{order.email}</h3>
        </div>

        <div className="flex flex-col w-1/3">
          <h3 className="font-medium text-xl">Method</h3>
          <h3>
            {(order as any).shipping_methods[0]?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0].total ?? 0,
              currency_code: order.currency_code,
            })
              .replace(/,/g, "")
              .replace(/\./g, ",")}
            )
          </h3>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  );
};

export default ShippingDetails;
