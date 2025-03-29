"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import AddressForm from "./address-form";
import { useEffect, useState } from "react";
import { useRetrieveCart } from "@/lib/data/cart";

const Addresses = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: cart, isLoading, isFetching, error } = useRetrieveCart()

  const currentStep = searchParams.get("step");
  const isEditing = searchParams.get("step") === "address";

  const requiredAddressFieldsMissing = (!cart?.shipping_address?.first_name ||
    !cart?.shipping_address?.last_name ||
    !cart?.shipping_address?.address_1 ||
    !cart?.shipping_address?.city ||
    !cart?.shipping_address?.postal_code ||
    !cart?.shipping_address?.country_code);

  const handleEdit = () => {
    router.push(`${pathname}?step=address`);
  };

  const handleDoneEditing = () => {
    router.push(`${pathname}?step=shippingoption`);
  };

  useEffect(() => {
    if (!currentStep && requiredAddressFieldsMissing) {
      router.push("?step=address");
    }
  }, [currentStep, router]);

  return (
    <div className="flex flex-col gap-5 mb-5 border-gray-200 border-b-2 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-3xl tracking-widest uppercase">
            Shipping Addresses
          </h3>
          {!isEditing && cart?.shipping_address && <FiCheckCircle />}
        </div>

        {!isEditing && cart?.shipping_address && (
          <button className="cursor-pointer" onClick={handleEdit}>
            Edit Address
          </button>
        )}
      </div>
      <AddressForm isEditing={isEditing} onSubmitComplete={handleDoneEditing} cart={cart} />
    </div>
  );
};

export default Addresses;
