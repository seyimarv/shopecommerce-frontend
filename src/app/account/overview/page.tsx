"use client";

import OverviewComponent from "@/ui/profile/overviewcomponent";
import { notFound } from "next/navigation";
import { useRetrieveCustomer } from "@/lib/data/customer";

export default function OverviewTemplate() {
  const { data: customer, isLoading } = useRetrieveCustomer();

  if (!isLoading && !customer) {
    notFound();
  }
  return (
    <>
      <OverviewComponent customer={customer ?? null} />
    </>
  );
}
