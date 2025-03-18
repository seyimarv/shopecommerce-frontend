/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpTypes } from "@medusajs/types";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import { isEqual } from "lodash";
import ProductPrice from "../product-price";
import Accordion from "@/ui/common/components/Accordion";
import Button from "@/ui/common/components/button";
import QuantitySelector from "@/ui/common/components/quantityselector";
import Link from "next/link";
import OptionSelect from "./variant-select";

interface ProductActionsProps {
    product: HttpTypes.StoreProduct;
}

const optionsAsKeymap = (
    variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
    return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
        acc[varopt.option_id] = varopt.value;
        return acc;
    }, {});
};

const ProductActions = ({ product }: ProductActionsProps) => {
    const [quantity, setQuantity] = useState(1);
    const [options, setOptions] = useState<Record<string, string | undefined>>(
        {}
    );
    const [isAdding, setIsAdding] = useState(false);
    const countryCode = useParams().countryCode as string;

    // If there is only 1 variant, preselect the options
    useEffect(() => {
        if (product.variants?.length === 1) {
            const variantOptions = optionsAsKeymap(product.variants[0].options);
            setOptions(variantOptions ?? {});
        }
    }, [product.variants]);

    const selectedVariant = useMemo(() => {
        if (!product.variants || product.variants.length === 0) {
            return;
        }

        return product.variants.find((v) => {
            const variantOptions = optionsAsKeymap(v.options);
            return isEqual(variantOptions, options);
        });
    }, [product.variants, options]);

    // update the options when a variant is selected
    const setOptionValue = (optionId: string, value: string) => {
        setOptions((prev) => ({
            ...prev,
            [optionId]: value,
        }));
    };

    //check if the selected options produce a valid variant
    const isValidVariant = useMemo(() => {
        return product.variants?.some((v) => {
            const variantOptions = optionsAsKeymap(v.options);
            return isEqual(variantOptions, options);
        });
    }, [product.variants, options]);

    // check if the selected variant is in stock
    const inStock = useMemo(() => {
        // If we don't manage inventory, we can always add to cart
        if (selectedVariant && !selectedVariant.manage_inventory) {
            return true;
        }

        // If we allow back orders on the variant, we can add to cart
        if (selectedVariant?.allow_backorder) {
            return true;
        }

        // If there is inventory available, we can add to cart
        if (
            selectedVariant?.manage_inventory &&
            (selectedVariant?.inventory_quantity || 0) > 0
        ) {
            return true;
        }

        // Otherwise, we can't add to cart
        return false;
    }, [selectedVariant]);

    const actionsRef = useRef<HTMLDivElement>(null);

    // const inView = useIntersection(actionsRef, "0px")

    // add the selected variant to the cart
    const handleAddToCart = async () => {
        if (!selectedVariant?.id) return null;

        setIsAdding(true);

        // await addToCart({
        //     variantId: selectedVariant.id,
        //     quantity: 1,
        //     countryCode,
        // })

        setIsAdding(false);
    };

    const accordionItems = [
        {
            id: 1,
            title: "description",
            content: product?.description,
        },
    ];

    console.log(selectedVariant, options)

    return (
        <>
            <div className="flex items-center gap-x-0.5">
                <ProductPrice product={product} variant={selectedVariant} />
            </div>
            {(product.variants?.length ?? 0) > 1 && (
                <div className="flex flex-col gap-y-4">
                    {(product.options || []).map((option) => {
                        return (
                            <div key={option.id}>
                                <OptionSelect
                                    option={option}
                                    current={options[option.id]}
                                    updateOption={setOptionValue}
                                    title={option.title ?? ""}
                                    data-testid="product-options"
                                    disabled={isAdding}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
            <div className="mt-5">
                <Accordion items={accordionItems} allowMultiple={true} />
            </div>
            <div className="flex gap-6 items-center">
                <QuantitySelector
                    min={1}
                    max={selectedVariant?.inventory_quantity || 1}
                    initial={quantity}
                    onChange={setQuantity}
                />
                <Button variant="outline" className="w-full">
                    {!selectedVariant || Object.keys(options).length === 0
                        ? "Select variant"
                        : !inStock || !isValidVariant
                            ? "Out of stock"
                            : "Add to cart"}
                </Button>
            </div>
            <Link href={""} className="text-center uppercase mt-auto">
                View full details
            </Link>
        </>
    );
};

export default ProductActions;
