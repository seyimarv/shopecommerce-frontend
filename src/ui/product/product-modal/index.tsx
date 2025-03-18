"use client"

import Image from "next/image";
import Modal from "@/ui/common/components/Modal";
import { useListProducts } from "@/lib/data/products";
import ProductActions from "../product-actions";

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


  return (
    <Modal
      isOpen={isOpen}
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
          {product && <ProductActions product={product} />}
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;
