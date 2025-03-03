import { mockProducts } from "@/lib/mock-data";
import ProductList from "../product-list";
import Details from "./details";
import ImageGallery from "./image-gallery";

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

const ProductDetails = () => {
  return (
    <div>
      <div className="container p-6 flex gap-8 tracking-wider mb-6">
        <ImageGallery
          images={[
            "/picture1.jpg",
            "/picture1.jpg",
            "/picture1.jpg",
            "/picture1.jpg",
          ]}
        />
        <Details
          colors={colors}
          accordionItems={[
            {
              id: 1,
              title: "DETAILS",
              content: "You can return any item within 30 days of purchase.",
            },
            {
              id: 2,
              title: "DESCRIPTION",
              content: "Shipping typically takes 5-7 business days.",
            },
            {
              id: 3,
              title: "MATERIAL",
              content: "Shipping typically takes 5-7 business days.",
            },
          ]}
          id={""}
          imgSrc={"/picture1.jpg"}
          title={"EMBROIDERY CAP - B GRADE"}
          price={{
            price_type: "sale",
            original_price: 23,
            calculated_price: 24,
          }}
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
