"use client";

import { useRetrieveOrder } from "@/lib/data/order";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";
import OrderCompletedTemplate from "@/ui/order/order-completed-template";
import { notFound, useParams } from "next/navigation";

const OrderConfirmedPage = () => {
  const params = useParams();
  const idParam = params.id;


  const { data: order, isPending } = useRetrieveOrder(idParam as string);


  if (typeof idParam !== 'string') {
    return notFound();
  }

  if (!order && !isPending) {
    return notFound();
  }

  return (
    <WithSkeleton isLoading={isPending}>
      {order && <OrderCompletedTemplate order={order} />}
    </WithSkeleton>
  );
};

export default OrderConfirmedPage;
