// components/Footer.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Input } from "@/ui/common/components/input";

interface LinkItem {
  title: string;
  path: string;
}

interface SocialLinkItem {
  Icon: React.ElementType;
  path: string;
}

const links: LinkItem[] = [
  { title: "FAQ", path: "/our-mission" },
  { title: "About", path: "/team" },
  { title: "Shipping and returns", path: "/terms-of-use" },
  { title: "Customer reviews", path: "/privacy-policy" },
];

const socialLinks: SocialLinkItem[] = [
  {
    Icon: FaTwitter,
    path: "",
  },
  {
    Icon: FaInstagram,
    path: "",
  },
  {
    Icon: FaTiktok,
    path: "",
  },
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
    <footer className="bg-gray-900 text-white py-20 mt-auto">
      <div className="container flex justify-between gap-0 md:text-left">
        <div className="">
          <h3 className="text-lg">LINKS</h3>
          <ul className="mt-2 space-y-2">
            {links.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className="text-gray-400 hover:text-white"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-sm ml-auto">
          <h2 className="text-lg">SHOPHAUL</h2>
          <p className="text-gray-400 mt-2">Your one-stop shop</p>
          <div className="flex flex-col mt-4">
            <h4 className="text-white uppercase">
              SUBSCRIBE TO OUR NEWSLETTER
            </h4>
            <div className="mt-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                errorMessage={emailError}
                className="border border-[#FFFFFF33] rounded-xl py-4 px-4 pr-14 focus:outline-none focus:border-blue-500 h-full bg-transparent w-full text-white"
                endContent={
                  <button
                    onClick={handleSubscribe}
                    className="cursor-pointer bg-transparent w-fit"
                    aria-label="Subscribe"
                  >
                    <IoIosArrowRoundForward size={30} />
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-gray-700 pt-8 ">
        <div className="container flex justify-between w-full items-center">
          <div className="text-gray-500 text-sm ">
            &copy; {new Date().getFullYear()} ShopHaul. All rights reserved.
          </div>
          <div className="flex gap-4 items-center">
            {socialLinks.map((item, index) => (
              <Link href={item.path || "#"} key={index}>
                <item.Icon size={24} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
