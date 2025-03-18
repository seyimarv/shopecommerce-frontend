export const getAuthHeaders = (): { authorization: string } | {} => {
    const token = getCookie("_medusa_jwt");

    if (!token) {
        return {};
    }

    return { authorization: `Bearer ${token}` };
};

export const getCacheTag = (tag: string): string => {
    const cacheId = getCookie("_medusa_cache_id");

    if (!cacheId) {
        return "";
    }

    return `${tag}-${cacheId}`;
};

export const getCacheOptions = (tag: string): { tags: string[] } | {} => {
    if (typeof window !== "undefined") {
        const cacheTag = getCacheTag(tag);
        if (!cacheTag) {
            return {};
        }
        return { tags: [`${cacheTag}`] };
    }
    return {};
};

export const setAuthToken = (token: string) => {
    setCookie("_medusa_jwt", token, 60 * 60 * 24 * 7);
};

export const removeAuthToken = () => {
    removeCookie("_medusa_jwt");
};

export const getCartId = (): string | undefined => {
    return getCookie("_medusa_cart_id");
};

export const setCartId = (cartId: string) => {
    setCookie("_medusa_cart_id", cartId, 60 * 60 * 24 * 7);
};

export const removeCartId = () => {
    removeCookie("_medusa_cart_id");
};

const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const poppedValue = parts.pop();
        return poppedValue?.split(';')[0];
    }
    return undefined;
};

const setCookie = (name: string, value: string, maxAge: number) => {
    const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; sameSite=strict; secure=${process.env.NODE_ENV === "production"}`;
};

const removeCookie = (name: string) => {
    document.cookie = `${name}=; max-age=-1; path=/;`;
};
