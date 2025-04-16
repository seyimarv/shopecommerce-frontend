"use client";

import { useInView } from "@/lib/hooks/useInView";
import { Drawer } from "@/ui/Layout/components/Drawer";
import Link from "next/link";
import Image from "next/image";
import navItems, { mobileNavItems, socialLinks } from "@/lib/utils/nav-items";
import { CiUser, CiShoppingCart, CiLogout } from "react-icons/ci";
import { usePathname } from "next/navigation";
import { useRetrieveCustomer } from "@/lib/data/customer";
import { useListRegions } from "@/lib/data/region";
import CurrencyPicker from "@/ui/common/components/Currency-picker";
import { motion } from 'framer-motion'; // Import motion
import { IoMdClose } from 'react-icons/io';
import Divider from "@/ui/common/components/Divider";

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
    const { isInView: isBannerInView } = useInView({ id: "banner" });
    const { isInView: isHeaderInView } = useInView({ id: "header" });
    const pathname = usePathname();
    const { data: customer } = useRetrieveCustomer();
    const { data: regions } = useListRegions();

    const drawerClassName =
        isBannerInView && isHeaderInView
            ? "top-[6.375rem]"
            : isHeaderInView
                ? "top-[3.875rem]"
                : "";

    // Framer Motion variants
    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Stagger children by 0.1s
                delayChildren: 0.4 // Start staggering after 0.2s (drawer animation)
            }
        }
    };

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.3 } }
    };

    const bottomSectionVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } }
    };

    const bottomListVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 1 
            }
        }
    };

    const bottomItemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            position="left"
            // wrapperClassName={drawerClassName}
            className="!max-w-[350px] w-full h-[100vh]"
        >

            <nav className="space-y-6 w-full h-full flex flex-col bg-white container justify-between pb-8">
                <div className="flex-1 pt-6 px-2">
                    <button
                        className="text-gray-400"
                        onClick={() => {
                            onClose();
                        }}
                        aria-label={"Close menu"}
                        data-drawer-toggle="true"
                    > <IoMdClose size={24} />
                    </button>
                    <motion.ul
                        className="pt-4 space-y-6"
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {mobileNavItems.map(({ title, path, hasDropdown, dropdown }, i) => (
                            <>
                                <motion.li key={i} className="py-2" variants={itemVariants}>
                                    <Link
                                        href={path}
                                        className={`text-base font-medium text-lg uppercase ${pathname === path ? "text-black" : "text-gray-600"
                                            }`}
                                        onClick={onClose}
                                        prefetch
                                    >
                                        {title}
                                    </Link>
                                    {/* {hasDropdown && dropdown && (
                                            <ul className="pl-4 mt-2 space-y-2">
                                                {dropdown.map((item, j) => (
                                                    <li key={j}>
                                                        <Link
                                                            href={item.path}
                                                            className={`text-sm ${pathname === item.path ? 'text-black' : 'text-gray-500'}`}
                                                            onClick={onClose}
                                                        >
                                                            {item.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )} */}
                                </motion.li>
                                {i < mobileNavItems.length - 1 && (
                                    <Divider className="mt-[-18px] !border-gray-300" />
                                )}
                            </>
                        ))}
                    </motion.ul>
                </div>
                <motion.div
                    className="flex-1 mt-auto flex flex-col"
                    variants={bottomSectionVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="mt-auto">
                        <motion.ul
                            className="space-y-3"
                            variants={bottomListVariants} // Apply stagger container variants
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.li variants={bottomItemVariants}> {/* Apply item variants */}
                                <Link
                                    href="/account"
                                    className="flex items-center text-base text-lg text-gray-700"
                                    onClick={onClose}
                                    prefetch
                                >
                                    <CiUser className="mr-2" size={24} />
                                    <span>{customer ? "My Account" : "Sign In"}</span>
                                </Link>
                            </motion.li>
                            {customer && (
                                <motion.li variants={bottomItemVariants}> {/* Apply item variants */}
                                    <button
                                        className="flex items-center text-base text-lg text-gray-700"
                                        onClick={() => {
                                            // Handle logout logic here
                                            onClose();
                                        }}
                                    >
                                        <CiLogout className="mr-2" size={24} />
                                        <span>Sign Out</span>
                                    </button>
                                </motion.li>
                            )}
                            <motion.div className="py-4" variants={bottomItemVariants}> {/* Apply item variants */}
                                {regions && <CurrencyPicker regions={regions} />}
                            </motion.div>
                            <motion.div className="flex gap-4 items-center" variants={bottomItemVariants}> {/* Apply item variants */}
                                {socialLinks.map((item, index) => (
                                    <Link href={item.path || "#"} key={index}>
                                        <item.Icon size={16} />
                                    </Link>
                                ))}
                            </motion.div>
                        </motion.ul>
                    </div>
                </motion.div>
            </nav>
        </Drawer>
    );
}
