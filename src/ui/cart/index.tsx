"use client";

import { useRetrieveCart } from "@/lib/data/cart";
import CartTable from "./cart-table";
import EmptyCart from "./empty-cart";
import Summary from "./summary";
import WithSkeleton from "../common/components/Skeleton/with-skeleton";
import CartTableSkeleton from "../common/components/Skeleton/cart-skeleton";
import { convertToLocale } from "@/lib/utils/money";

const CartTemplate = () => {
  const { data: cart, isLoading } = useRetrieveCart();
  return (
    <WithSkeleton isLoading={isLoading} skeleton={<CartTableSkeleton />}>
      {
        (!cart || cart?.items?.length === 0) ? (
          <EmptyCart />
        ) : (
          <div className="overflow-x-auto">
            <CartTable data={cart?.items || []} currencyCode={cart?.currency_code} />
            <Summary subtotal={convertToLocale({ amount: cart?.subtotal || 0, currency_code: cart?.currency_code })} />
          </div>
        )
      }
    </WithSkeleton>
  );
};

export default CartTemplate;
