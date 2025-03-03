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

interface CardProps {
  imgSrc: string;
  title: string;
  price?: {
    price_type: "sale" | "default";
    original_price?: number;
    calculated_price?: number;
  };
  sale?: boolean;
  soldOut?: boolean;
  hasVariants?: boolean;
  hideButtons?: boolean;
  type?: "collections" | "default";
  className?: string;
  href?: string;
}

const Card: React.FC<CardProps> = ({
  imgSrc,
  title,
  price,
  sale = false,
  soldOut = false,
  hasVariants = false,
  hideButtons = false,
  type = "default",
  className = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isOpen, openCart, closeCart } = useCart();

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

  return (
    <>
      <motion.div
        className="relative cursor-pointer w-full flex-shrink-0"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="overflow-hidden">
          <Thumbnail
            image={imgSrc}
            sale={sale}
            className={className}
            isHovered={isHovered}
          />
          {sale && (
            <div className="absolute top-4 left-4 z-1 text-white bg-tertiary px-3 py-0.1 rounded-sm">
              <span className="text-sm uppercase tracking-wide">Save $5</span>
            </div>
          )}
        </div>
        {!hideButtons && (
          <motion.div
            initial={
              soldOut ? {} : { opacity: 0, y: 20, pointerEvents: "none" }
            }
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
              onClick={() => {
                handleClickButton();
                setIsHovered(false); // Reset hover state when clicked
              }}
              size="small"
              disabled={soldOut}
              className="w-full"
            >
              {soldOut
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
          title={title}
          imageSrc={imgSrc}
          price={price}
        />
        <div className="pt-2 flex flex-col px-1 font-light">
          <span className="tracking-wider text-md flex items-center gap-1">
            {title} {type === "collections" && <GrLinkNext size={16} />}
          </span>
          {type !== "collections" && <PreviewPrice price={price} />}
        </div>
      </motion.div>
      <CartDrawer isOpen={isOpen} onClose={closeCart} />
    </>
  );
};

export default Card;
