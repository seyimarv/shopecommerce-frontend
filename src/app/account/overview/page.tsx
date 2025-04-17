"use client";

import OverviewComponent from "@/ui/profile/overviewcomponent";
import { notFound } from "next/navigation";
import { useRetrieveCustomer } from "@/lib/data/customer";
import { useListOrders } from "@/lib/data/order";

export default function OverviewTemplate() {
  const { data: customer, isLoading, error } = useRetrieveCustomer();
  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useListOrders({
    limit: 4,
  });

  console.log("Orders:", orders);
  if (!isLoading && !customer) {
    notFound();
  }
  return (
    <>
      <OverviewComponent customer={customer ?? null} orders={orders ?? null} />
    </>
  );
}
