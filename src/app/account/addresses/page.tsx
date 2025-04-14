"use client";

import {
  useAddCustomerAddress,
  useDeleteCustomerAddress,
} from "@/lib/data/customer";
const AddressPage = () => {
  const { mutate: addAddress, isLoading: adding } = useAddCustomerAddress();
  const { mutate: deleteAddress, isLoading: deleting } =
    useDeleteCustomerAddress();
  return (
    <div>
      <h3 className="text-3xl font-bold">Shipping Addresses</h3>
      <p className="text-lg my-3">
        View and update your shipping addresses, you can add as many as you
        like. Saving your addresses will make them available during checkout.
      </p>
    </div>
  );
};

export default AddressPage;
