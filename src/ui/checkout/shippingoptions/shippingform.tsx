"use client";

import { useRetrieveCart, useSetShippingMethod } from "@/lib/data/cart";
import Button from "@/ui/common/components/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Option,
} from "@/ui/common/components/Select";
import { HttpTypes } from "@medusajs/types";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type ShippingFormProps = {
  name?: string;
  value?: string;
  onChange?: (option: Option) => void;
  className?: string;
  isShipping: boolean;
  onSubmitComplete: () => void;
  shippingOptions: HttpTypes.StoreCartShippingOption[];
  getShippingOptionPrice: (option: HttpTypes.StoreCartShippingOption) => string;
};

const ShippingForm = ({
  className,
  shippingOptions,
  getShippingOptionPrice,
  onSubmitComplete,
  isShipping
}: ShippingFormProps) => {
  const { data: cart } = useRetrieveCart();
  const [value, setValue] = useState<string | null>(cart?.shipping_methods?.at(-1)?.shipping_option_id || null);

  const { mutate: setShippingMethod, isPending } = useSetShippingMethod();

  const handleSelectShippingOption = (option: Option) => {
    if (!cart?.id || !option?.value) return;

    setShippingMethod({
      cartId: cart.id,
      shippingMethodId: option.value.toString()
    }, {
      onSuccess: () => {
        setValue(option.value.toString());
      }
    });
  };

  // Create the selected option object from the current value
  const selectedOption = value ? {
    value: value,
    label: shippingOptions.find(option => option.id === value)?.name || value
  } : undefined;

  return (
    <>
      <Select
        value={selectedOption}
        onChange={handleSelectShippingOption}
      >
        <SelectTrigger
          className={`!text-sm !border-gray-300 !w-full ${className || ''}`}
          placeholder="Select a shipping option"
        />
        <SelectContent className="bg-white shadow-md mt-1 !w-full max-h-[200px] overflow-y-auto">
          {shippingOptions.map((option) => (
            <SelectItem
              key={option.id}
              value={option.id}
              label={option.name}
            >
              <div className="flex items-center justify-between w-full">
                <span>{option.name} - {getShippingOptionPrice(option)}</span>
                {isPending && option.id === value && (
                  <AiOutlineLoading3Quarters className="animate-spin ml-2 text-gray-600" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {
        isShipping &&
        <Button onClick={onSubmitComplete} isLoading={isPending} disabled={!value} className="w-fit">
          Continue to payment
        </Button>
      }

    </>
  );
};

export default ShippingForm;
