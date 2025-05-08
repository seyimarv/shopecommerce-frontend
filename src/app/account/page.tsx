"use client";

import OverviewComponent from "@/ui/profile/overviewcomponent";
import { useRetrieveCustomer } from "@/lib/data/customer";

export default function OverviewTemplate() {
  const { data: customer } = useRetrieveCustomer();
  return (
    <>
      <OverviewComponent customer={customer ?? null} />
    </>
  );
}