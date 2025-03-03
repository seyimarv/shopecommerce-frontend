"use client"

import Image from "next/image";
import Modal from "@/ui/common/components/Modal";
import PreviewPrice from "../../common/components/Card/PreviewPrice";
import VariantSelector from "../variant-select";
import Accordion from "@/ui/common/components/Accordion";
import { useState } from "react";
import QuantitySelector from "@/ui/common/components/quantityselector";
import Button from "@/ui/common/components/button";
import Link from "next/link";

const accordionItems = [
  {
    id: 1,
    title: "details",
    content: "You can return any item within 30 days of purchase.",
  },
  {
    id: 2,
    title: "description",
    content: "Shipping typically takes 5-7 business days.",
  },
];

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageSrc: string;
  price?: {
    price_type: "sale" | "default";
    original_price?: number;
    calculated_price?: number;
  };
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  title,
  imageSrc,
  price,
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

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
      className: "bg-white border border-gray-300 w-3 h-3 rounded-full",
    },
  ];

  // const sizes = [
  //   { name: "S", value: "small" },
  //   { name: "M", value: "medium" },
  //   { name: "L", value: "large" },
  // ];

  // const materials = [
  //   { name: "Cotton", value: "cotton" },
  //   { name: "Polyester", value: "polyester" },
  //   { name: "Silk", value: "silk" },
  // ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="h-[calc(100%-6.25rem)] max-h-[800px] w-full max-w-[1000px]"
    >
      <div className="flex h-full">
        <div className="relative w-full flex-1 h-full">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="absolute inset-0 object-cover object-center"
          />
        </div>
        <div className="p-12 py-10 flex flex-1 flex-col gap-5 w-1/2">
          <div>
            <p className="text-xs font-extralight uppercase mb-2">ShopHaul</p>
            <h3 className="text-xl uppercase">{title}</h3>
          </div>
          <div className="flex items-center gap-x-0.5">
            <span className="text-lg">$</span>
            <PreviewPrice size="lg" price={price} />
          </div>
          <VariantSelector
            label="Color"
            options={colors}
            onSelect={setSelectedColor}
            isColor
            defaultValue={colors[0].value}
          />
          <div className="mt-5">
            <Accordion items={accordionItems} allowMultiple={true} />
          </div>
          <div className="flex gap-6 items-center">
            <QuantitySelector
              min={1}
              max={10}
              initial={quantity}
              onChange={setQuantity}
            />
            <Button variant="outline" className="w-full" size="large">
              ADD TO cart
            </Button>
          </div>
          <Link href={""} className="text-center text-lg uppercase mt-auto">
            View full details
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;
