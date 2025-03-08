import { HttpTypes } from "@medusajs/types";

export const checkHasVariants = (product: HttpTypes.StoreProduct) => {
  if (!product.variants) {
    return false;
  } else return product.variants.length > 1;
};
