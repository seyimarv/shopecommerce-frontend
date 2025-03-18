import { useInView } from "@/lib/hooks/useInView";
import { Drawer } from "../../Layout/components/Drawer";
import { mockProducts } from "@/lib/mock-data";
import CartProduct from "@/ui/product/cart-product";
import Button from "@/ui/common/components/button";
import { useState } from "react";
import TextArea from "@/ui/common/components/text-area";
import { GoPencil } from "react-icons/go";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { isInView: isBannerInView } = useInView({ id: "banner" });
  const { isInView: isHeaderInView } = useInView({ id: "header" });
  const [openNote, setOpenNote] = useState(false);
  const [note, setNote] = useState("");

  const handleRemove = (id: string) => {
    console.log("Removing item with id:", id);
  };

  // Function to update quantity
  const handleQuantityChange = (id: string, quantity: number) => {
    console.log(`Updated ${id} to quantity: ${quantity}`);
  };

  const drawerClassName =
    isBannerInView && isHeaderInView
      ? "top-[6.375rem] h-[calc(100vh-6.375rem)]"
      : isHeaderInView
      ? "top-[3.875rem] h-[calc(100vh-3.875rem)]"
      : "h-full";

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
      <div className="flex flex-col h-full">
        {/* <div className="h-[80%] overflow-y-scroll p-4">
          {mockProducts.map((item) => (
            <CartProduct
              key={item.id}
              {...item}
              onRemove={handleRemove}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div> */}
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
          <span className="text-lg">30USD</span>
        </div>
        <div className="flex w-full justify-between mt-4 px-4 pb-4">
          <Button>check out</Button>
          <Button variant="outline">view all</Button>
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
          <Button className="mt-4 w-full">Apply</Button>
        </div>
      </Drawer>
    </Drawer>
  );
}
