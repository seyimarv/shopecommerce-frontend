"use client";

import OrdersComponent from "@/ui/profile/orderscomponent";

export default function AccountOrdersPage() {
  return (
    <>
      <h3 className="text-3xl font-bold">All Orders</h3>
      <p className="text-lg my-3">
        View all your previous orders and their status.
      </p>
      <OrdersComponent />
    </>
  );
}
