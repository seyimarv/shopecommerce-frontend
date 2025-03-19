import React from "react";
import Button from "@/ui/common/components/button";

const EmptyCart: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-15rem)]">
      <h2 className="mb-[3.5rem] text-xl font-normal">
        Your cart is currently empty. Fill it with some goodies!
      </h2>
      <Button isLink href="/shop">
        Return to shop
      </Button>
    </div>
  );
};

export default EmptyCart;
