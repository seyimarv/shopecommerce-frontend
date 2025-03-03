import { useState, useCallback } from "react";

const useCart = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, openCart, closeCart, toggleCart };
};

export default useCart;
