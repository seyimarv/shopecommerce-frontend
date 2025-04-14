"use client";

import AddressComponent from "@/ui/profile/addresses";

const AddressPage = () => {
  return (
    <div>
      <h3 className="text-3xl font-bold">Shipping Addresses</h3>
      <p className="text-lg my-3">
        View and update your shipping addresses, you can add as many as you
        like. Saving your addresses will make them available during checkout.
      </p>
      <AddressComponent />
    </div>
  );
};

export default AddressPage;
