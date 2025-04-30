import { paymentInfoMap, isPaystack, isManual } from "@/lib/constants";
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
        <h2 className="text-xl md:text-2xl font-semibold tracking-wide my-3 ">Payment</h2>
        {payment && (
          <div className="flex flex-col md:flex-row items-start gap-y-6 md:gap-x-8">
            <div className="flex flex-col gap-y-1 w-full md:w-1/3">
        
              <h3 className="font-medium text-lg md:text-xl">Payment Method</h3>
              <h3 className="uppercase text-sm md:text-base">
                {paymentInfoMap[payment.provider_id]?.title || payment.provider_id}
              </h3>
            </div>
            <div className="flex flex-col gap-y-1 w-full md:w-2/3">
              <h3 className="font-medium text-lg md:text-xl">Payment Details</h3>
              <div className="flex gap-2 txt-medium items-center text-sm md:text-base">
                {isPaystack(payment.provider_id) && (
                  <>
                    <div className="flex items-center h-7 w-fit">
                      {paymentInfoMap[payment.provider_id].icon}
                    </div>
                    <h3>
                      {payment.data?.card_last4
                        ? `**** **** **** ${payment.data.card_last4}`
                        : `${convertToLocale({
                            amount: payment.amount,
                            currency_code: order.currency_code,
                          })} paid at ${new Date(
                            payment.created_at ?? ""
                          ).toLocaleString()}`}
                    </h3>
                  </>
                )}
                <h3 className="break-all">
                  {isManual(payment.provider_id) &&
                    `${convertToLocale({
                      amount: payment.amount,
                      currency_code: order.currency_code,
                    })} paid at ${new Date(
                      payment.created_at ?? ""
                    ).toLocaleString()} `}
                </h3>
              </div>
            </div>
          </div>
        )}

        <Divider className="mt-8" />
      </div>
    </div>
  );
};

export default PaymentDetails;
