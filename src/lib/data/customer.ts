import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { sdk } from "../../../config"
import { getCartId, getAuthHeaders, setAuthToken, removeAuthToken } from "./cookies"
import { HttpTypes } from '@medusajs/types'

export const retrieveCustomer = async (): Promise<HttpTypes.StoreCustomer | null> => {
    const authHeaders = getAuthHeaders()
    console.log(authHeaders)
    if (!authHeaders) return null

    const headers = {
        ...authHeaders,
    }

    return await sdk.client
        .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
            method: "GET",
            query: {
                fields: "*orders",
            },
            headers,
        })
        .then(({ customer }) => customer)
        .catch(() => null)
}

export const useRetrieveCustomer = () => {
    return useQuery({
        queryKey: ['customer'],
        queryFn: retrieveCustomer,
        staleTime: 1000 * 60 * 60 * 24 * 7,
        refetchInterval: 1000 * 60 * 60 * 24 * 7,
    })
}

export async function transferCart() {
    const cartId = getCartId()

    if (!cartId) {
        return
    }

    const headers = getAuthHeaders() || {}
    await sdk.store.cart.transferCart(cartId, {}, headers)
}

export const useSignup = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ email, password, firstName, lastName }: { email: string, password: string, firstName: string, lastName: string }) => {
            const token = await sdk.auth.register("customer", "emailpass", {
                email,
                password,
            })

            setAuthToken(token as string)

            const headers = getAuthHeaders() || {}
            const { customer: createdCustomer } = await sdk.store.customer.create(
                { email, first_name: firstName, last_name: lastName },
                {},
                headers
            )

            const loginToken = await sdk.auth.login("customer", "emailpass", {
                email,
                password,
            })

            setAuthToken(loginToken as string)

            await transferCart()

            return createdCustomer
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer'] })
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

export const useLogin = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ email, password }: { email: string, password: string }) => {
            const loginToken = await sdk.auth.login("customer", "emailpass", {
                email,
                password,
            })

            setAuthToken(loginToken as string)
            await transferCart()

            const headers = getAuthHeaders() || {}
            const { customer } = await sdk.store.customer.retrieve({}, headers)
            return customer
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer'] })
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

export const useLogout = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            setAuthToken("")
            await sdk.auth.logout()
            removeAuthToken()
            return true
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer'] })
            queryClient.removeQueries({ queryKey: ['customer'] })
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

export const useResetPassword = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            await sdk.auth.resetPassword("customer", "emailpass", {
                identifier: email,
            })
            return true
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer'] })
        },
    })
}

export const useUpdatePassword = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ email, password, token }: { email: string, password: string, token: string }) => {
            await sdk.auth.updateProvider("customer", "emailpass", {
                email,
                password,
            }, token)
            return true
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer'] })
        },
    })
}