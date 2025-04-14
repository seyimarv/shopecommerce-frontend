import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { sdk } from "../../../config";
import {
  getCartId,
  getAuthHeaders,
  setAuthToken,
  removeAuthToken,
  getCacheTag,
} from "./cookies";
// import { revalidateTag } from "next/cache";
import { HttpTypes } from "@medusajs/types";

type AddressInput = {
  currentState: Record<string, unknown>;
  formData: FormData;
};

export const useAddCustomerAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ currentState, formData }: AddressInput) => {
      const isDefaultBilling =
        (currentState.isDefaultBilling as boolean) || false;
      const isDefaultShipping =
        (currentState.isDefaultShipping as boolean) || false;

      const address = {
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
        company: formData.get("company") as string,
        address_1: formData.get("address_1") as string,
        address_2: formData.get("address_2") as string,
        city: formData.get("city") as string,
        postal_code: formData.get("postal_code") as string,
        province: formData.get("province") as string,
        country_code: formData.get("country_code") as string,
        phone: formData.get("phone") as string,
        is_default_billing: isDefaultBilling,
        is_default_shipping: isDefaultShipping,
      };

      const headers = {
        ...(await getAuthHeaders()),
      };

      const response = await sdk.store.customer.createAddress(
        address,
        {},
        headers
      );

      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },

    onError: (error) => {
      console.error("Failed to add customer address:", error);
    },
  });
};

export const useDeleteCustomerAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: string) => {
      const headers = {
        ...(await getAuthHeaders()),
      };

      await sdk.store.customer.deleteAddress(addressId, headers);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },

    onError: (error) => {
      console.error("Failed to delete customer address:", error);
    },
  });
};

export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    const authHeaders = getAuthHeaders();
    console.log(authHeaders);
    if (!authHeaders) return null;

    const headers = {
      ...authHeaders,
    };

    return await sdk.client
      .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
        method: "GET",
        query: {
          fields: "*orders",
        },
        headers,
      })
      .then(({ customer }) => customer)
      .catch(() => null);
  };

export const useRetrieveCustomer = () => {
  return useQuery({
    queryKey: ["customer"],
    queryFn: retrieveCustomer,
    staleTime: 1000 * 60 * 60 * 24 * 7,
    refetchInterval: 1000 * 60 * 60 * 24 * 7,
  });
};

export async function transferCart() {
  const cartId = getCartId();

  if (!cartId) {
    return;
  }

  const headers = getAuthHeaders() || {};
  await sdk.store.cart.transferCart(cartId, {}, headers);
}

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      firstName,
      lastName,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const token = await sdk.auth.register("customer", "emailpass", {
        email,
        password,
      });

      setAuthToken(token as string);

      const headers = getAuthHeaders() || {};
      const { customer: createdCustomer } = await sdk.store.customer.create(
        { email, first_name: firstName, last_name: lastName },
        {},
        headers
      );

      const loginToken = await sdk.auth.login("customer", "emailpass", {
        email,
        password,
      });

      setAuthToken(loginToken as string);

      await transferCart();

      return createdCustomer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const loginToken = await sdk.auth.login("customer", "emailpass", {
        email,
        password,
      });

      setAuthToken(loginToken as string);
      await transferCart();

      const headers = getAuthHeaders() || {};
      const { customer } = await sdk.store.customer.retrieve({}, headers);
      return customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      setAuthToken("");
      await sdk.auth.logout();
      removeAuthToken();
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      queryClient.removeQueries({ queryKey: ["customer"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      await sdk.auth.resetPassword("customer", "emailpass", {
        identifier: email,
      });
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
      password,
      token,
    }: {
      email: string;
      password: string;
      token: string;
    }) => {
      await sdk.auth.updateProvider(
        "customer",
        "emailpass",
        {
          email,
          password,
        },
        token
      );
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: HttpTypes.StoreUpdateCustomer) => {
      const headers = getAuthHeaders() || {};

      const updateRes = await sdk.store.customer
        .update(body, {}, headers)
        .then(({ customer }) => customer)
        .catch(console.error);
      return updateRes;
    },
    onSuccess: () => {
      // Optionally invalidate or refetch specific queries
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
};
