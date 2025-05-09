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
      className="text-gray-800 py-2"
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
  setMobileMenuOpen,
  mobileMenuOpen,
}) => {
  const {
    data: cart,
  } = useRetrieveCart();
  return (
    <>
      <div className="lg:hidden w-full container">
        <div className="flex items-center justify-between py-2">
          <div className="w-[20%]">
            <MenuToggleButton
              isOpen={mobileMenuOpen}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen?.(!mobileMenuOpen);
              }}
            />
          </div>
          <div className="flex-1 flex justify-center w-[100%]">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="ShopHaul" width={100} height={32} />
            </Link>
          </div>
          <div className="flex justify-end items-center gap-4 w-[20%]">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-800 p-1"
              aria-label="Search"
            >
              <CiSearch size={22} />
            </button>


            <Link
              href="/cart"
              className="relative text-gray-800 p-1"
              aria-label="Cart"
            >
              <CiShoppingCart size={22} />
              {cart && cart.items && cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-800 text-white w-4 h-4 flex items-center justify-center rounded-full text-xs font-medium">
                  {cart.items.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen?.(false)} />
    </>
  );

};

export default MobileNav;
