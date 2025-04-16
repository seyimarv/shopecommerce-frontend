"use client"

interface PreviewPriceProps {
  price: {
    calculated_price_number: number;
    calculated_price: string;
    original_price_number: number;
    original_price: string;
    currency_code: string;
    price_type: string;
    percentage_diff: string;
  } | null;
  size?: "md" | "lg"; // New prop for text size
}

export default function PreviewPrice({
  price,
  size = "md",
}: PreviewPriceProps) {
  if (!price) return null;

  const getTextSize = () => {
    if (size === "lg") {
      return "text-base sm:text-md md:text-lg";
    }
    return "text-xs sm:text-sm md:text-md";
  };

  const textSize = getTextSize();

  return price.price_type === "sale" ? (
    <div className={`flex flex-wrap gap-1 sm:gap-2 ${textSize}`}>
      <span className={`text-red-500 ${size === "lg" ? "font-medium sm:font-bold" : ""}`}>
        {price.calculated_price}
      </span>
      <span className="line-through text-gray-400 sm:text-gray-500 text-xs sm:text-sm md:text-md">
        {price.original_price}
      </span>
    </div>
  ) : (
    <span className={textSize}>{price.calculated_price}</span>
  );
}
