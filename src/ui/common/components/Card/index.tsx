"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/ui/common/components/button";
import { GrLinkNext } from "react-icons/gr";
import PreviewPrice from "./PreviewPrice";
import Thumbnail from "../../../product/Thumbnail";
import ProductModal from "../../../product/product-modal";
import useCart from "@/lib/hooks/useCart";
import CartDrawer from "@/ui/cart/cart-drawer";
import { HttpTypes } from "@medusajs/types";
import { getProductPrice, subtractPrices } from "@/lib/utils/prices";
import { isProductSoldOut } from "@/lib/utils/soldout";
import { checkHasVariants } from "@/lib/utils/variants";

interface CardProps {
  product: HttpTypes.StoreProduct;
  hideButtons?: boolean;
  variety?: "collections" | "default";
  className?: string;
  href?: string;
}

const Card: React.FC<CardProps> = (data) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isOpen, openCart, closeCart } = useCart();

  const {
    product,
    hideButtons = false,
    variety = "default",
    className = "",
  } = data;

  const hasVariants = checkHasVariants(product);
  const soldOut = isProductSoldOut(product);

  const addToCart = () => {
    openCart();
  };

  const handleClickButton = () => {
    if (hasVariants) {
      setIsModalOpen(true);
    } else {
      addToCart();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { cheapestPrice } = getProductPrice({
    product,
  });

  console.log(cheapestPrice);

  return (
    <>
      <motion.div
        className="relative cursor-pointer w-full flex-shrink-0"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="overflow-hidden">
          <Thumbnail
            image={product?.thumbnail}
            sale={cheapestPrice?.price_type === "sale"}
            className={className}
            isHovered={isHovered}
          />
          {cheapestPrice?.price_type === "sale" && (
            <div className="absolute top-4 left-4 z-1 text-white bg-tertiary px-3 py-0.1 rounded-sm">
              <span className="text-sm uppercase tracking-wide">
                Save{" "}
                {subtractPrices(
                  cheapestPrice?.original_price,
                  cheapestPrice?.calculated_price
                )}
              </span>
            </div>
          )}
        </div>
        {!hideButtons && (
          <motion.div
            initial={
              isProductSoldOut(product)
                ? {}
                : { opacity: 0, y: 20, pointerEvents: "none" }
            }
            animate={
              isProductSoldOut(product)
                ? {}
                : {
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 20,
                    pointerEvents: isHovered ? "auto" : "none",
                  }
            }
            transition={
              isProductSoldOut(product)
                ? { duration: 0 }
                : { duration: 0.3, ease: "easeOut" }
            }
            className="absolute bottom-18 min-w-auto left-1/2 transform -translate-x-1/2 w-[80%]"
          >
            <Button
              onClick={() => {
                handleClickButton();
                setIsHovered(false);
              }}
              size="small"
              disabled={isProductSoldOut(product)}
              className="w-full"
            >
              {isProductSoldOut(product)
                ? "Sold Out"
                : hasVariants
                ? "Choose options"
                : "Add to cart"}
            </Button>
          </motion.div>
        )}
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={product.title}
          imageSrc={product?.thumbnail || ""}
          price={cheapestPrice}
        />
        <div className="pt-2 flex flex-col px-1 font-light">
          <span className="tracking-wider text-md flex items-center gap-1">
            {product.title}{" "}
            {variety === "collections" && <GrLinkNext size={16} />}
          </span>
          {variety !== "collections" && <PreviewPrice price={cheapestPrice} />}
        </div>
      </motion.div>
      <CartDrawer isOpen={isOpen} onClose={closeCart} />
    </>
  );
};

export default Card;
