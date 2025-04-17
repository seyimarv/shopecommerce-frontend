"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/ui/common/components/button";
import { GrLinkNext } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
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
import { LiaCartPlusSolid } from "react-icons/lia";
import toast from 'react-hot-toast';
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import CustomToast from "../custom-toast";

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
  const isMobile = useIsMobile();

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
            if (isMobile) {
              // On mobile, show toast with link to cart
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
              // On desktop, open cart drawer
              openCart();
              setIsHovered(false);
            }
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
      <div className="overflow-hidden rounded-sm relative">
        <Thumbnail
          image={thumbnail}
          className={className}
          isHovered={isHovered}
        />
        {cheapestPrice?.price_type === "sale" && product && (
          <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 z-1 text-white bg-tertiary px-2 sm:px-3 py-0.1 rounded-sm">
            <span className="text-xs sm:text-sm uppercase tracking-wide">
              Save{" "}
              {subtractPrices(
                cheapestPrice?.original_price,
                cheapestPrice?.calculated_price
              )}
            </span>
          </div>
        )}
        {
          !hideButtons && product &&
          <div className="lg:hidden absolute bottom-4 right-2 z-10">
            {soldOut ? (
              <div className="p-1 bg-red-50 border border-red-200 rounded-sm text-xs text-red-600">
                <div>
                  Sold out
                </div>
              </div>
            ) : (
              <button
                onClick={handleClickButton}
                disabled={isPending}
                className="bg-white shadow-md p-1 text-gray-800 hover:bg-gray-100 transition-colors"
              >
                {isPending ? (
                  <div className="h-5 w-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                ) : (
                  <LiaCartPlusSolid size={24} />
                )}
              </button>
            )}
          </div>
        }

      </div>
      {!hideButtons && product && (
        <>
          {/* Desktop button */}
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
            className="absolute bottom-18 min-w-auto left-1/2 transform -translate-x-1/2 w-[80%] hidden lg:block"
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

          {/* Mobile cart icon or sold out tag */}

        </>
      )}
      <div className="pt-2 flex flex-col px-1 font-light">
        <span className="tracking-wide sm:tracking-wider text-sm sm:text-md flex items-center gap-0.5 sm:gap-1 truncate">
          {title} {variety === "collections" && <GrLinkNext className="flex-shrink-0" size={variety === "collections" ? 14 : 16} />}
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
      {product && (
        <ProductModal
          productId={product?.id}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Card;
