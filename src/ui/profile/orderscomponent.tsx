import { useListOrders } from "@/lib/data/order";
import OrdersList from "./order-list";
import { Pagination } from "../common/components/pagination";
import { useSearchParams } from "next/navigation";
import WithSkeleton from "../common/components/Skeleton/with-skeleton";

interface OrdersComponentProps {
  isOverview?: boolean;
}

const OrdersComponent = ({ isOverview }: OrdersComponentProps) => {
  const searchParams = useSearchParams();
  const ITEMS_PER_PAGE = isOverview ? 3 : 5;
  const currentPage = Number(searchParams.get("page")) || 1;
  const {
    data,
    isLoading: ordersLoading,
  } = useListOrders({
    limit: ITEMS_PER_PAGE,
    page: currentPage,
  });

  const totalPages = Math.ceil((data?.response?.count || 0) / ITEMS_PER_PAGE);

  return (
    <WithSkeleton isLoading={ordersLoading}>
      <OrdersList orders={data?.response?.orders || []} />
      {!isOverview && (
        <div className="flex justify-center mt-4">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </WithSkeleton>
  );
};

export default OrdersComponent;
