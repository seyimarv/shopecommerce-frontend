import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Overview", href: "/account/overview" },
  { name: "Profile", href: "/account/profile" },
  { name: "Addresses", href: "/account/addresses" },
  { name: "Orders", href: "/account/orders" },
];

const AccountNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex w-1/6 tracking-wide border-r-2 border-r-gray-100 mr-5">
      <ul className="space-y-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`text-lg font-medium ${
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

export default AccountNav;
