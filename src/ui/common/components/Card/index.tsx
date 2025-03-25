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
import Link from "next/link";
import { useAddToCart } from "@/lib/data/cart";

interface Collection {
  id: string;
  title: string;
  metadata?: {
    cover_image: string;
  };
}

interface CardProps {
  product?: HttpTypes.StoreProduct;
  collection?: Collection;
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
    collection,
    hideButtons = false,
    variety = "default",
    className = "",
    href,
  } = data;

  const isCollection = !!collection;
  const title = isCollection ? collection.title : product?.title;
  const thumbnail = isCollection
    ? collection.metadata?.cover_image
    : product?.thumbnail;

  const hasVariants = product ? checkHasVariants(product) : false;
  const soldOut = product ? isProductSoldOut(product) : false;
  const { cheapestPrice } = product ? getProductPrice({ product }) : {};

  const { mutate: addToCartMutation, isPending, error } = useAddToCart();

  const allowAddToCart = (variant: HttpTypes.StoreProductVariant) => {
    if (variant && !variant.manage_inventory) {
      return true;
    }
    if (variant?.allow_backorder) {
      return true;
    }
    if (
      variant?.manage_inventory &&
      (variant?.inventory_quantity || 0) > 0
    ) {
      return true;
    }
    return false;
  }

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product && product.variants) {
      const variantId = product.variants[0].id;
      if (!allowAddToCart(product.variants[0])) {
        return;
      }
      addToCartMutation(
        {
          variantId,
          quantity: 1,
        },
        {
          onSuccess: () => {
            openCart();
            setIsHovered(false)
          }
        }
      );
    }
  };

  const handleClickButton = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (hasVariants) {
      setIsHovered(false)
      setIsModalOpen(true);
    } else {
      addToCart(e);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const CardContent = (
    <motion.div
      className="relative cursor-pointer w-full flex-shrink-0"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="overflow-hidden">
        <Thumbnail
          image={thumbnail}
          className={className}
          isHovered={isHovered}
        />
        {cheapestPrice?.price_type === "sale" && product && (
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
      {!hideButtons && product && (
        <motion.div
          initial={soldOut ? {} : { opacity: 0, y: 20, pointerEvents: "none" }}
          animate={
            soldOut
              ? {}
              : {
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 20,
                pointerEvents: isHovered ? "auto" : "none",
              }
          }
          transition={
            soldOut ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }
          }
          className="absolute bottom-18 min-w-auto left-1/2 transform -translate-x-1/2 w-[80%]"
        >
          <Button
            onClick={handleClickButton}
            size="small"
            disabled={soldOut}
            className="w-full"
            isLoading={isPending}
          >
            {soldOut
              ? "Sold Out"
              : hasVariants
                ? "Choose options"
                : "Add to cart"}
          </Button>
        </motion.div>
      )}
      {product && (
        <ProductModal
          productId={product?.id}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
      <div className="pt-2 flex flex-col px-1 font-light">
        <span className="tracking-wider text-md flex items-center gap-1">
          {title} {variety === "collections" && <GrLinkNext size={16} />}
        </span>
        {variety !== "collections" && product && (
          <PreviewPrice price={cheapestPrice || null} />
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      {href ? (
        <Link href={href}>
          {CardContent}
        </Link>
      ) : CardContent}
      <CartDrawer isOpen={isOpen} onClose={closeCart} />
    </>
  );
};

export default Card;
