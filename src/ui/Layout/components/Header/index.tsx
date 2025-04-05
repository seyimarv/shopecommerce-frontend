"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import navItems from "@/lib/utils/nav-items";
import LinkDropdown from "../LinkDropdown";
import { CiUser, CiSearch, CiShoppingCart } from "react-icons/ci";
import CurrencyPicker from "@/ui/common/components/Currency-picker";
import Image from "next/image";
import CartDrawer from "../../../cart/cart-drawer";
import ProductSearch from "@/ui/product/products-search";
import { useRetrieveCart } from "@/lib/data/cart";
import { useListRegions } from "@/lib/data/region";

const Header: React.FC = () => {
  const { data: regions } = useListRegions()
  const [headerStatus, setHeaderStatus] = useState<
    "initial" | "sticky" | "hidden"
  >("initial");
  const [isSearchOpen, setSearchOpen] = useState(false);
  const lastScrollY = useRef(0);
  const initialScrollThreshold = useRef(102); // The threshold for considering initial position
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [openCart, setOpenCart] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If at the top of the page (or within threshold), always show as initial
      if (currentScrollY <= initialScrollThreshold.current) {
        setHeaderStatus("initial");
      } else {
        // If scrolling back up and not in initial position
        if (currentScrollY < lastScrollY.current) {
          setHeaderStatus("sticky");
        } else {
          // If scrolling down, hide the header
          setHeaderStatus("hidden");
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: cart, isLoading, error } = useRetrieveCart()

  return (
    <>
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: headerStatus === "hidden" ? -70 : 0,
          opacity: headerStatus === "hidden" ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`h-[3.875rem] w-full z-50 bg-background transition-all duration-300 ${headerStatus === "sticky"
          ? "sticky top-0 shadow-lg border-b border-gray-200"
          : ""
          } ${!isHomePage && headerStatus === "initial"
            ? "border-b border-gray-300"
            : ""
          }`}
        id="header"
      >
        <nav className="h-full flex justify-between w-full gap-4 items-center container">
          <div className="w-30">
            <Link href="/">
              <Image src="/logo.png" alt="logo" width={120} height={40} />
            </Link>
          </div>
          <ul className="flex gap-16 w-full justify-center items-center text-sm">
            {navItems.map(({ title, path, hasDropdown, dropdown }, i) => (
              <li key={i} className="uppercase">
                {hasDropdown ? (
                  <LinkDropdown title={title} path={path} links={dropdown} />
                ) : (
                  <Link href={path} className="uppercase">
                    {title}
                  </Link>
                )}
              </li>
            ))}
            <div className="w-[160px]">
              {regions && <CurrencyPicker regions={regions} />}
            </div>
          </ul>
          {/* Icons (Search, Profile, Cart) */}
          <ul className="flex gap-6 flex-1 justify-end text-md">
            <li>
              <button
                onClick={() => setSearchOpen(true)}
                className="cursor-pointer"
              >
                <CiSearch size={20} />
              </button>
            </li>
            <li>
              <Link href="/profile">
                <CiUser className="text-lg" size={20} />
              </Link>
            </li>
            <li>
              <button className="relative cursor-pointer" onClick={() => setOpenCart(true)}>
                <CiShoppingCart
                  size={20}
                />
                {
                  cart && cart.items && cart.items.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-gray-800 text-white w-4 h-4 flex items-center justify-center rounded-full text-xs font-medium">
                      {/* {
                        cart.items.reduce((total, item) => total + (item.quantity || 0), 0)
                      } */}
                      {
                        cart?.items?.length
                      }
                    </span>
                  )
                }
              </button>
            </li>
          </ul>
        </nav>
      </motion.header>
      <CartDrawer isOpen={openCart} onClose={() => setOpenCart(false)} />
      <ProductSearch
        isOpen={isSearchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
};

export default Header;
