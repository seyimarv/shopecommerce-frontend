import React from "react";
import ProductPreview from "../../common/components/Card";
import Button from "@/ui/common/components/button";
import { HttpTypes } from "@medusajs/types";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";
import ProductsSkeleton from "@/ui/common/components/Skeleton/products-skeleton";

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
  <h2 className={`text-xl md:text-2xl pb-4 md:pb-8 tracking-widest uppercase ${className}`}>
    {title}
  </h2>
);

interface ProductItemsProps {
  products?: HttpTypes.StoreProduct[];
  className?: string;
  hideButtons?: boolean;
  variety?: "collections" | "default";
}

const ProductItems: React.FC<ProductItemsProps> = ({
  products,
  hideButtons = false,
  className = "",
}) => (
  <div
    className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 gap-y-10 md:gap-y-20 ${className}`}
  >
    {products?.map((product) => (
      <ProductPreview
        key={product.id}
        product={product}
        hideButtons={hideButtons}
        className="w-full lg:h-90"
        href={`/products/${product.handle}`}
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
  <div className={`flex justify-center mt-6 md:mt-10 ${className}`}>
    <Button href={href} isLink className="min-w-[10rem] md:min-w-[14rem]" size="large">
      View More
    </Button>
  </div>
);

interface ProductListProps {
  title?: string;
  products?: HttpTypes.StoreProduct[];
  href?: string;
  className?: string;
  viewMore?: boolean;
  hideButtons?: boolean;
  isLoading: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  title,
  products,
  href,
  className = "",
  viewMore = false,
  hideButtons = false,
  isLoading,
}) => {
  return (
    <section className={`mb-8 md:mb-0 ${className}`}>
      {(title && (isLoading || (products && products.length > 0))) && <ProductTitle title={title} />}
      <WithSkeleton isLoading={isLoading} skeleton={<ProductsSkeleton />}>
        <ProductItems products={products} hideButtons={hideButtons} />
      </WithSkeleton>
      {(products && products.length > 0) && viewMore && href && <ViewMoreLink href={href} />}
    </section>
  );
};

export default ProductList;
