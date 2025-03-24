import { mockProducts } from "@/lib/mock-data";
import ProductList from "../product-list";
import Details from "./details";
import ImageGallery from "./image-gallery";
import { HttpTypes } from "@medusajs/types";

interface ProductDetailsProps {
  product?: HttpTypes.StoreProduct;
}

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

const ProductDetails = ({ product }: ProductDetailsProps) => {
  return (
    <div>
      <div className="container p-6 flex gap-8 tracking-wider mb-6">
        <ImageGallery
          images={product?.images?.map(img => img.url) || []}
          thumbnail={product?.thumbnail || ""}
        />
        <Details
        product={product}
        />
      </div>
      <div className="flex flex-col my-22 gap-22 container">
        <ProductList title="You may also like" products={mockProducts} />
        <ProductList title="Recently viewed" products={mockProducts} />
      </div>
    </div>
  );
};

export default ProductDetails;
