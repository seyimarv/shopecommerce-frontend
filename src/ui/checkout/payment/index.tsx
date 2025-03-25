"use client";

import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { PaystackButton } from "react-paystack";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import Button from "@/ui/common/components/button";
import Modal from "@/ui/common/components/Modal";
import UploadImageForm from "../fileupload";
import { retrieveCart } from "@/lib/data/cart";

const PaymentOptions = () => {
  const [preferredOptions, setPreferredOptions] = useState<PaymentProps | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isEditing = searchParams.get("step") === "payment";

  const handleEdit = () => {
    router.push(`${pathname}?step=payment`);
  };

  interface PaymentProps {
    paymentOption: string;
  }

  const paymentOptions = [
    { id: "paystack", name: "Paystack" },
    { id: "banktransfer", name: "Bank Transfer" },
  ];

  const verifyPayment = async (reference: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/verify-payment/${reference}`, {
        method: "POST",
        body: JSON.stringify({ reference }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.success) {
        console.log("Payment verified:", data);
      } else {
        console.error("Payment verification failed:", data);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const orderData = {
    email: "mol@gmail.com",
        items: {
          "ball"
        },
        shipping_address: "njhwdbfnkiwb bw",
        total: 200,
  };

  // const { cart } = retrieveCart();
  // console.log(cart);
  return (
    <div className=" mb-5 border-gray-200 border-b-2 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-3xl tracking-widest uppercase mb-4">Payment</h3>
          {!isEditing && <FiCheckCircle />}
        </div>

        {!isEditing && (
          <button className="cursor-pointer" onClick={handleEdit}>
            Edit
          </button>
        )}
      </div>
      {isEditing && (
        <Formik
          initialValues={{ paymentOption: "" }}
          onSubmit={(value) => {
            setPreferredOptions(value);
            console.log(preferredOptions);
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                {paymentOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between border-2 rounded-lg p-4 cursor-pointer ${
                      values.paymentOption === option.id
                        ? "border-rose-300 bg-rose-100"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Field
                        type="radio"
                        name="paymentOption"
                        value={option.id}
                        className="hidden"
                        onChange={() =>
                          setFieldValue("paymentOption", option.id)
                        }
                      />
                      <div
                        className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                          values.paymentOption === option.id
                            ? "border-rose-400"
                            : "border-gray-400"
                        }`}
                      >
                        {values.paymentOption === option.id && (
                          <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
                        )}
                      </div>
                      <span className="uppercase">{option.name}</span>
                    </div>
                  </label>
                ))}
              </div>

              <Button type="submit" disabled={!values.paymentOption}>
                Place Order
              </Button>
            </Form>
          )}
        </Formik>
      )}
      {preferredOptions?.paymentOption === "banktransfer" && (
        <Modal isOpen={true} onClose={() => setPreferredOptions(null)}>
          <div className="w-xl p-10 flex flex-col gap-4">
            <div className="text-3xl border-gray-200 border-b-2 pb-3">
              Bank Transfer Details
            </div>
            <p className="text-xl text-gray-700">Bank Name: Bank of America</p>
            <p className="text-xl text-gray-700">Account Number: 1234567890</p>
            <p className="text-xl text-gray-700">Routing Number: 1234567890</p>

            <UploadImageForm />

            <Button type="submit" className="max-w-md mx-auto my-5">
              I have made the payment
            </Button>
          </div>
        </Modal>
      )}
      {preferredOptions?.paymentOption === "paystack" && (
        <Button>
          <PaystackButton
            publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ""}
            email="customer@example.com"
            amount={10000}
            reference={`txn_${Date.now()}`}
            onClose={() => console.log("Payment closed")}
            onSuccess={(response) => {
              console.log("Payment successful:", response);
              const reference = response.reference;
              verifyPayment(reference);
              router.push("/order-confirmation");
            }}
          >
            PAY WITH PAYSTACK
          </PaystackButton>
        </Button>
      )}
    </div>
  );
};

export default PaymentOptions;
