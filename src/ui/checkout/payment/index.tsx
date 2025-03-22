"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import Button from "@/ui/common/components/button";

const PaymentOptions = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isEditing = searchParams.get("step") === "payment";

  const handleEdit = () => {
    router.push(`${pathname}?step=payment`);
  };

  interface PaymentProps {}

  const paymentOptions = [
    { id: "paypal", name: "Paypal" },
    { id: "stripe", name: "Stripe" },
    { id: "banktransfer", name: "Bank Transfer" },
  ];

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
        <Formik initialValues={{ paymentOption: "" }} onSubmit={(values) => {}}>
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
    </div>
  );
};

export default PaymentOptions;
