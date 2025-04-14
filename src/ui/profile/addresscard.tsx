import { useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { IoTrashOutline } from "react-icons/io5";
import { HttpTypes } from "@medusajs/types";
import {
  useDeleteCustomerAddress,
  useUpdateCustomerAddress,
} from "@/lib/data/customer";
import { useFormik } from "formik";
import Modal from "../common/components/Modal";
import { Input } from "../common/components/input";
import Button from "../common/components/button";
import CountrySelect from "../checkout/addresses/country-select";

type AddressProps = {
  address: HttpTypes.StoreCustomerAddress;
};

export const AddressCard = ({ address }: AddressProps) => {
  const { id, address_1, postal_code, city, country_code, phone, province } =
    address;

  const { mutate: deleteAddress } = useDeleteCustomerAddress();
  const { mutate: updateAddress } = useUpdateCustomerAddress();

  const [editModalOpen, setEditModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      address_1: address_1 || "",
      postal_code: postal_code || "",
      city: city || "",
      province: province || "",
      country_code: country_code || "",
      phone: phone || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      updateAddress(
        {
          addressId: id,
          formData,
        },
        {
          onSuccess: () => {
            setEditModalOpen(false);
          },
        }
      );
    },
  });

  const onDelete = () => {
    deleteAddress(id);
  };

  return (
    <>
      <div className="p-4 border rounded-xl shadow-sm">
        <p className="text-sm text-gray-600">{address_1}</p>
        <p className="text-sm text-gray-600">{`${postal_code}, ${city}`}</p>
        <p className="text-sm text-gray-600">{province}</p>
        <p className="text-sm text-gray-600 uppercase">{country_code}</p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center text-sm text-blue-600 hover:underline"
          >
            <HiOutlinePencilAlt size={14} className="mr-1" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center text-sm text-red-600 hover:underline"
          >
            <IoTrashOutline size={14} className="mr-1" /> Remove
          </button>
        </div>
      </div>

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        className="p-8"
      >
        <h3 className="mb-2 font-bold text-2xl">Edit Address</h3>

        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
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
                value={formik.values.address_1}
                onChange={formik.handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-[144px_1fr] gap-x-2">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="postal_code"
                  className="text-sm font-medium text-gray-700"
                >
                  Postal code
                </label>
                <Input
                  id="postal_code"
                  name="postal_code"
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
                  City
                </label>
                <Input
                  id="city"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="province"
                className="text-sm font-medium text-gray-700"
              >
                State
              </label>
              <Input
                id="province"
                name="province"
                value={formik.values.province}
                onChange={formik.handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="country_code"
                className="text-sm font-medium text-gray-700"
              >
                Country
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

            <div className="flex flex-col gap-1">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <Input
                id="phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
