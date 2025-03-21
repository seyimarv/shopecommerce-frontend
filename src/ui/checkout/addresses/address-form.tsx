import React, { useEffect, useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikProps,
  useField,
} from "formik";
import { Select } from "@/ui/common/components/Select";
import { Input } from "@/ui/common/components/input";
import * as Yup from "yup";
import CountrySelect from "./country-select";
import Button from "@/ui/common/components/button";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phonenumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

interface AddressFormProps {
  isEditing: boolean;
  onSubmitComplete: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  isEditing,
  onSubmitComplete,
}) => {
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phonenumber: "",
    address: "",
    city: "",
    state: "",
    country: "nigeria",
  };

  const currentValues = submittedData ? submittedData : initialValues;

  useEffect(() => {
    if (isEditing && submittedData) {
      setSubmittedData(submittedData);
    }
  }, [isEditing]);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phonenumber: Yup.string()
      .matches(/^\d+$/, "Only numbers are allowed")
      .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
  });

  const handleSubmit = (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setTimeout(() => {
      setSubmittedData(values);
      onSubmitComplete();
      setSubmitting(false);
    }, 400);
  };

  return (
    <>
      {submittedData && !isEditing ? (
        <div className="flex gap-8 text-gray-600 tracking-wide">
          <div>
            <h3 className="text-xl text-black ">Shipping Details</h3>
            <p>
              {submittedData?.firstName || ""} {submittedData?.lastName || ""}
            </p>
            <p>
              {submittedData?.city} {submittedData?.state}
            </p>
            <p>{submittedData?.country}</p>
          </div>
          <div>
            <h3 className="text-xl text-black ">Contact Details</h3>
            <p>{submittedData?.phonenumber}</p>
            <p>{submittedData?.email}</p>
          </div>
        </div>
      ) : (
        <Formik
          initialValues={currentValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            errors,
            isSubmitting,
          }: FormikProps<FormValues>) => (
            <Form className="flex flex-row flex-wrap gap-y-4">
              <div className="w-1/2 pr-2">
                <Input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={errors.firstName}
                />
              </div>

              <div className="w-1/2 pl-2">
                <Input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={errors.lastName}
                />
              </div>

              <div className="w-1/2 pr-2">
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={errors.email}
                />
              </div>

              <div className="w-1/2 pl-2">
                <Input
                  name="phonenumber"
                  type="text"
                  placeholder="Phone Number"
                  value={values.phonenumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={errors.phonenumber}
                />
              </div>

              <div className="w-1/2 pr-2">
                <Input
                  name="address"
                  type="text"
                  placeholder="Address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={errors.address}
                />
              </div>

              <div className="w-1/2 pl-2">
                <Input
                  name="city"
                  type="text"
                  placeholder="City"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={errors.city}
                />
              </div>

              <div className="w-1/2 pr-2">
                <Input
                  name="state"
                  type="text"
                  placeholder="State"
                  value={values.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={errors.state}
                />
              </div>

              <div className="w-1/2 pl-2">
                <CountrySelect
                  name="country"
                  value={values.country}
                  onChange={(option: { value: string | number }) =>
                    setFieldValue("country", String(option.value))
                  }
                />
                <ErrorMessage
                  name="country"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <div className="w-full mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting" : "Continue to Delivery"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}{" "}
    </>
  );
};

export default AddressForm;
