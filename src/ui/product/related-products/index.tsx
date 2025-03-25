"use client";

import { useListProducts } from "@/lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductList from "../product-list"
import { useEffect, useMemo, useState } from "react"

type RelatedProductsProps = {
    product: HttpTypes.StoreProduct
    countryCode?: string
}

export default function RelatedProducts({
    product,
}: RelatedProductsProps) {
    // Create query params for related products
    const [queryParams, setQueryParams] = useState<HttpTypes.StoreProductParams>({
        limit: 12,
        is_giftcard: false
    });

    useEffect(() => {
        setQueryParams(prevParams => ({
            ...prevParams,
            collection_id: product.collection_id ? [product.collection_id] : undefined,
            tag_id: product.tags && product.tags.length > 0
                ? product.tags.slice(0, 3).map(t => t.id).filter(Boolean) as string[]
                : undefined
        }));
    }, [product.collection_id, product.tags]);

    const { data, isLoading } = useListProducts({ queryParams });

    // Filter out the current product from related products
    const filteredProducts = useMemo(() => {
        if (!data?.response?.products) return [];
        return data.response.products.filter(p => p.id !== product.id);
    }, [data?.response?.products, product.id]);

    return (
        <div>
            {
                filteredProducts?.length ? <ProductList title="You may also like" products={filteredProducts} isLoading={isLoading} /> : null
            }

        </div>
    )
}
