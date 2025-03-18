import { HttpTypes } from "@medusajs/types";
import { getCartId, setCartId } from "./cookies";
import { sdk } from "../../../config";
import { getRegion } from "./region";
import medusaError from "../utils/medusa-error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export async function retrieveCart(id?: string) {
    try {
        const cartId = id || getCartId();

        if (!cartId) {
            return null;
        }

        console.log("retrieve cart")

        const { cart } = await sdk.client
            .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${cartId}`, {
                method: "GET",
                query: {
                    fields:
                        "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name",
                },
            });
        return cart;
    } catch (error) {
        console.error("Failed to retrieve cart:", error);
        return null;
    }
}

export async function getOrSetCart(countryCode: string) {
    const region = await getRegion(countryCode)

    if (!region) {
        throw new Error(`Region not found for country code: ${countryCode}`)
    }

    let cart = await retrieveCart()

    console.log("get or set cart")

    if (!cart) {
        const cartResp = await sdk.store.cart.create(
            { region_id: region.id },
            {},
        )
        cart = cartResp.cart

        setCartId(cart.id)
    }

    if (cart && cart?.region_id !== region.id) {
        await sdk.store.cart.update(cart.id, { region_id: region.id }, {})
    }

    return cart
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
    const cartId = getCartId()

    if (!cartId) {
        throw new Error("No existing cart found, please create one before updating")
    }

    return sdk.store.cart
        .update(cartId, data, {})
        .then(async ({ cart }) => {
            return cart
        })
        .catch(medusaError)
}

export async function addToCart({
    variantId,
    quantity,
    countryCode,
}: {
    variantId: string
    quantity: number
    countryCode: string
}) {
    console.log("add to cart")

    if (!variantId) {
        throw new Error("Missing variant ID when adding to cart")
    }

    const cart = await getOrSetCart(countryCode)

    if (!cart) {
        throw new Error("Error retrieving or creating cart")
    }

    await sdk.store.cart
        .createLineItem(
            cart.id,
            {
                variant_id: variantId,
                quantity,
            },
            {},
        )
        .then(async () => {
        })
        .catch(medusaError)
}

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
        mutationFn: (params: { variantId: string; quantity: number; countryCode: string }) =>
            addToCart(params),
        onSuccess: () => {
            console.log("success")
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });
};
