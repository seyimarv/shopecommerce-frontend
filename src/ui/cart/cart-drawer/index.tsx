import { useInView } from "@/lib/hooks/useInView";
import { Drawer } from "../../Layout/components/Drawer";
import CartProduct from "@/ui/product/cart-product";
import Button from "@/ui/common/components/button";
import { useEffect, useState } from "react";
import TextArea from "@/ui/common/components/text-area";
import { GoPencil } from "react-icons/go";
import { useRetrieveCart } from "@/lib/data/cart";
import { convertToLocale } from "@/lib/utils/money";
import WithSkeleton from "@/ui/common/components/Skeleton/with-skeleton";
import { getCheckoutStep } from "@/lib/utils/checkout";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useUpdateCart } from "@/lib/data/cart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { isInView: isBannerInView } = useInView({ id: "banner" });
  const { isInView: isHeaderInView } = useInView({ id: "header" });
  const [openNote, setOpenNote] = useState(false);
  const [note, setNote] = useState("");

  const isMobile = useIsMobile()

  const { data: cart, isLoading } = useRetrieveCart();
  const { mutate: updateCart, isPending } = useUpdateCart();

  useEffect(() => {
    if (cart?.metadata?.note && typeof cart.metadata.note === 'string') {
      setNote(cart.metadata.note);
    }
  }, [cart]);

  const onSubmitNote = () => {
    if (!cart) return;
    updateCart({ metadata: { note } }, {
      onSuccess: () => {
        setOpenNote(false);
      },
    });
  };

  const drawerClassName =
    isBannerInView && isHeaderInView
      ? "top-[6.375rem] h-[calc(100vh-6.375rem)]"
      : isHeaderInView
        ? "top-[3.875rem] h-[calc(100vh-3.875rem)]"
        : "h-full";

  if (isMobile) {
    return
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      contentAnimation={{
        hidden: { x: "100%", opacity: 0 },
        visible: { x: 0, opacity: 1 },
      }}
      overlayAnimation={{
        hidden: { opacity: 0 },
        visible: { opacity: 0.8 },
      }}
      wrapperClassName={drawerClassName}
    >
      <WithSkeleton isLoading={isLoading}>
        {
          (!cart?.items?.length) ?
            <div className="flex flex-col justify-center items-center h-full">
              <h2 className="mb-[3.5rem] text-xl font-normal">
                Your cart is currently empty. Fill it with some goodies!
              </h2>
              <Button isLink href="/products" variant="outline" onClick={onClose}>
                Return to shop
              </Button>
            </div> : <>
              <div className="flex flex-col h-full">
                <div className="h-[80%] overflow-y-scroll p-4">
                  {cart?.items
                    ?.sort((a, b) => {
                      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
                      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
                      return timeB - timeA;
                    })
                    .map((item: any) => (
                      <CartProduct
                        key={item.id}
                        id={item.id}
                        title={!item?.title.includes("Default") ? (item.title || item?.product?.title || "") : ""}
                        productTitle={item?.product?.title || ""}
                        price={item.unit_price || 0}
                        quantity={item.quantity}
                        max={item?.inventory_quantity}
                        thumbnail={item.thumbnail || item?.images?.[0]?.url || item?.variant?.product?.images?.[0]?.url || ""}
                        handle={item?.product?.handle}
                        currencyCode={cart?.currency_code || ""}
                      />
                    ))}
                </div>
                <button
                  className="w-full mb-4 p-2 border-t border-b border-gray-400 tracking-wider uppercase text-sm flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => setOpenNote(true)}
                >
                  <GoPencil />
                  <span> write a note</span>
                </button>
                <div className="flex w-full justify-between mt-auto px-4">
                  <p className="text-xl font-normal">
                    SUBTOTAL
                    <span className="block mt-1 text-sm font-light">
                      Shipping calculated at checkout
                    </span>
                  </p>
                  <span className="text-lg">
                    {cart && cart.region ? convertToLocale({
                      amount: (cart.subtotal || 0),
                      currency_code: cart.region.currency_code || "usd"
                    }) : "0"}
                  </span>
                </div>
                <div className="flex w-full justify-between mt-4 px-4 pb-4">
                  <Button
                    href={cart?.id ? `/checkout?step=${getCheckoutStep(cart)}` : '#'}
                    disabled={!cart?.id || isLoading || cart?.items?.length === 0}
                    isLink
                  >
                    check out
                  </Button>
                  <Button
                    variant="outline"
                    href="/cart"
                    disabled={isLoading || cart?.items?.length === 0}
                    isLink
                    onClick={onClose}
                  >
                    view cart
                  </Button>
                </div>
              </div>
              <Drawer
                isOpen={openNote}
                onClose={() => setOpenNote(false)}
                position="bottom"
                absolute
              >
                <div className="max-w-sm mx-auto p-4">
                  <TextArea
                    id="message"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Type something..."
                    rows={6}
                    className="border-gray-300"
                  />
                  <Button 
                    className="mt-4 w-full" 
                    onClick={onSubmitNote} 
                    isLoading={isPending}
                    disabled={isPending || !cart}
                  >
                    Apply
                  </Button>
                </div>
              </Drawer>
            </>
        }

      </WithSkeleton>
    </Drawer>
  );
}
