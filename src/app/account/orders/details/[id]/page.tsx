"use client";

import { useRetrieveOrder } from "@/lib/data/order";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";
import OrderItems from "@/ui/order/items";
import OrderDetails from "@/ui/order/order-details";
import { notFound, useParams } from "next/navigation";

const OrderDetailsPage = () => {
  const params = useParams();
  const { id } = params;

  const { data: order, isPending, error } = useRetrieveOrder(id);
  console.log(order);
  if (!order && !isPending) {
    return notFound();
  }

  return (
    <WithSkeleton isLoading={isPending}>
      {order && (
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl">Order Details</h1>
          <OrderDetails order={order} />
          <h2 className="font-semibold tracking-wide text-2xl">Summary</h2>
          <OrderItems order={order} />
        </div>
      )}
    </WithSkeleton>
  );
};

export default OrderDetailsPage;
