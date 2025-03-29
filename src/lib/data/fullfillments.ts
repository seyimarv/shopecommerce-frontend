import { useQuery, useQueries } from "@tanstack/react-query"
import { sdk } from "../../../config"
import { HttpTypes } from "@medusajs/types"

export const useShippingOptions = (cartId: string | undefined) => {
  return useQuery<{
    shipping_options: HttpTypes.StoreCartShippingOption[]
  }>({
    queryKey: ["shipping-options", cartId],
    queryFn: () => sdk.store.fulfillment.listCartOptions({
      cart_id: cartId || ""
    }),
    enabled: !!cartId
  })
}

type CalculatedPriceResponse = {
  shipping_option: HttpTypes.StoreCartShippingOption
}

export const useCalculatedPrices = (
  cartId: string | undefined, 
  shippingOptions: HttpTypes.StoreCartShippingOption[] = []
) => {
  const calculatedOptions = shippingOptions.filter(
    option => option.price_type === "calculated"
  )
  
  return useQueries({
    queries: calculatedOptions.map(option => ({
      queryKey: ["shipping-option-price", option.id, cartId],
      queryFn: () => sdk.client.fetch<CalculatedPriceResponse>(
        `/store/shipping-options/${option.id}/calculate`,
        {
          method: "POST",
          body: {
            cart_id: cartId || "",
            data: {}
          }
        }
      ),
      enabled: !!cartId && !!option.id
    })),
    combine: (results) => {
      const pricesMap: Record<string, number> = {}
      
      results.forEach(result => {
        if (result.data) {
          pricesMap[result.data.shipping_option.id] = 
            result.data.shipping_option.amount
        }
      })
      
      return {
        calculatedPrices: pricesMap,
        isLoading: results.some(result => result.isLoading),
        isError: results.some(result => result.isError)
      }
    }
  })
}