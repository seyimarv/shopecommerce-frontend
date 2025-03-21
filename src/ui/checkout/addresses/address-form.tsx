import React from "react";
import { Formik, Form, useField } from "formik";
import { Select } from "@/ui/common/components/Select";
import { Input } from "@/ui/common/components/input";
import * as Yup from "yup";
import CountrySelect from "./country-select";
import Button from "@/ui/common/components/button";

const AddressForm = () => {
  return (
    <>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          phonenumber: "",
          address: "",
          city: "",
          state: "",
        }}
        validationSchema={Yup.object({
          firstName: Yup.string().required("Required"),
          lastName: Yup.string().required("Required"),
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          phonenumber: Yup.number().required("Required"),
          address: Yup.string().required("Required"),
          city: Yup.string().required("Required"),
          state: Yup.string().required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        <Form className="flex flex-row flex-wrap gap-y-4">
          <div className="w-1/2 pr-2">
            <Input name="firstName" type="text" placeholder="First Name" />
          </div>

          <div className="w-1/2 pl-2">
            <Input name="lastName" type="text" placeholder="Last Name" />
          </div>

          <div className="w-1/2 pr-2">
            <Input name="email" type="email" placeholder="Email" />
          </div>
          <div className="w-1/2 pl-2">
            <Input
              name="phonenumber"
              type="number"
              placeholder="Phone Number"
            />
          </div>
          <div className="w-1/2 pr-2">
            <Input name="address" type="type" placeholder="Address" />
          </div>
          <div className="w-1/2 pl-2">
            <Input name="city" type="type" placeholder="City" />
          </div>
          <div className="w-1/2 pr-2">
            <Input name="state" type="type" placeholder="State" />
          </div>
          <div className="w-1/2 pl-2">
            <CountrySelect />
          </div>

          <Button type="submit" className="">
            Continue to Delivery
          </Button>
        </Form>
      </Formik>
    </>
  );
};

export default AddressForm;
