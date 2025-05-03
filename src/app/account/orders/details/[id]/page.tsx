"use client";

import { useRetrieveOrder } from "@/lib/data/order";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";
import OrderItems from "@/ui/order/items";
import OrderDetails from "@/ui/order/order-details";
import { notFound, useParams } from "next/navigation";

const OrderDetailsPage = () => {
  const params = useParams();
  const idParam = params.id;

  const { data: order, isPending, error } = useRetrieveOrder(idParam as string);

  if (typeof idParam !== 'string') {
    return notFound();
  }
  
  if (!order && !isPending && error) {
    return notFound();
  }

  return (
    <WithSkeleton isLoading={isPending}>
      {order && (
        <div className="flex flex-col gap-y-8 py-8">
          <h1 className="text-xl md:text-3xl">Order Details</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <OrderDetails order={order} />
            <div className="flex flex-col gap-y-4">
              <h2 className="font-semibold tracking-wide text-lg md:text-2xl">Summary</h2>
              <OrderItems order={order} />
            </div>
          </div>
        </div>
      )}
    </WithSkeleton>
  );
};

export default OrderDetailsPage;
