import React from "react";
import { Formik, Form, Field } from "formik";
import Select from "react-select";
import Button from "@/ui/common/components/button";

interface DeliveryFormProps {
  isShipping: boolean;
  onLocationSelect: (location: string, price: number) => void;
  onSubmitComplete: () => void;
}

const locations = [
  { value: "new_york", label: "New York - $10.00", price: 10 },
  { value: "los_angeles", label: "Los Angeles - $12.00", price: 12 },
  { value: "chicago", label: "Chicago - $8.00", price: 8 },
  { value: "houston", label: "Houston - $9.00", price: 9 },
  { value: "miami", label: "Miami - $11.00", price: 11 },
  { value: "lagos", label: "Lagos - $8.6", price: 8.6 },
  { value: "abuja", label: "Abuja - $9", price: 9 },
  { value: "santorini", label: "Santorini - $11", price: 11 },
];

const DeliveryForm: React.FC<DeliveryFormProps> = ({
  onLocationSelect,
  onSubmitComplete,
  isShipping,
}) => {
  return (
    <>
      {isShipping && (
        <Formik
          initialValues={{ location: null }}
          onSubmit={(values) => {
            const selectedLocation = locations.find(
              (location) => location.value === values.location
            );
            if (selectedLocation) {
              onLocationSelect(selectedLocation.label, selectedLocation.price);
            }
            onSubmitComplete();
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <Select
                options={locations}
                placeholder="Search for a location"
                onChange={(selectedOption: any) =>
                  setFieldValue("location", selectedOption?.value)
                }
                className="w-full"
              />

              <Button type="submit" disabled={!values.location}>
                Continue to Payment
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default DeliveryForm;
