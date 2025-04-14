import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../../config";
import { HttpTypes } from "@medusajs/types";
import { getAuthHeaders } from "./cookies";

interface UseOrdersOptions {
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
  enabled?: boolean; // Optional: Control if the query is initially enabled
}

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

export const useRetrieveOrder = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => retrieveOrder(id),
    enabled: !!id,
  });
};

export const fetchOrders = async (limit = 10, offset = 0, filters = {}) => {
  const headers = getAuthHeaders() || {};
  try {
    const { orders } = await sdk.client.fetch<HttpTypes.StoreOrderListResponse>(
      `/store/orders`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          order: "-created_at",
          fields: "*items,+items.metadata,*items.variant,*items.product",
          ...filters,
        },
        headers,
      }
    );
    return orders;
  } catch (err) {
    // Handle error here, could be logging or rethrowing the error
    console.log(err);
  }
};

export const useListOrders = ({
  limit = 10,
  offset = 0,
  filters,
  enabled = true,
}: UseOrdersOptions = {}) => {
  return useQuery({
    queryKey: ["orders", limit, offset, filters], // Unique key for this query
    queryFn: () => fetchOrders(limit, offset, filters),
    enabled,
  });
};
