import { useMemo } from "react";
import {
  Formik,
  Form,
  ErrorMessage,
  FormikProps,
} from "formik";

import { Input } from "@/ui/common/components/input";
import * as Yup from "yup";
import CountrySelect from "./country-select";
import Button from "@/ui/common/components/button";
import { useRegion } from "@/lib/context/region-context";
import { CartWithInventory, useUpdateCart } from "@/lib/data/cart";
import { countries } from "@/lib/utils/countries";
import { useRetrieveCustomer } from "@/lib/data/customer";
import AddressSelect from "./address-select";
import Spinner from "@/ui/common/components/spinner";

interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
  company: string;
}

interface AddressFormProps {
  onSubmitComplete: () => void;
  cart: CartWithInventory | null | undefined;
  isEditing: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  onSubmitComplete,
  cart,
  isEditing
}) => {
  const { countryCode } = useRegion();
  const { mutate: updateCart, isPending } = useUpdateCart();
  const { data: customer } = useRetrieveCustomer();

  const initialValues: FormValues = {
    first_name: cart?.shipping_address?.first_name || "",
    last_name: cart?.shipping_address?.last_name || "",
    email: cart?.email || "",
    phone: cart?.shipping_address?.phone || "",
    address_1: cart?.shipping_address?.address_1 || "",
    address_2: cart?.shipping_address?.address_2 || "",
    city: cart?.shipping_address?.city || "",
    province: cart?.shipping_address?.province || "",
    postal_code: cart?.shipping_address?.postal_code || "",
    country_code: cart?.shipping_address?.country_code || countryCode || "",
    company: cart?.shipping_address?.company || "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^\+?\d+$/, "Must be a valid phone number")
      .required("Phone number is required"),
    address_1: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    province: Yup.string().required("State/Province is required"),
    postal_code: Yup.string().required("Postal code is required"),
    country_code: Yup.string().required("Country is required"),
  });

  const handleSubmit = (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    updateCart({
      email: values.email,
      shipping_address: {
        first_name: values.first_name,
        last_name: values.last_name,
        address_1: values.address_1,
        address_2: values.address_2,
        city: values.city,
        country_code: values.country_code,
        province: values.province,
        postal_code: values.postal_code,
        phone: values.phone,
        company: values.company,
      },
    },
      {
        onSuccess: () => {
          onSubmitComplete();
        },
        onSettled: () => {
          setSubmitting(false);
        }
      });
  };

  const countriesInRegion = useMemo(
    () => cart?.region?.countries?.map((c) => c?.iso_2?.toLowerCase()),
    [cart?.region]
  )

  const addressesInRegion = useMemo(
    () =>
      customer?.addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code.toLowerCase())
      ),
    [customer?.addresses, countriesInRegion]
  )

  const handleAddressSelect = (address: any, setFieldValue: (field: string, value: any) => void) => {
    if (!address) return;
    setFieldValue("first_name", address.first_name || "");
    setFieldValue("last_name", address.last_name || "");
    setFieldValue("company", address.company || "");
    setFieldValue("address_1", address.address_1 || "");
    setFieldValue("address_2", address.address_2 || "");
    setFieldValue("city", address.city || "");
    setFieldValue("province", address.province || "");
    setFieldValue("postal_code", address.postal_code || "");
    setFieldValue("country_code", address.country_code.toLowerCase() || "");
    setFieldValue("phone", address.phone || "");
  };


  return (
    <>
      {isEditing ? (
        <Formik
          initialValues={initialValues}
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
            touched,
          }: FormikProps<FormValues>) => (
            <>
              {customer && (addressesInRegion?.length || 0) > 0 && (
                <div className="mb-4 flex flex-col gap-y-4">
                  <p className="text-small-regular">
                    {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
                  </p>
                  <AddressSelect
                    addresses={customer?.addresses}
                    onSelect={(address) => handleAddressSelect(address, setFieldValue)}
                  />
                </div>
              )}
              <Form className="flex flex-row flex-wrap gap-y-4">
                {/* First Name */}
                <div className="w-full md:w-1/2 md:pr-2">
                  <Input
                    name="first_name"
                    type="text"
                    placeholder="First Name"
                    value={values.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errorMessage={touched.first_name && errors.first_name ? errors.first_name : undefined}
                  />
                </div>

                {/* Last Name */}
                <div className="w-full md:w-1/2 md:pl-2">
                  <Input
                    name="last_name"
                    type="text"
                    placeholder="Last Name"
                    value={values.last_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errorMessage={touched.last_name && errors.last_name ? errors.last_name : undefined}
                  />
                </div>

                {/* Email */}
                <div className="w-full md:w-1/2 md:pr-2">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errorMessage={touched.email && errors.email ? errors.email : undefined}
                  />
                </div>

                {/* Phone */}
                <div className="w-full md:w-1/2 md:pl-2">
                  <Input
                    name="phone"
                    type="text"
                    placeholder="Phone Number"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errorMessage={touched.phone && errors.phone ? errors.phone : undefined}
                  />
                </div>

                {/* Address 1 */}
                <div className="w-full md:w-1/2 md:pr-2">
                  <Input
                    name="address_1"
                    type="text"
                    placeholder="Address"
                    value={values.address_1}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errorMessage={touched.address_1 && errors.address_1 ? errors.address_1 : undefined}
                  />
                </div>

                {/* Postal Code */}
                <div className="w-full md:w-1/2 md:pl-2">
                  <Input
                    name="postal_code"
                    type="text"
                    placeholder="Postal Code"
                    value={values.postal_code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errorMessage={touched.postal_code && errors.postal_code ? errors.postal_code : undefined}
                  />
                </div>

                {/* City */}
                <div className="w-full md:w-1/2 md:pr-2">
                  <Input
                    name="city"
                    type="text"
                    placeholder="City"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errorMessage={touched.city && errors.city ? errors.city : undefined}
                  />
                </div>

                {/* Province */}
                <div className="w-full md:w-1/2 md:pl-2">
                  <Input
                    name="province"
                    type="text"
                    placeholder="State/Province"
                    value={values.province}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errorMessage={touched.province && errors.province ? errors.province : undefined}
                  />
                </div>

                {/* Country Select */}
                <div className="w-full md:w-1/2 md:pr-2">
                  <CountrySelect
                    name="country_code"
                    value={values.country_code}
                    onChange={(option: { value: string | number }) =>
                      setFieldValue("country_code", String(option.value))
                    }
                  />
                  <ErrorMessage
                    name="country_code"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="w-full mt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || isPending}
                    isLoading={isSubmitting || isPending}
                  >
                    {isSubmitting || isPending ? "Saving..." : "Continue to Delivery"}
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Formik>

      ) : (
        <div>
          {(!cart || !cart.shipping_address) ? (
            <div className="w-full h-full py-12">
              <Spinner size={30} />
            </div>
          ) : (
            <div className="flex flex-wrap gap-6 md:gap-8 text-gray-600 tracking-wide">
              <div>
                <h3 className="text-lg sm:text-xl text-black ">Shipping Details</h3>
                <p>
                  {cart.shipping_address?.first_name || ""} {cart.shipping_address?.last_name || ""}
                </p>
                <p>{cart.shipping_address?.address_1}</p>
                {cart.shipping_address?.address_2 && <p>{cart.shipping_address.address_2}</p>}
                <p>
                  {cart.shipping_address?.city}, {cart.shipping_address?.province} {cart.shipping_address?.postal_code}
                </p>
                <p>{countries.find(country => country.value.toUpperCase() === (cart.shipping_address?.country_code?.toUpperCase() || ""))?.label || cart.shipping_address?.country_code}</p>
                {cart.shipping_address?.company && <p>{cart.shipping_address.company}</p>}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl text-black ">Contact Details</h3>
                <p>{cart.shipping_address?.phone}</p>
                <p>{cart.email}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AddressForm;