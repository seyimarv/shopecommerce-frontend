"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import AddressForm from "./address-form";
import Link from "next/link";
import { useState } from "react";

const Addresses = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isEditing = searchParams.get("step") === "address";

  const handleEdit = () => {
    router.push(`${pathname}?step=address`);
  };

  const handleDoneEditing = () => {
    router.push(pathname);
  };

  return (
    <div className="flex flex-col gap-5 mb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-3xl tracking-widest uppercase">
            Shipping Addresses
          </h3>
          {!isEditing && <FiCheckCircle />}
        </div>

        {!isEditing && (
          <button className="cursor-pointer" onClick={handleEdit}>
            Edit Address
          </button>
        )}
      </div>

      <AddressForm isEditing={isEditing} onSubmitComplete={handleDoneEditing} />
    </div>
  );
};

export default Addresses;
