import { FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa6";

const navItems = [
  {
    title: "Collections",
    path: "/collections",
    // hasDropdown: true,
    dropdown: [
      {
        title: "New Arrivals",
        href: "/collections/new-arrivals",
        value: "new_arrivals",
        label: "New Arrivals",
      },
      {
        title: "Journals",
        label: "Journals",
        href: "/collections/journal",
        value: "journals",
      },
      {
        title: "Pens",
        label: "Pens",
        href: "/collections/pens",
        value: "pens",
      },
      {
        title: "Stickers",
        label: "Stickers",
        href: "/collections/stickers",
        value: "stickers",
      },
      {
        title: "Highlighters",
        label: "Highlighters",
        href: "/collections/highlighters",
        value: "highlighters",
      },
    ],
  },
  {
    title: "All products",
    path: "/products",
  },
];

export const mobileNavItems = [
  {
    title: "Collections",
    path: "/collections",
    hasDropdown: true,
    dropdown: [
      {
        title: "New Arrivals",
        href: "/collections/new-arrivals",
        value: "new_arrivals",
        label: "New Arrivals",
      },
      {
        title: "Journals",
        label: "Journals",
        href: "/collections/journal",
        value: "journals",
      },
      {
        title: "Pens",
        label: "Pens",
        href: "/collections/pens",
        value: "pens",
      },
      {
        title: "Stickers",
        label: "Stickers",
        href: "/collections/stickers",
        value: "stickers",
      },
      {
        title: "Highlighters",
        label: "Highlighters",
        href: "/collections/highlighters",
        value: "highlighters",
      },
    ],
  },
  {
    title: "All products",
    path: "/products",
  },
  {
    title: "Faq",
    path: "/faq",
  },
  {
    title: "About",
    path: "/about",
  },
  {
    title: "Contact",
    path: "/contact",
  },
];

interface SocialLinkItem {
  Icon: React.ElementType;
  path: string;
}


export const socialLinks: SocialLinkItem[] = [
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

export default navItems;


