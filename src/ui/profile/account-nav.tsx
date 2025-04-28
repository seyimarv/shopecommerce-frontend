import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Overview", href: "/account" },
  { name: "Profile", href: "/account/profile" },
  { name: "Addresses", href: "/account/addresses" },
  { name: "Orders", href: "/account/orders" },
];

const AccountSidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="w-full lg:w-1/5 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-100 pb-4 lg:pb-0 lg:pr-6">
      <ul className="flex flex-row lg:flex-col gap-4 lg:gap-6">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`text-base md:text-lg font-medium ${
                pathname === item.href
                  ? "text-black font-semibold"
                  : "text-gray-500"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AccountSidebar;
