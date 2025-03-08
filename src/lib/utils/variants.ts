import { HttpTypes } from "@medusajs/types";

export const checkHasVariants = (product: HttpTypes.StoreProduct): boolean => {
  return (
    (Array.isArray(product.variants) && product.variants.length > 1) ||
    (Array.isArray(product.options) && product.options.length > 1)
  );
};
