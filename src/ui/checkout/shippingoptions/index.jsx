"use client";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import ShippingForm from "./shippingform";

const ShippingOptions = () => {
  const [selectedDelivery, setSelectedDelivery] = useState({
    method: "",
    price: 0,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isShipping = searchParams.get("step") === "shippingoption";

  const handleEdit = () => {
    router.push(`${pathname}?step=shippingoption`);
  };

  const handleDoneEditing = () => {
    router.push(`${pathname}?step=payment`);
  };

  return (
    <div className="flex flex-col gap-5 mb-5 border-gray-200 border-b-2 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-3xl tracking-widest uppercase">Delivery</h3>
          {selectedDelivery && !isShipping ? <FiCheckCircle /> : ""}
        </div>

        {!isShipping && (
          <button className="cursor-pointer" onClick={handleEdit}>
            Edit
          </button>
        )}
      </div>

      <ShippingForm
        isShipping={isShipping}
        onSubmitComplete={handleDoneEditing}
        onLocationSelect={(method, price) =>
          setSelectedDelivery({ method, price })
        }
      />
      {selectedDelivery && (
        <div className="text-xl text-gray-600">{selectedDelivery.method}</div>
      )}
    </div>
  );
};

export default ShippingOptions;
