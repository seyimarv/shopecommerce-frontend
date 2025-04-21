import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { HttpTypes } from "@medusajs/types";
import Button from "@/ui/common/components/button";
import { usePlaceOrder } from "@/lib/data/cart";
import { useRouter } from "next/navigation";

interface FormValues {
  image: File | null;
}

interface UploadImageFormProps {
  cart: HttpTypes.StoreCart;
}

const UploadImageForm: React.FC<UploadImageFormProps> = ({ cart }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const { mutate, isPending } = usePlaceOrder();

  const initialValues: FormValues = {
    image: null,
  };

  const validationSchema = Yup.object({
    image: Yup.mixed().required("Image is required"),
  });

  const handleSubmit = (values: FormValues) => {
    mutate(
      {
        cartId: cart.id,
        receipt: values.image!,
      },
      {
        onSuccess: (data) => {
          router.push(`/order/${data?.orderId}/confirmed`);
        },
        onError: (err) => {
          console.error("Error uploading receipt:", err);
        },
      }
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, errors, touched, isSubmitting }) => (
        <Form className=" max-w-md">
          <div>
            <label className="block mb-1 font-medium">
              Upload proof of payment
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] as File;
                if (file) {
                  setFieldValue("image", file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="block w-full border border-gray-300 rounded px-2 py-1"
            />
            {errors.image && touched.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          {/* {isSubmitting && <p>Uploading...</p>} */}

          {preview && (
            <div className="mt-4">
              <p className="font-medium mb-2">Preview:</p>
              <Image
                src={preview}
                alt="Selected"
                width={160}
                height={160}
                className="object-cover rounded border"
              />
            </div>
          )}

          <Button
            type="submit"
            className="max-w-md mx-auto my-5"
            isLoading={isPending}
            disabled={!values.image}
          >
            I have made the payment
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default UploadImageForm;
