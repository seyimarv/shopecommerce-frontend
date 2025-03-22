import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

interface FormValues {
  image: File | null;
}

const UploadImageForm: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const initialValues: FormValues = {
    image: null,
  };

  const validationSchema = Yup.object({
    image: Yup.mixed().required("Image is required"),
  });

  const handleSubmit = (values: FormValues) => {
    console.log("Selected file:", values.image);

    // const formData = new FormData();
    // if (values.image) {
    //   formData.append("image", values.image);
    // }

    // // Send the image to backend API
    // fetch("/api/upload", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((res) => {
    //     console.log("Upload complete");
    //   })
    //   .catch((err) => {
    //     console.error("Upload failed:", err);
    //   });
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
                const file = event.currentTarget.files?.[0];
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

          {isSubmitting && <p>Uploading...</p>}

          {preview && (
            <div className="mt-4">
              <p className="font-medium mb-2">Preview:</p>
              <img
                src={preview}
                alt="Selected"
                className="w-40 h-40 object-cover rounded border"
              />
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default UploadImageForm;
