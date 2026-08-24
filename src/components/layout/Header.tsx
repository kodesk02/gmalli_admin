"use client";

import { usePathname } from "next/navigation";
import { Bell, HelpCircle } from "lucide-react";
import Image from "next/image";

const routeTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/products": "Products",
  "/dashboard/orders": "Orders",
  "/dashboard/orders/delivery": "Delivery Management",
  "/dashboard/orders/pickup": "Pickup Verification",
  "/dashboard/analytics": "Analytics & Reports",
  "/dashboard/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();

  const getTitle = (path: string) => {
    if (routeTitles[path]) return routeTitles[path];
    if (path.startsWith("/dashboard/products/")) return "Product Details";
    if (path.startsWith("/dashboard/orders/")) return "Order Details";
    return "Dashboard";
  };

  const title = getTitle(pathname);

  return (
    <header className="flex print:hidden items-center justify-between px-8 py-6 bg-transparent">
      <h1 className="text-2xl font-bold text-primary">{title}</h1>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-sm transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-sm transition-colors">
          <HelpCircle className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
          <Image
            src="/images/Dino.jpeg"
            alt="Admin Profile"
            className="w-full h-full object-cover"
            width={100}
            height={100}
          />
        </div>
      </div>
    </header>
  );
}