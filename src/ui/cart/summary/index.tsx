import { useEffect, useState } from "react";
import TextArea from "@/ui/common/components/text-area";
import Button from "@/ui/common/components/button";
import { useRetrieveCart, useUpdateCart } from "@/lib/data/cart";
import { getCheckoutStep } from "@/lib/utils/checkout";
import { useRouter } from "next/navigation";

interface SummaryProps {
  subtotal: string;
}

export default function Summary({ subtotal }: SummaryProps) {
  const { data: cart, isLoading } = useRetrieveCart();
  const {mutate: updateCart, isPending, error } = useUpdateCart();
  const [note, setNote] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (cart?.metadata?.note && typeof cart.metadata.note === 'string') {
      setNote(cart.metadata.note);
    }
  }, [cart]);

  const onSubmitNote = () => {
    if (!cart) return;
    updateCart({ metadata: { note } }, {
      onSuccess: () => {
        router.push(`/checkout?step=${getCheckoutStep(cart)}`);
      },
    });
  };

  return (
    <div className="w-full">
      <p className="pt-8 mb-2 font-medium text-gray-500">
        Leave ShopHaul a Note
      </p>
      <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-8">
        <TextArea
          id="message"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type something..."
          rows={6}
          className="border-gray-300 w-full md:max-w-sm"
        />

        <div className="flex flex-col gap-4 md:min-w-[240px]">
          <div className="flex justify-between md:flex-col md:gap-2">
            <p className="uppercase text-xl md:text-2xl font-medium">
              Subtotal
            </p>
            <span className="text-lg font-semibold">{subtotal}</span>
          </div>

          <span className="text-sm text-gray-500">
            Shipping calculated at checkout
          </span>

          <Button
            className="w-full md:w-auto mt-2"
            onClick={onSubmitNote}
            disabled={!cart?.id || isLoading || cart?.items?.length === 0}
            isLoading={isPending}
            isLink
          >
            Check Out
          </Button>
        </div>
      </div>
    </div>
  );
}
