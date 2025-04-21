// components/Footer.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Input } from "@/ui/common/components/input";
import { socialLinks } from "@/lib/utils/nav-items";

interface LinkItem {
  title: string;
  path: string;
}

const links: LinkItem[] = [
  { title: "FAQ", path: "/faq" },
  { title: "About", path: "/about" },
  { title: "Shipping and returns", path: "/terms-of-use" },
  { title: "Customer reviews", path: "/privacy-policy" },
];

const Footer: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const handleSubscribe = () => {
    if (!email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    // Here you would typically handle the subscription logic
    setEmailError("");
    setEmail("");
    // Handle subscription success
  };

  return (
    <footer
      className="capitalize bg-gray-900 text-white py-10 md:py-20 mt-auto px-4 md:px-0"
      id="footer"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-0 md:justify-between">
          <div className="w-full md:w-auto">
            <h3 className="text-base md:text-lg font-medium">LINKS</h3>
            <ul className="mt-3 space-y-2">
              {links.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    className="text-gray-400 hover:text-white text-sm md:text-base"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-auto md:min-w-[300px] lg:min-w-[400px]">
            <h2 className="text-base md:text-lg font-medium">SHOPHAUL</h2>
            <p className="text-gray-400 mt-2 text-sm md:text-base">
              Your one-stop shop
            </p>
            <div className="flex flex-col mt-6">
              <h4 className="text-white uppercase text-sm md:text-base font-medium">
                SUBSCRIBE TO OUR NEWSLETTER
              </h4>
              <div className="mt-3">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  errorMessage={emailError}
                  className="border border-[#FFFFFF33] rounded-xl py-3 md:py-4 px-3 md:px-4 pr-12 md:pr-14 focus:outline-none focus:border-blue-500 h-full bg-transparent w-full text-white text-sm md:text-base"
                  endContent={
                    <button
                      onClick={handleSubscribe}
                      className="cursor-pointer bg-transparent w-fit"
                      aria-label="Subscribe"
                    >
                      <IoIosArrowRoundForward
                        size={24}
                        className="md:text-[30px]"
                      />
                    </button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 md:mt-10 border-t border-gray-700 pt-6 md:pt-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between gap-4 md:gap-0 items-center">
          <div className="text-gray-500 text-xs md:text-sm order-2 md:order-1">
            &copy; {new Date().getFullYear()} ShopHaul. All rights reserved.
          </div>
          <div className="flex gap-4 items-center order-1 md:order-2">
            {socialLinks.map((item, index) => (
              <Link
                href={item.path || "#"}
                key={index}
                className="text-gray-400 hover:text-white"
              >
                <item.Icon size={20} className="md:text-[24px]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
