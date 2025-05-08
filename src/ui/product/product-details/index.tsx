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
      <div className="container p-4 md:p-6 flex flex-col lg:flex-row gap-4 md:gap-8 tracking-wider mb-6">
        <div className="w-full lg:w-1/2">
          <ImageGallery
            images={product?.images?.map(img => img.url) || []}
            thumbnail={product?.thumbnail || product?.images?.[0]?.url || ""}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <Details
            product={product!}
          />
        </div>
      </div>
      <div className="flex flex-col my-12 md:my-22 gap-12 md:gap-22 container px-4 md:px-6">
        <RelatedProducts product={product!} />
        {/* <ProductList title="Recently viewed" products={mockProducts} /> */}
      </div>
    </div>
  );
};

export default ProductDetails;
