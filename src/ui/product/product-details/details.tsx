"use client";

import { useState } from "react";
import Button from "@/ui/common/components/button";
import QuantitySelector from "@/ui/common/components/quantityselector";
import VariantSelector, { VariantOption } from "../variant-select";
import PreviewPrice from "@/ui/common/components/Card/PreviewPrice";
import Accordion, { AccordionItem } from "@/ui/common/components/Accordion";
import { Product } from "../product-list";
import { GrFavorite } from "react-icons/gr";

interface DetailsProps extends Product {
  colors: VariantOption[];
  quantity?: number;
  accordionItems: AccordionItem[];
}

const Details = ({
  title,
  price,
  colors,
  quantity = 1,
  accordionItems,
}: DetailsProps) => {
  const [selectedColor, setSelectedColor] = useState(colors[0]?.value || null);
  const [selectedQuantity, setSelectedQuantity] = useState(quantity);

  return (
    <div className="py-10 flex flex-1 flex-col">
      <h3 className="text-2xl uppercase">{title}</h3>
      <div className="flex items-center gap-2 my-4">
        <PreviewPrice size="lg" price={price} />
        {price.price_type === "sale" && (
          <span className="bg-red-100 text-red-600 px-2 py-1 ml-1 text-xs rounded">
            SALE
          </span>
        )}
      </div>

      <VariantSelector
        label="Color"
        options={colors}
        onSelect={setSelectedColor}
        isColor
        defaultValue={selectedColor}
      />
      <p className="mt-4 text-gray-700">
        Lorem ipsum dolor sit amet, consectetur adip lorem, sed do eiusmod
        tempor incididunt ut lorem. Lorem ipsum dolor sit amet, conlore, sed do
        eiusmod tempor incid lorem ipsum dolor sit amet, consectetur adip lorem,
        sed do eiusmod tempor incididunt ut lorem. Lorem ipsum dolor sit amet,
        conlore, sed do eiusmod tempor incid
      </p>
      <div className="my-8">
        <Accordion items={accordionItems} allowMultiple={true} />
      </div>

      <div className="flex gap-8 items-center">
        <QuantitySelector
          min={1}
          max={10}
          initial={selectedQuantity}
          onChange={setSelectedQuantity}
        />
        <Button variant="outline" className="w-full" size="large">
          ADD TO CART
        </Button>
        <GrFavorite size={25} />
      </div>
    </div>
  );
};

export default Details;
