import { HttpTypes } from "@medusajs/types";
import { getAuthHeaders, getCartId, removeCartId, setCartId } from "./cookies";
import { sdk } from "../../../config";
import { getRegion } from "./region";
import medusaError from "../utils/medusa-error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRegion } from "../context/region-context";
import { uploadReceipt } from "./payment";
import { queryKeys } from "../keys";
import toast from 'react-hot-toast';

type StoreCart = HttpTypes.StoreCartResponse["cart"];
type StoreCartLineItem = NonNullable<StoreCart["items"]>[0];
type Product = HttpTypes.StoreProductResponse["product"];

export type CartItemWithInventory = StoreCartLineItem & {
  inventory_quantity?: number;
  is_in_stock?: boolean;
  images?: Product["images"];
};

export type StoreCartWithInventory = Omit<HttpTypes.StoreCart, 'items'> & {
  items: CartItemWithInventory[];
};

export type CartWithInventory = Omit<StoreCart, "items"> & {
  id: string;
  region_id: string;
  items: CartItemWithInventory[];
  promo_codes?: { id: string; code: string }[];
};

/**
 * Retrieves a cart and enriches it with inventory information for each item
 * Uses bulk product fetching for better performance
 * @param id Optional cart ID. If not provided, retrieves from local storage
 * @returns Enriched cart object or null if not found/error occurs
 */
export async function retrieveCart(
  id?: string
): Promise<CartWithInventory | null> {
  try {
    // Get cart ID from parameter or local storage
    const cartId = id || getCartId();
    if (!cartId) return null;

    // 1. Fetch cart with all necessary fields
    const { cart } = await sdk.client.fetch<HttpTypes.StoreCartResponse>(
      `/store/carts/${cartId}`,
      {
        method: "GET",
        query: {
          fields: [
            "*items",
            "*region",
            "*items.product",
            "*items.variant",
            "*items.thumbnail",
            "*items.metadata",
            "items.total",
            "*promotions",
            "shipping_methods.name",
          ].join(", "),
        },
      }
    );

    // Handle empty cart cases
    if (!cart) return null;
    if (!cart.items?.length) return { ...cart, items: [] } as CartWithInventory;

    // 2. Extract unique product IDs to reduce API calls
    const productMap = new Map<
      string,
      { product: Product | null; fetched: boolean }
    >();

    // Initialize the map with product IDs from cart items
    cart.items.forEach((item) => {
      if (item.variant_id && item.variant?.product_id) {
        const productId = item.variant.product_id;
        if (!productMap.has(productId)) {
          productMap.set(productId, { product: null, fetched: false });
        }
      }
    });

    // 3. Fetch all products data in parallel
    await Promise.all(
      Array.from(productMap.keys()).map(async (productId) => {
        try {
          const response = await sdk.client.fetch<{ product: Product }>(
            `/store/products/${productId}`,
            {
              method: "GET",
              query: { fields: "+variants.inventory_quantity" },
            }
          );

          productMap.set(productId, {
            product: response.product,
            fetched: true,
          });
        } catch (err) {
          console.warn(`Failed to fetch product ${productId}:`, err);
          productMap.set(productId, { product: null, fetched: true });
        }
      })
    );

    // 4. Enrich each cart item with inventory information
    const enrichedItems = await Promise.all(
      cart.items.map(async (item) => {
        if (!item.variant_id || !item.variant?.product_id) return item;

        const productData = productMap.get(item.variant.product_id);
        if (!productData?.fetched || !productData.product) return item;

        const variant = productData.product.variants?.find(
          (v) => v.id === item.variant_id
        );
        if (!variant) return item;

        return {
          ...item,
          inventory_quantity: variant.inventory_quantity,
          images: productData.product.images,
        };
      })
    );

    // 5. Return the cart with enriched items
    return {
      ...cart,
      items: enrichedItems,
    } as CartWithInventory;
  } catch (error) {
    console.error("Failed to retrieve cart:", error);
    return null;
  }
}

export async function getOrSetCart(
  countryCode: string
): Promise<CartWithInventory | null> {
  const region = await getRegion(countryCode);

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`);
  }

  let cart = await retrieveCart();

  if (!cart) {
    const cartResp = await sdk.store.cart.create({ region_id: region.id }, {});
    cart = cartResp.cart as CartWithInventory;
    if (cart) {
      setCartId(cart.id);
    }
  }

  if (cart?.region_id !== region.id) {
    const updatedCart = await sdk.store.cart.update(
      cart.id,
      { region_id: region.id },
      {}
    );
    cart = updatedCart.cart as CartWithInventory;
  }

  return cart;
}

export async function updateCart(data: HttpTypes.StoreUpdateCart, countryCode?: string) {
  const cartId = getCartId();

  if (!cartId && countryCode) {
    await getOrSetCart(countryCode);
  }

  if (!cartId) {
    return
  }

  return sdk.store.cart
    .update(cartId, data, {})
    .then(async ({ cart }) => {
      return cart;
    })
    .catch(async (medusaError) => {
      if (medusaError.message.includes("price")) {
        if (countryCode) {
          const region = await getRegion(countryCode);
          if (!region) {
            throw new Error(`Region not found for country code: ${countryCode}`);
          }
          const cartResp = await sdk.store.cart.create({ region_id: region.id }, {});
          const cart = cartResp.cart as CartWithInventory;
          if (cart) {
            setCartId(cart.id);
            return cart;
          } else {
            throw medusaError
          }
        }
      } else {
        throw medusaError;
      }
    });
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string;
  quantity: number;
  countryCode: string;
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart");
  }

  const cart = await getOrSetCart(countryCode);

  if (!cart) {
    throw new Error("Error retrieving or creating cart");
  }

  await sdk.store.cart
    .createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity,
      },
      {}
    )
    .then(async () => { })
    .catch(medusaError);
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item");
  }

  const cartId = getCartId();

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item");
  }

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {})
    .then(async () => {  })
    .catch(medusaError);
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item");
  }

  const cartId = getCartId();

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item");
  }

  await sdk.store.cart
    .deleteLineItem(cartId, lineId)
    .then(async () => { })
    .catch(medusaError);
}

export const useListCartPaymentMethod = (regionId: string) => {
  return useQuery({
    queryKey: ["payment-providers", regionId],
    queryFn: () =>
      sdk.client
        .fetch<HttpTypes.StorePaymentProviderListResponse>(
          `/store/payment-providers`,
          {
            method: "GET",
            query: { region_id: regionId },
          }
        )
        .then(({ payment_providers }) =>
          payment_providers.sort((a, b) => {
            return a.id > b.id ? 1 : -1;
          })
        )
        .catch(() => {
          return null;
        }),
    enabled: !!regionId,
  });
};

const applyPromotionsToCart = async (codes: string[], prevPromotions: any[]) => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No existing cart found to apply promotions to.");
  }

  const headers = getAuthHeaders() || {};

  try {
    const response = await sdk.store.cart.update(
      cartId,
      { promo_codes: codes },
      {},
      headers
    );

    if (codes.length > 0 && (!response.cart.promotions || response.cart.promotions.length === 0)) {
      throw new Error(`Unable to apply promo code '${codes.join(', ')}'. It may be invalid or expired.`);
    }
    const currentPromotionIds = (response.cart.promotions || []).map(p => p.id).sort();
    const previousPromotionIds = (prevPromotions || []).map(p => p.id).sort();
    const promotionsAreEqual =
      currentPromotionIds.length === previousPromotionIds.length &&
      currentPromotionIds.every((id, index) => id === previousPromotionIds[index]);

    if (promotionsAreEqual && codes.length > 0) {
      const attemptedCode = codes.find(c => !previousPromotionIds.includes(c));
      if (attemptedCode || codes.length > previousPromotionIds.length) {
        throw new Error(`Unable to apply promo code '${codes.join(', ')}'. It may be invalid, expired, or already applied.`);
      }
    }
    return response.cart;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to apply Promo code.');
  }
};

export const useApplyPromotions = ({ prevPromtions = [] }: { prevPromtions: any[] }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (codes: string[]) => applyPromotionsToCart(codes, prevPromtions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
  return mutation
};

interface MedusaError {
  status?: number;
  message: string;
  type?: string;
}

function isMedusaError(error: unknown): error is MedusaError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as MedusaError).message === 'string' &&
    (!('status' in error) || typeof (error as MedusaError).status === 'number' || typeof (error as MedusaError).status === 'undefined') &&
    (!('type' in error) || typeof (error as MedusaError).type === 'string' || typeof (error as MedusaError).type === 'undefined')
  );
}

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { countryCode } = useRegion();

  return useMutation({
    mutationFn: (params: {
      variantId: string;
      quantity: number;
    }) =>
      addToCart({
        ...params,
        countryCode,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "An unexpected error occurred adding the item. Please try again.";
      console.error("Error adding item to cart:", error);

      if (isMedusaError(error)) {
        const status = error.status;

        switch (status) {
          case 400:
            errorMessage = "Invalid request. Please check product options or quantity.";
            console.error(`[useAddToCart] Invalid request (400): ${error.message}`);
            break;
          case 404:
            if (error.message?.toLowerCase().includes("variant")) {
              errorMessage = "The selected product option is not available.";
              console.error(`[useAddToCart] Product variant not found (404): ${error.message}`);
            } else {
              errorMessage = "Requested item not found.";
              console.error(`[useAddToCart] Not found (404): ${error.message}`);
            }
            break;
          case 409:
            errorMessage = "There was a conflict processing your request. Please try again.";
            console.error(`[useAddToCart] Conflict (409): ${error.message}`);
            break;
          default:
            if (error.type === "not_allowed") {
              errorMessage = "Sorry, there's not enough stock available for this item.";
              console.error(`[useAddToCart] Inventory not available (not_allowed): ${error.message}`);
            } else {
              errorMessage = `An error occurred Please try again.`;
              console.error(`[useAddToCart] Medusa Error (Status: ${status ?? 'N/A'}, Type: ${error.type ?? 'N/A'}): ${error.message}`);
            }
            break;
        }
      } else if (error instanceof Error) {
        errorMessage = "An error occured. Please check connection and try again.";
        console.error("[useAddToCart] Client/Network error:", error.message);
      } else {
        errorMessage = "An unknown error occurred.";
        console.error("[useAddToCart] Unknown error type:", String(error));
      }

      toast.error(errorMessage);
    },
  });
};

export const useUpdateLineItem = () => {
  const queryClient = useQueryClient();
  const id = getCartId()

  return useMutation({
    mutationFn: ({ lineId, quantity }: { lineId: string; quantity: number }) =>
      updateLineItem({ lineId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", id] });
    },
  });
};

export const useDeleteLineItem = () => {
  const queryClient = useQueryClient();
  const id = getCartId()

  return useMutation({
    mutationFn: (lineId: string) => deleteLineItem(lineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", id] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", id] });
    },
  });
};

export const useRetrieveCart = (id?: string) => {
  const cartId = id || getCartId();
  return useQuery({
    queryKey: ["cart", cartId], 
    queryFn: () => retrieveCart(cartId),
    // enabled: !!cartId, 
  });
};

export const useGetOrSetCart = (countryCode: string) => {
  return useQuery({
    queryKey: ["cart", "byCountry", countryCode], 
    queryFn: () => getOrSetCart(countryCode),
  });
};

export const useUpdateCart = (countryCode?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HttpTypes.StoreUpdateCart) => updateCart(data, countryCode),
    onSuccess: (data) => {
      const cartId = data?.id; 
      if (cartId) {
        queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["cart", getCartId()] });
      }
    },
    onError: () => {
      const cartId = getCartId(); 
      if (cartId) {
        queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["cart", cartId] }); 
      }
    },
  });
};

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string;
  shippingMethodId: string;
}) {
  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {})
    .then(async (response) => {
      return response.cart;
    })
    .catch(medusaError);
}

export const useSetShippingMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, shippingMethodId }: { cartId: string; shippingMethodId: string }) =>
      setShippingMethod({ cartId, shippingMethodId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
) {
  return sdk.store.payment
    .initiatePaymentSession(cart, data, {})
    .then(async (resp) => {
      return resp;
    })
    .catch(medusaError);
}

export const useInitiatePaymentSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cart,
      data,
    }: {
      cart: HttpTypes.StoreCart;
      data: HttpTypes.StoreInitializePaymentSession;
    }) => initiatePaymentSession(cart, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cartId, receipt, cart }: { cartId?: string; receipt?: File; cart?: StoreCartWithInventory }) => {
      const id = cartId || getCartId();
      if (!id) {
        throw new Error("No existing cart found when placing an order");
      }
      if (cart && cart.items) {
        for (const item of cart.items) {
          const managesInventory = item.variant?.manage_inventory === true;
          const allowsBackorder = item.variant?.allow_backorder === true;
          const inventoryQuantity = typeof item.inventory_quantity === 'number' ? item.inventory_quantity : Infinity;

          if (managesInventory && !allowsBackorder && (item.quantity > inventoryQuantity || inventoryQuantity === 0)) {
            const variantTitle = item.variant?.title ? ` (${item.variant.title})` : '';
            throw new Error(`Cannot place order: Item '${item.product?.title}${variantTitle}' exceeds available stock. Please review your cart.`);
          }
        }
      }
      if (receipt) {
        await uploadReceipt(receipt, id);
      }

      try {
        const cartRes = await sdk.store.cart.complete(id, {});

        if (cartRes?.type === "order") {
          const countryCode =
            cartRes.order.shipping_address?.country_code?.toLowerCase();
          removeCartId();
          queryClient.invalidateQueries({ queryKey: ["cart", "order"] });
          return { orderId: cartRes.order.id, countryCode };
        } else {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          return { cart: cartRes?.cart };
        }

      } catch (error) {
        console.error("Error during cart completion attempt:", error);
        let shouldRecover = false;
        let initialErrorMessage = "Failed to place order. Please try again.";
        if (isMedusaError(error)) {
          initialErrorMessage = error.message || `An unexpected error occurred (${error.status}).`;
          if (error.message?.includes("Order address with id")) {
            shouldRecover = true;
          } else {
            switch (error.status) {
              case 400:
              case 409:
                if (error.type === 'insufficient_stock' || error.message?.toLowerCase().includes('stock')) {
                  initialErrorMessage = "One or more items in your cart are out of stock. Please review your cart.";
                } else {
                  initialErrorMessage = error.message || "There was a conflict processing your order. Please try again.";
                }
                break;
            }
          }
        } else if (error instanceof Error) {
          initialErrorMessage = error.message || "An unexpected error occurred. Please try again later.";
          if (error.message.toLowerCase().includes('network')) {
            initialErrorMessage = "Network error. Please check your connection and try again.";
          }
          if (error.message?.includes("Order address with id")) {
            shouldRecover = true;
          }
        } else {
          initialErrorMessage = "An unknown error occurred.";
          console.error("[usePlaceOrder] Unknown error type:", String(error));
        }
        if (shouldRecover) {
          console.log("Attempting cart recovery due to specific error...");
          try {
            await recoverFromCheckoutError(id);
            console.log("Cart recovery successful (original order failed).");
            queryClient.invalidateQueries({ queryKey: ["cart", "order"] });
            throw new Error("Order failed, but your cart session was reset. Please review and try again.");
          } catch (recoveryError: any) {
            console.error("Cart recovery failed:", recoveryError);
            let recoveryToastMessage = "Could not recover your cart session after the initial error.";
            if (recoveryError?.message?.includes("Some variant does not have the required inventory")) {
              recoveryToastMessage = "Cart recovery failed: Some items went out of stock.";
            } else if (recoveryError?.message) {
              recoveryToastMessage = `Cart recovery failed: ${recoveryError.message}`;
            }
            throw new Error(recoveryToastMessage);
          }
        } else {
          throw new Error(initialErrorMessage);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => {
      toast.error(error.message)
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const recoverFromCheckoutError = async (oldCartId: string | undefined | null): Promise<HttpTypes.StoreCart | null> => {
  if (!oldCartId) {
    return null;
  }

  try {
    const oldCart = await sdk.store.cart.retrieve(oldCartId).then(res => res.cart).catch(err => {
      console.error(`Recovery failed: Could not retrieve old cart ${oldCartId}.`, medusaError(err));
      return null;
    });

    if (!oldCart) {
      removeCartId();
      const { cart: newEmptyCart } = await sdk.store.cart.create({}).catch(medusaError);
      if (newEmptyCart) setCartId(newEmptyCart.id);
      return newEmptyCart || null;
    }

    const { cart: newCart } = await sdk.store.cart.create({ region_id: oldCart.region_id }).catch(medusaError);

    if (!newCart) {
      throw new Error("Failed to create new cart during recovery.");
    }

    if (oldCart.items && oldCart.items.length > 0) {
      console.log(`Transferring ${oldCart.items.length} item(s) from ${oldCartId} to ${newCart.id}...`);
      const transferPromises = oldCart.items.map(item => {
        console.log(` - Adding variant ${item.variant_id} (qty: ${item.quantity})`);
        return sdk.store.cart.createLineItem(newCart.id,
          {
            variant_id: item.variant_id!,
            quantity: item.quantity,
          },
          {}).catch((err: unknown) => {
            console.error(`Recovery warning: Failed to transfer item variant ${item.variant_id} to new cart ${newCart.id}.`, medusaError(err));
            return null;
          });
      });

      await Promise.all(transferPromises);
    }

    setCartId(newCart.id);

    const finalNewCart = await sdk.store.cart.retrieve(newCart.id).then(res => res.cart).catch(medusaError);

    return finalNewCart;

  } catch (error) {
    return medusaError(error);
  }
};