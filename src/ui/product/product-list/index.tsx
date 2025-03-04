import React from "react";
import ProductPreview from "../../common/components/Card";
import Button from "@/ui/common/components/button";

export interface Product {
  id: string;
  imgSrc: string;
  title: string;
  price: {
    price_type: "sale" | "default";
    original_price?: number;
    calculated_price?: number;
  };
  sale?: boolean;
  soldOut?: boolean;
  hasVariants?: boolean;
  href?: string;
}

interface ProductTitleProps {
  title: string;
  className?: string;
}

const ProductTitle: React.FC<ProductTitleProps> = ({
  title,
  className = "",
}) => (
  <h2 className={`text-2xl pb-8 tracking-widest uppercase ${className}`}>
    {title}
  </h2>
);

interface ProductItemsProps {
  products: Product[];
  className?: string;
  hideButtons?: boolean;
  type?: "collections" | "default";
}

const ProductItems: React.FC<ProductItemsProps> = ({
  products,
  hideButtons = false,
  className = "",
}) => (
  <div
    className={`grid ${"grid-cols-2 md:grid-cols-4"} gap-4 gap-y-20 ${className}`}
  >
    {products.map((product) => (
      <ProductPreview
        key={product.id}
        {...product}
        hideButtons={hideButtons}
        className="h-90"
      />
    ))}
  </div>
);

interface ViewMoreLinkProps {
  href: string;
  className?: string;
}

const ViewMoreLink: React.FC<ViewMoreLinkProps> = ({
  href,
  className = "",
}) => (
  <div className={`flex justify-center mt-10  ${className}`}>
    <Button href={href} isLink className="min-w-[14rem]" size="large">
      View More
    </Button>
  </div>
);

interface ProductListProps {
  title?: string;
  products: Product[];
  href?: string;
  className?: string;
  viewMore?: boolean;
  hideButtons?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  title,
  products,
  href,
  className = "",
  viewMore = false,
  hideButtons = false,
}) => {
  return (
    <section className={` ${className}`}>
      {title && <ProductTitle title={title} />}
      <ProductItems products={products} hideButtons={hideButtons} />
      {viewMore && href && <ViewMoreLink href={href} />}
    </section>
  );
};

export default ProductList;
