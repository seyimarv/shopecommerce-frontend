import React from "react";
import Button from "@/ui/common/components/button";

const EmptyCart: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-15rem)]">
      <h2 className="mb-[3.5rem] text-xl font-normal">
        Your cart is currently empty. Fill it with some goodies!
      </h2>
      <Button isLink href="/shop">
        <button className="px-6 py-2 text-sm border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">
          Return to shop
        </button>
      </Button>
    </div>
  );
};

export default EmptyCart;
