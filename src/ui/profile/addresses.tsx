import { useRetrieveCustomer } from "@/lib/data/customer";
import { AddressCard } from "./addresscard";

import AddAddress from "./addaddress";

const AddressComponent = () => {
  const { data: customer, isLoading, error } = useRetrieveCustomer();

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <AddAddress />{" "}
      {customer?.addresses?.map((address) => (
        <AddressCard key={address.id} address={address} />
      ))}
    </div>
  );
};

export default AddressComponent;
