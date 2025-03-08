import { HttpTypes } from "@medusajs/types";

export const isVariantInStock = (variant: any) => {
  return variant.manage_inventory === false || variant.inventory_quantity > 0;
};

export const isProductSoldOut = (product: HttpTypes.StoreProduct) => {
  if (!product.variants) {
    return;
  }
  const isProductSoldOut = product?.variants.every(
    (variant) => !isVariantInStock(variant)
  );

  return isProductSoldOut;
};
