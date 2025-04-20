"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import ShippingForm from "./shippingform";
import { useShippingOptions, useCalculatedPrices } from "@/lib/data/fullfillments";
import { HttpTypes } from "@medusajs/types";
import { convertToLocale } from "@/lib/utils/money";
import { useRetrieveCart } from "@/lib/data/cart";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ShippingOptions = ({disabled}: {disabled: boolean}) => {
  if (disabled) {
    return (
      <div className="flex flex-col gap-5 mb-5 border-gray-200 border-b-2 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="subtitle">Delivery</h3>
          </div>
        </div>
      </div>
    );
  }

  const { data: cart, isLoading: isLoadingCart } = useRetrieveCart()

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

  // Fetch shipping options
  const {
    data: shippingOptionsData,
    isLoading: isLoadingOptions
  } = useShippingOptions(cart?.id)

  const shippingOptions = shippingOptionsData?.shipping_options || []

  // Fetch calculated prices
  const {
    calculatedPrices,
    isLoading: isLoadingPrices
  } = useCalculatedPrices(cart?.id, shippingOptions)

  const isLoading = isLoadingOptions || isLoadingPrices || isLoadingCart

  // Helper function to get price
  const getShippingOptionPrice = (option: HttpTypes.StoreCartShippingOption | { id: string; amount: number; price_type: "flat" }): string => {
    const price = option.price_type === "flat" ?
      option.amount : calculatedPrices[option.id]

    return convertToLocale({ amount: price || 0, currency_code: cart?.currency_code || "" })
  }


  return (
    <div className="flex flex-col gap-5 mb-5 border-gray-200 border-b-2 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="subtitle">Delivery</h3>
          {cart?.shipping_methods?.at(-1)?.shipping_option_id && !isShipping ? <FiCheckCircle /> : ""}
        </div>

        {!isShipping && (
          <button className="cursor-pointer" onClick={handleEdit}>
            Edit
          </button>
        )}
      </div>
      {
        isShipping ? (
          isLoading ? (
            <AiOutlineLoading3Quarters className="text-2xl animate-spin" />
          ) : shippingOptions.length > 0 ? (
            <ShippingForm
              isShipping={isShipping}
              onSubmitComplete={handleDoneEditing}
              shippingOptions={shippingOptions}
              getShippingOptionPrice={getShippingOptionPrice}
            />
          ) : (
            <div className="text-lg md:text-xl text-gray-600">No shipping options available</div>
          )
        ) : (
          <>
          {
            isLoading ? <AiOutlineLoading3Quarters className="text-2xl animate-spin" /> : (
              <div className="text-lg md:text-xl text-gray-600">
                {shippingOptions.find(option => option.id === cart?.shipping_methods?.at(-1)?.shipping_option_id)?.name || 
                  cart?.shipping_methods?.at(-1)?.shipping_option_id} ({getShippingOptionPrice(
                    shippingOptions.find(option => option.id === cart?.shipping_methods?.at(-1)?.shipping_option_id) || 
                    { id: '', amount: 0, price_type: 'flat' as const }
                  )})
              </div>  
            )}
          </>
        )
      }
    </div>
  );
};

export default ShippingOptions;
