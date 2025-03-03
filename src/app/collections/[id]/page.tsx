import { mockProducts } from "@/lib/mock-data";
import ProductList from "@/ui/product/product-list";
import { AvailabiltyFilter, PriceFilter } from "@/ui/product/products-filter";
import SortBy from "@/ui/product/products-filter/sort";

const Page = () => {
  return (
    <>
      <div>
        <h2 className={`text-4xl pb-8 tracking-widest uppercase`}>Products</h2>
        <div className="flex justify-between items-center mt-3 mb-5">
          <div className="flex items-center gap-4">
            <span className="text-sm">Filter:</span>
            <AvailabiltyFilter />
            <PriceFilter />
          </div>
          <div className="flex items-center gap-4">
            <SortBy />
            <span className="text-sm text-gray-600">400 products</span>
          </div>
        </div>
      </div>
      <ProductList products={mockProducts} />
    </>
  );
};

export default Page;
