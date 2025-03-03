import { mockProducts } from "@/lib/mock-data";
import CollectionList from "@/ui/collections/collection-list";

const Collections = () => {
  return <CollectionList title="Collections" collections={mockProducts} />;
};

export default Collections;
