import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Input } from "../common/components/input";
import Button from "../common/components/button";
import CountrySelect from "../checkout/addresses/country-select";
import Modal from "../common/components/Modal";
import { useFormik } from "formik";
import { useAddCustomerAddress } from "@/lib/data/customer";

const AddAddress = () => {
  const [openModal, setOpenModal] = useState(false);
  const addAddress = useAddCustomerAddress();

  const formik = useFormik({
    initialValues: {
      address_1: "",
      postal_code: "",
      city: "",
      province: "",
      country_code: "",
      phone: "",
    },
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        formData.append(key, value);
      }

      addAddress.mutate(
        { currentState: {}, formData },
        {
          onSuccess: () => {
            resetForm();
            setOpenModal(false);
          },
        }
      );
    },
  });

  return (
    <>
      <div
        onClick={() => setOpenModal(true)}
        className="flex gap-2 items-center justify-center border border-dashed rounded-xl p-4 cursor-pointer hover:border-gray-400"
      >
        <FaPlus />
        New address
      </div>

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        className="p-8"
      >
        <h3 className="mb-2 font-bold text-2xl">Add Address</h3>

        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            {/* Address */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="address_1"
                className="text-sm font-medium text-gray-700"
              >
                Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="address_1"
                name="address_1"
                required
                autoComplete="address-line1"
                value={formik.values.address_1}
                onChange={formik.handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            {/* Postal Code & City */}
            <div className="grid grid-cols-[144px_1fr] gap-x-2">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="postal_code"
                  className="text-sm font-medium text-gray-700"
                >
                  Postal code <span className="text-red-500">*</span>
                </label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  autoComplete="postal-code"
                  value={formik.values.postal_code}
                  onChange={formik.handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="city"
                  className="text-sm font-medium text-gray-700"
                >
                  City <span className="text-red-500">*</span>
                </label>
                <Input
                  id="city"
                  name="city"
                  required
                  autoComplete="locality"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            {/* Province */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="province"
                className="text-sm font-medium text-gray-700"
              >
                State <span className="text-red-500">*</span>
              </label>
              <Input
                id="province"
                name="province"
                autoComplete="address-level1"
                value={formik.values.province}
                onChange={formik.handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="country_code"
                className="text-sm font-medium text-gray-700"
              >
                Country <span className="text-red-500">*</span>
              </label>
              <CountrySelect
                name="country_code"
                value={formik.values.country_code}
                onChange={(option) =>
                  formik.setFieldValue("country_code", option?.value || "")
                }
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone <span className="text-red-500">*</span>
              </label>
              <Input
                id="phone"
                name="phone"
                autoComplete="phone"
                required
                value={formik.values.phone}
                onChange={formik.handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <Button
              type="reset"
              variant="secondary"
              onClick={() => {
                formik.resetForm();
                setOpenModal(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addAddress.isPending}>
              {addAddress.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddAddress;
