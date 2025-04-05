import { paymentInfoMap, isPaystack } from "@/lib/constants";
import { convertToLocale } from "@/lib/utils/money";
import Divider from "../common/components/Divider";
import { HttpTypes } from "@medusajs/types";

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder;
};

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0];
  return (
    <div>
      <div>
        <h2 className="flex flex-row">Payment</h2>
        <div>
          {payment && (
            <div className="">
              <div className="">
                <h3 className="">Payment method</h3>
                <h3
                  className="txt-medium h3-ui-fg-subtle"
                  data-testid="payment-method"
                >
                  {paymentInfoMap[payment.provider_id].title}
                </h3>
              </div>
              <div className="flex flex-col w-2/3">
                <h3 className="txt-medium-plus h3-ui-fg-base mb-1">
                  Payment details
                </h3>
                <div className="flex gap-2 txt-medium h3-ui-fg-subtle items-center">
                  <div className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[payment.provider_id].icon}
                  </div>
                  <h3 data-testid="payment-amount">
                    {isPaystack(payment.provider_id) && payment.data?.card_last4
                      ? `**** **** **** ${payment.data.card_last4}`
                      : `${convertToLocale({
                          amount: payment.amount,
                          currency_code: order.currency_code,
                        })} paid at ${new Date(
                          payment.created_at ?? ""
                        ).toLocaleString()}`}
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>

        <Divider className="mt-8" />
      </div>
    </div>
  );
};

export default PaymentDetails;
