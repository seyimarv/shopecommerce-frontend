"use client"

import Image from "next/image";
import Modal from "@/ui/common/components/Modal";
import { useListProducts } from "@/lib/data/products";
import ProductActions from "../product-actions";
import useCart from "@/lib/hooks/useCart";
import CartDrawer from "@/ui/cart/cart-drawer";
import { Drawer } from "@/ui/Layout/components/Drawer";
import { IoMdClose } from 'react-icons/io';
import { motion } from 'framer-motion';
import { useIsMobile } from "@/lib/hooks/useIsMobile";

interface ProductModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productId
}) => {
  const { data, isLoading, error } = useListProducts({
    queryParams: {
      id: productId
    }
  });

  const product = data?.response.products[0]

  const { isOpen: isCartOpen, closeCart, openCart } = useCart();

  const isMobile = useIsMobile()

  // Animation variants for mobile drawer content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      {/* Desktop Modal */}
      {
        isMobile ? (
          <Drawer
            isOpen={isOpen && !isCartOpen}
            onClose={onClose}
            position="bottom"
            className="md:hidden h-[85vh] rounded-t-xl"
          >
            <div className="flex flex-col h-full overflow-y-auto">

              <motion.div
                className="flex-1 flex flex-col p-4"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                {/* <div className="relative w-full h-64 mb-6">
                  <Image
                    src={product?.thumbnail || ""}
                    alt={product?.title || "Product"}
                    fill
                    className="object-cover object-center rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <p className="text-xs font-extralight uppercase mb-1">ShopHaul</p>
                  <h3 className="text-xl uppercase font-medium">{product?.title}</h3>
                </div> */}

                {product && (
                  <div className="flex-1">
                    <ProductActions product={product} onCartOpen={openCart} onModalClose={onClose} />
                  </div>
                )}
              </motion.div>
            </div>
          </Drawer>
        ) : (
          <Modal
            isOpen={isOpen && !isCartOpen}
            onClose={onClose}
            className="h-[calc(100%-6.25rem)] max-h-[544px] w-full max-w-[800px]"
          >
            <div className="flex h-full">
              <div className="relative w-1/2 h-full">
                <Image
                  src={product?.thumbnail || ""}
                  alt={product?.title || "Product"}
                  fill
                  className="absolute object-cover object-center rounded-l-lg"
                />
              </div>
              <div className="w-1/2 p-12 py-10 flex flex-col gap-5 overflow-y-auto">
                <div className="">
                  <p className="text-xs font-extralight uppercase mb-2">ShopHaul</p>
                  <h3 className="text-xl uppercase">{product?.title}</h3>
                </div>
                {product && <ProductActions product={product} onCartOpen={openCart} />}
              </div>
            </div>
          </Modal>
        )
      }
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default ProductModal;
