import { Product } from "@/ui/product/product-list";

export const mockProducts: Product[] = [
  {
    id: "1",
    imgSrc: "/picture1.jpg",
    title: "Product 1",
    price: { price_type: "default", calculated_price: 20 },
    sale: false,
    soldOut: false,
    hasVariants: false,
  },
  {
    id: "2",
    imgSrc: "/picture1.jpg",
    title: "Product 2",
    price: { price_type: "sale", original_price: 30, calculated_price: 25 },
    sale: true,
    soldOut: false,
    hasVariants: true,
  },
  {
    id: "3",
    imgSrc: "/picture1.jpg",
    title: "Product 3",
    price: { price_type: "sale", original_price: 50, calculated_price: 45 },
    sale: true,
    soldOut: true,
    hasVariants: false,
  },
  {
    id: "4",
    imgSrc: "/picture1.jpg",
    title: "Product 4",
    price: { price_type: "default", calculated_price: 35 },
    sale: false,
    soldOut: false,
    hasVariants: true,
  },
];
