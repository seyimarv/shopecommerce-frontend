"use client";

import { SearchInput } from "@/ui/common/components/input/search-input";
import ProductsFilter from "@/ui/product/products-filter";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SearchResults = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const initialSearchQuery = searchParams.get("q") || "";
    const [search, setSearch] = useState(initialSearchQuery);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set('q', search);
            router.push(`${pathname}?${newParams.toString()}`);
        }
    };

    useEffect(() => {
        setSearch(initialSearchQuery);
    }, [initialSearchQuery]);

    return (
        <div className="container py-8 md:py-10">
            <div className="w-full px-4 md:max-w-md md:px-0 mx-auto mb-4 md:mb-8">
                {
                    !!initialSearchQuery ? (
                        <h1 className="text-3xl md:text-4xl mb-6 text-center">
                            Search Results for "{initialSearchQuery}"
                        </h1>
                    ) : (
                        <h1 className="text-3xl md:text-4xl mb-6 text-center">
                            Search Products
                        </h1>
                    )
                }
                <SearchInput
                    className="w-full text-base" // Ensure full width and prevent mobile zoom
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search products..."
                />
            </div>
            <ProductsFilter isSearch hideTitle />
        </div>
    );
};

export default SearchResults;