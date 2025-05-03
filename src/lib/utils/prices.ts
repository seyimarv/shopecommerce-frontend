import { HttpTypes } from "@medusajs/types";
import { convertToLocale } from "./money";
import { getPercentageDiff } from "./get-precentage-diff";

export const getPricesForVariant = (variant: any) => {
  if (!variant?.calculated_price?.calculated_amount) {
    return null;
  }

  return {
    calculated_price_number: variant.calculated_price.calculated_amount,
    calculated_price: convertToLocale({
      amount: variant.calculated_price.calculated_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    original_price_number: variant.calculated_price.original_amount,
    original_price: convertToLocale({
      amount: variant.calculated_price.original_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    currency_code: variant.calculated_price.currency_code,
    price_type: variant.calculated_price.calculated_price.price_list_type,
    percentage_diff: getPercentageDiff(
      variant.calculated_price.original_amount,
      variant.calculated_price.calculated_amount
    ),
  };
};

export function getProductPrice({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct;
  variantId?: string;
}) {
  if (!product || !product.id) {
    throw new Error("No product provided");
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null;
    }

    const cheapestVariant: any = product.variants
      .filter((v: any) => !!v.calculated_price)
      .sort((a: any, b: any) => {
        return (
          a.calculated_price.calculated_amount -
          b.calculated_price.calculated_amount
        );
      })[0];

    return getPricesForVariant(cheapestVariant);
  };

  const variantPrice = () => {
    if (!product || !variantId) {
      return null;
    }

    const variant: any = product.variants?.find(
      (v) => v.id === variantId || v.sku === variantId
    );

    if (!variant) {
      return null;
    }

    return getPricesForVariant(variant);
  };

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  };
}

export function subtractPrices(price1: any, price2: any) {
  function extractNumber(price: string) {
    return parseFloat(price.replace(/[^0-9.]/g, "")); // Extract numerical value
  }

  function formatPrice(
    price: { match: (arg0: RegExp) => any[] },
    amount: number
  ) {
    const currencySymbol = price.match(/[^\d.,]/g)?.join("") || ""; // Extract currency symbol
    return `${currencySymbol}${amount.toFixed(2)}`; // Format result with currency
  }

  const num1 = extractNumber(price1);
  const num2 = extractNumber(price2);
  const difference = num1 - num2;

  return formatPrice(price1, difference);
}
