import { HttpTypes } from "@medusajs/types";
import { getCartId, setCartId } from "./cookies";
import { sdk } from "../../../config";
import { getRegion } from "./region";
import medusaError from "../utils/medusa-error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type StoreCart = HttpTypes.StoreCartResponse["cart"];
type StoreCartLineItem = NonNullable<StoreCart["items"]>[0];
type Product = HttpTypes.StoreProductResponse["product"];

type CartItemWithInventory = StoreCartLineItem & {
  inventory_quantity?: number;
  is_in_stock?: boolean;
};

type CartWithInventory = Omit<StoreCart, "items"> & {
  id: string;
  region_id: string;
  items: CartItemWithInventory[];
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
          is_in_stock:
            !variant.manage_inventory || variant.inventory_quantity > 0,
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

  console.log("get or set cart");

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

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error(
      "No existing cart found, please create one before updating"
    );
  }

  return sdk.store.cart
    .update(cartId, data, {})
    .then(async ({ cart }) => {
      return cart;
    })
    .catch(medusaError);
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
  console.log("add to cart");

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
    .then(async () => {})
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
    .then(async () => {})
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
    .then(async () => {})
    .catch(medusaError);
}

export const useUpdateLineItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lineId, quantity }: { lineId: string; quantity: number }) =>
      updateLineItem({ lineId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useDeleteLineItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lineId: string) => deleteLineItem(lineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRetrieveCart = (id?: string) => {
  return useQuery({
    queryKey: ["cart", id || getCartId()],
    queryFn: () => retrieveCart(id),
    enabled: !!id || !!getCartId(),
  });
};

export const useGetOrSetCart = (countryCode: string) => {
  return useQuery({
    queryKey: ["cart", countryCode],
    queryFn: () => getOrSetCart(countryCode),
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HttpTypes.StoreUpdateCart) => updateCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      variantId: string;
      quantity: number;
      countryCode: string;
    }) => addToCart(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
