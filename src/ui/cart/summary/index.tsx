import { useState } from "react";
import TextArea from "@/ui/common/components/text-area";
import Button from "@/ui/common/components/button";

interface SummaryProps {
  subtotal: number;
}

export default function Summary({ subtotal }: SummaryProps) {
  const [note, setNote] = useState("");

  return (
    <div>
      <p className="pt-8 mb-2 font-medium text-gray-500">
        Leave Shophaul a Note
      </p>
      <div className="flex justify-between">
        <TextArea
          id="message"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type something..."
          rows={6}
          className="border-gray-300 max-w-sm"
        />
        <div className="flex flex-col gap-4">
          <p className="uppercase text-2xl">Subtotal</p>
          <span className="text-lg font-semibold">${subtotal.toFixed(2)}</span>
          <span className="text-sm text-gray-500">
            Shipping calculated at checkout
          </span>
          <Button className="w-xs">Check Out</Button>
        </div>
      </div>
    </div>
  );
}
