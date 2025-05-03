"use client";

import { useAddToCart, useRetrieveCart } from "@/lib/data/cart";
import Accordion from "@/ui/common/components/Accordion";
import Button from "@/ui/common/components/button";
import QuantitySelector from "@/ui/common/components/quantityselector";
import { HttpTypes } from "@medusajs/types";
import { isEqual } from "lodash";
import { useState, useEffect, useMemo } from "react";
import OptionSelect from "../product-actions/variant-select";
import ProductPrice from "../product-price";
import { GrFavorite } from "react-icons/gr";
import ProductInfoTab from "./product-info";
import CustomToast from "@/ui/common/components/custom-toast";
import toast from "react-hot-toast";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

interface ProductActionsProps {
  product: HttpTypes.StoreProduct;
  onCartOpen?: () => void;
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value;
    return acc;
  }, {});
};

const ProductActions = ({ product, onCartOpen }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState<Record<string, string | undefined>>(
    {}
  );
  const { mutate: addToCartMutation, isPending } = useAddToCart();
  const isMobile = useIsMobile();
  const { data: cart } = useRetrieveCart();

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

    if (cart && selectedVariant.manage_inventory) {
      const inventoryQuantity = selectedVariant.inventory_quantity ?? 0;
      const cartItem = cart?.items?.find(
        (item) => item.variant_id === selectedVariant.id
      );
      const quantityInCart = cartItem?.quantity ?? 0;

      if (inventoryQuantity < quantityInCart + quantity) {
        const availableToAdd = inventoryQuantity - quantityInCart;
        let message = "Maximum available quantity already in cart.";
        if (availableToAdd > 0) {
          message = `You can only add ${availableToAdd} more of this item.`
        } else if (inventoryQuantity === 0) {
          message = "This item is currently out of stock.";
        }
        toast.error(message);
        return; // Stop execution
      }
    }

    addToCartMutation(
      {
        variantId: selectedVariant.id,
        quantity: quantity,

      },
      {
        onSuccess: () => {
          if (isMobile) {
            toast.custom((t) => (
              <CustomToast
                message="Product has been added to cart"
                actionLink="/cart"
                actionText="View Cart"
                type="success"
                onClose={() => toast.dismiss(t.id)}
              />
            ));
          } else {
            onCartOpen?.();
          }
        }
      }
    );
  };

  const accordionItems = [
    {
      id: 2,
      title: "Product information",
      content: <ProductInfoTab product={product} />,
    },
  ];

  return (
    <>
      <div className="py-6 md:py-10 flex flex-1 flex-col">
        <h3 className="text-xl md:text-2xl uppercase">{product.title}</h3>
        <div className="my-3 md:my-4">
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
                    disabled={isPending}
                  />
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-4 text-gray-700">
          {product.description}
        </p>
        <div className="my-6 md:my-8">
          <Accordion items={accordionItems} allowMultiple={true} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-center">
          <div className="w-full sm:w-auto">
            <QuantitySelector
              min={1}
              max={selectedVariant?.inventory_quantity || Infinity}
              quantity={quantity}
              onChange={setQuantity}
            />
          </div>
          <Button variant="outline" className="w-full sm:flex-1" isLoading={isPending} onClick={handleAddToCart}>
            {!selectedVariant || Object.keys(options).length === 0
              ? "Select variant"
              : !inStock || !isValidVariant
                ? "Out of stock"
                : "Add to cart"}
          </Button>
          <div className="hidden sm:block">
            <GrFavorite size={25} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductActions;

