"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import Modal from "@/ui/common/components/Modal";
import UploadImageForm from "../fileupload";
import { useInitiatePaymentSession, useListCartPaymentMethod, useRetrieveCart } from "@/lib/data/cart";
import PaymentButton from "./paymentbutton";
import { isManual, paymentInfoMap } from "@/lib/constants";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const PaymentOptions = () => {
  const [openBankTransfer, setOpenBankTransfer] = useState(false)
  const [clickedPaymentOption, setClickedPaymentOption] = useState<string | null>(null)

  const { data: cart } = useRetrieveCart()

  const activeSession = cart?.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const { mutate: initiatePaymentSession, isPending } = useInitiatePaymentSession()

  const { data: cartPaymentMethods } = useListCartPaymentMethod(cart?.region_id ?? '')

  const searchParams = useSearchParams();

  const isEditing = searchParams.get("step") === "payment";

  if(!cart) return null


  return (
    <div className=" mb-5 border-gray-200 border-b-2 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="subtitle mb-4">Payment</h3>
        </div>
      </div>
      {isEditing && (
        <Formik
          initialValues={{ paymentOption: activeSession?.provider_id ?? "" }}
          onSubmit={(value) => {

          }}
        >
          {({ values, setFieldValue }) => (
            <>
              <Modal isOpen={openBankTransfer} onClose={() => setOpenBankTransfer(false)}>
                <div className="w-full max-w-xl p-6 md:p-10 flex flex-col gap-4">
                  <div className="subtitle border-gray-200 border-b-2 pb-3">
                    Bank Transfer Details
                  </div>
                  <p className="text-lg md:text-xl text-gray-700">Bank Name: Bank of America</p>
                  <p className="text-lg md:text-xl text-gray-700">Account Number: 1234567890</p>
                  <p className="text-lg md:text-xl text-gray-700">Routing Number: 1234567890</p>

                  <UploadImageForm cart={cart} />
                </div>
              </Modal>
              <Form className="space-y-4">
                <div className="space-y-2">
                  {cartPaymentMethods?.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between border-2 rounded-lg p-4 cursor-pointer ${values.paymentOption === option.id
                        ? "border-rose-300 bg-rose-100"
                        : "border-gray-300"}`}
                    >
                      <div className="flex items-center gap-2">
                        <Field
                          type="radio"
                          name="paymentOption"
                          value={option.id}
                          className="hidden"
                          onClick={() => {
                            setClickedPaymentOption(option.id);
                            if (isManual(option.id) && (activeSession?.provider_id === option.id)) {
                              setOpenBankTransfer(true);
                            }
                          }}
                          onChange={() => {
                            if (cart) {
                              initiatePaymentSession(
                                {
                                  cart: cart,
                                  data: {
                                    provider_id: option.id,
                                    data: {
                                      email: cart.email
                                    }
                                  }
                                },
                                {
                                  onSuccess: () => {
                                    setFieldValue("paymentOption", option.id);
                                    if (isManual(option.id)) {
                                      setOpenBankTransfer(true);
                                    }
                                  },
                                  onError: (error) => {
                                    console.error("Payment session initialization failed:", error);
                                  }
                                }
                              );
                            }
                          }} />
                        <div
                          className={`w-5 h-5 flex items-center justify-center rounded-full border ${values.paymentOption === option.id
                            ? "border-rose-400"
                            : "border-gray-400"}`}
                        >
                          {values.paymentOption === option.id && (
                            <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
                          )}
                        </div>
                        <span className="uppercase">{paymentInfoMap[option?.id]?.title || option.id}</span>
                        {clickedPaymentOption === option.id && isPending && (
                          <AiOutlineLoading3Quarters className="animate-spin ml-2" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>


              </Form></>
          )}

        </Formik>
      )}
      <div className="mt-4">
        <PaymentButton cart={cart} />
      </div>

    </div>
  );
};

export default PaymentOptions;
