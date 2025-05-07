import React, { useState } from "react";
import { Formik, Form } from "formik";
import Image from "next/image";
import Button from "@/ui/common/components/button";
import { CartWithInventory, usePlaceOrder } from "@/lib/data/cart";
import { useRouter } from "next/navigation";

interface FormValues {
  image: File | null;
}

interface UploadImageFormProps {
  cart: CartWithInventory;
}

const UploadImageForm: React.FC<UploadImageFormProps> = ({ cart }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const { mutate, isPending } = usePlaceOrder();

  const initialValues: FormValues = {
    image: null,
  };

  const handleSubmit = async (values: FormValues) => {
    mutate(
      {
        cartId: cart.id,
        receipt: values.image || undefined,
        cart: cart,
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
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, errors, touched }) => (
        <Form className="w-full max-w-md mx-auto space-y-6 py-4">
          <div>
            <label htmlFor="image-upload" className="block mb-2 text-sm font-medium text-gray-700">
              Upload proof of payment
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] as File;
                if (file) {
                  setFieldValue("image", file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
            />
            {errors.image && touched.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
          </div>

          {preview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="relative w-full max-h-60 overflow-hidden rounded-lg border border-gray-300">
                <Image
                  src={preview}
                  alt="Selected payment proof preview"
                  layout="responsive" 
                  width={160} 
                  height={160} 
                  objectFit="contain" 
                  className="rounded-lg" 
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-3 mt-6 text-base"
            isLoading={isPending}
            disabled={isPending}
          >
            I have made the payment
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default UploadImageForm;
