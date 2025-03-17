"use client"

import Image from "next/image";
import Modal from "@/ui/common/components/Modal";
import { useState } from "react";
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
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  console.log(productId)
  const { data, isLoading, error } = useListProducts({
    queryParams: {
      id: productId
    }
  });
  
  const product = data?.response.products[0]

  const colors = [
    {
      name: "Black",
      value: "black",
      className: "bg-black w-3 h-3 rounded-full",
    },
    {
      name: "Beige",
      value: "beige",
      className: "bg-yellow-100 w-3 h-3 rounded-full",
    },
    {
      name: "White",
      value: "white",
      className: "bg-white border w-3 h-3 rounded-full",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="h-[calc(100%-6.25rem)] max-h-[544px] w-full max-w-[800px]"
    >
      <div className="flex flex-1 h-full">
        <div className="relative w-full h-full">
          <Image
            src={product?.thumbnail || ""}
            alt={product?.title || "Product"}
            fill
            className="absolute object-cover object-center rounded-l-lg"
          />
        </div>
        <div className="p-12 py-10 flex flex-1 flex-col gap-5 w-1/2">
          <div>
            <p className="text-xs font-extralight uppercase mb-2">ShopHaul</p>
            <h3 className="text-xl uppercase">{product?.title}</h3>
          </div>
          <ProductActions product={product} />
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;
