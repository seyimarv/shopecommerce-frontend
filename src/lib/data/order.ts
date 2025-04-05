import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../../config";
import { HttpTypes } from "@medusajs/types";

const retrieveOrder = async (id: string) => {
  try {
    const response = await sdk.client.fetch<HttpTypes.StoreOrderResponse>(
      `/store/orders/${id}`,
      {
        method: "GET",
        query: {
          fields:
            "*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product",
        },
      }
    );

    return response.order;
  } catch (err) {
    // Handle error here, could be logging or rethrowing the error
    console.log(err);
  }
};

const useRetrieveOrder = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => retrieveOrder(id),
    enabled: !!id,
  });
};

export default useRetrieveOrder;
