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
import { useAddToCart, useRetrieveCart } from "@/lib/data/cart";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import Thumbnail from "../Thumbnail";
import { IoMdClose } from "react-icons/io";
import Divider from "@/ui/common/components/Divider";

interface ProductActionsProps {
    product: HttpTypes.StoreProduct;
    onCartOpen: () => void;
    onModalClose?: () => void;
}

const optionsAsKeymap = (
    variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
    return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
        acc[varopt.option_id] = varopt.value;
        return acc;
    }, {});
};

const ProductActions = ({ product, onCartOpen, onModalClose }: ProductActionsProps) => {
    const [quantity, setQuantity] = useState(1);
    const [options, setOptions] = useState<Record<string, string | undefined>>(
        {}
    );
    const { mutate: addToCartMutation, isPending, error } = useAddToCart();
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

    useEffect(() => {
        const inventoryQuantity = selectedVariant?.inventory_quantity ?? Infinity;
        if (inventoryQuantity < quantity) {
            setQuantity(Math.max(1, inventoryQuantity));
        }
    }, [selectedVariant?.inventory_quantity, quantity]);

    // update the options when a variant is selected
    const setOptionValue = (optionId: string, value: string) => {
        setOptions((prev) => ({
            ...prev,
            [optionId]: value,
        }));
        setQuantity(1)
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
        return false;
    }, [selectedVariant]);
    const handleAddToCart = async () => {
        if (!selectedVariant?.id) return null;

        addToCartMutation(
            {
                variantId: selectedVariant.id,
                quantity: quantity,

            },
            {
                onSuccess: () => {
                    onCartOpen();
                }
            }
        );
    };

    const accordionItems = [
        {
            id: 1,
            title: "description",
            content: product?.description,
        },
    ];

    const isMobile = useIsMobile()

    return (
        <>
            {
                isMobile ? (
                    <div className="flex justify-between items-start pt-4 pb-6 border-b border-gray-300">
                        <div className="flex gap-x-2 mb-3">
                            <Thumbnail image={product?.thumbnail} className="!w-[100px] !h-[80px]" />
                            <div>
                                <div className="mb-2">
                                    <p className="text-xs font-extralight uppercase mb-1">ShopHaul</p>
                                    <h3 className="text-xl uppercase font-medium">{product?.title}</h3>
                                </div>
                                <ProductPrice product={product} variant={selectedVariant} />
                                <span className="text-sm text-gray-500">
                                    Shipping calculated at checkout
                                </span>
                            </div>
                        </div>
                        <button
                            className="text-gray-400"
                            onClick={onModalClose}
                            aria-label="Close product details"
                            data-drawer-toggle="true"
                        >
                            <IoMdClose size={24} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-x-0.5 mb-3">
                        <ProductPrice product={product} variant={selectedVariant} />
                    </div>
                )
            }
            {(product.variants?.length ?? 0) > 1 && (
                <div className="flex flex-col gap-y-3 md:gap-y-4 py-4 md:py-0">
                    {(product.options || []).map((option) => {
                        return (
                            <div key={option.id} className="w-full">
                                <OptionSelect
                                    option={option}
                                    current={options[option.id]}
                                    updateOption={setOptionValue}
                                    title={option.title ?? ""}
                                    data-testid="product-options"
                                    disabled={isPending}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
            <div className="pb-4 md:pb-0 md:mt-5">
                <Accordion items={accordionItems} allowMultiple={true} />
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-center pb-4 md:pb-0 md:mt-6">
                <div className="w-full md:w-auto pb-2">
                    <span className="md:hidden pb-2 block">Quantity:</span>
                    <QuantitySelector
                        min={1}
                        max={selectedVariant?.inventory_quantity || Infinity}
                        quantity={quantity}
                        onChange={setQuantity}
                        className="w-full md:w-auto"
                    />
                </div>
                {
                    isMobile && <Divider className="py-2 w-full !border-gray-300" />
                }
                <Button
                    variant="outline"
                    className="w-full"
                    isLoading={isPending}
                    onClick={handleAddToCart}
                >
                    {!selectedVariant || Object.keys(options).length === 0
                        ? "Select variant"
                        : !inStock || !isValidVariant
                            ? "Out of stock"
                            : "Add to cart"}
                </Button>
            </div>
            <Link
                href={"/products/" + product.handle}
                className="text-center uppercase pb-4 md:pb-0 md:mt-auto text-md md:text-base block w-full"
            >
                View full details
            </Link>

        </>
    );
};

export default ProductActions;
