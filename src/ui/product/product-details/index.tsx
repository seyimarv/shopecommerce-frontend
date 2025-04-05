import Details from "./details";
import ImageGallery from "./image-gallery";
import { HttpTypes } from "@medusajs/types";
import RelatedProducts from "../related-products";

interface ProductDetailsProps {
  product?: HttpTypes.StoreProduct;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  return (
    <div>
      <div className="container p-6 flex gap-8 tracking-wider mb-6">
        <ImageGallery
          images={product?.images?.map(img => img.url) || []}
          thumbnail={product?.thumbnail || product?.images?.[0]?.url || ""}
        />
        <Details
          product={product}
        />
      </div>
      <div className="flex flex-col my-22 gap-22 container">
        <RelatedProducts product={product} />
        {/* <ProductList title="Recently viewed" products={mockProducts} /> */}
      </div>
    </div>
  );
};

export default ProductDetails;
