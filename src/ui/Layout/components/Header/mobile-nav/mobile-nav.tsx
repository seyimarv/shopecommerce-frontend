import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CiMenuBurger, CiSearch, CiShoppingCart } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useRetrieveCart } from "@/lib/data/cart";
import MobileDrawer from "./mobile-drawer";

interface MenuToggleButtonProps {
  isOpen: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const MenuToggleButton: React.FC<MenuToggleButtonProps> = ({
  isOpen,
  onClick,
}) => {
  return (
    <button
      className="text-gray-800 p-2"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      data-drawer-toggle="true"
    >
      {isOpen ? <IoMdClose size={24} /> : <CiMenuBurger size={24} />}
    </button>
  );
};

interface MobileNavProps {
  setSearchOpen: (open: boolean) => void;
  setOpenCart: (open: boolean) => void;
  setMobileMenuOpen?: (open: boolean) => void;
  mobileMenuOpen: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({
  setSearchOpen,
  setOpenCart,
  setMobileMenuOpen,
  mobileMenuOpen,
}) => {
  const {
    data: cart,
    isLoading: cartIsLoading,
    error: cartError,
  } = useRetrieveCart();
  return (
    <>
      <div className="lg:hidden w-full container">
        <div className="flex items-center justify-between py-2">
          <MenuToggleButton
            isOpen={mobileMenuOpen}
            onClick={(e) => {
              setMobileMenuOpen?.(!mobileMenuOpen);
            }}
          />
          <div className="flex-1 flex justify-center">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="ShopHaul" width={100} height={32} />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-800 p-1"
              aria-label="Search"
            >
              <CiSearch size={22} />
            </button>

            <button
              className="relative text-gray-800 p-1"
              onClick={() => setOpenCart(true)}
              aria-label="Cart"
              data-drawer-toggle="true"
            >
              <CiShoppingCart size={22} />
              {cart && cart.items && cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-800 text-white w-4 h-4 flex items-center justify-center rounded-full text-xs font-medium">
                  {cart.items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen?.(false)}
      />
    </>
  );
};

export default MobileNav;
