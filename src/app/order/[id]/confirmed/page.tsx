"use client";

import { useRetrieveOrder } from "@/lib/data/order";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";
import PageSpinner from "@/ui/common/components/spinner/page-spinner";
import OrderCompletedTemplate from "@/ui/order/order-completed-template";
import { notFound, useParams } from "next/navigation";
import { Suspense } from "react";

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
    <Suspense fallback={<PageSpinner />}>
      <WithSkeleton isLoading={isPending}>
        {order && <OrderCompletedTemplate order={order} />}
      </WithSkeleton>
    </Suspense>
  );
};

export default OrderConfirmedPage;
