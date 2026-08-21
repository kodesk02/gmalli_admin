"use client";

import { navItems } from "@/lib/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sidebar text-white flex flex-col justify-between shrink-0 min-h-screen p-6">
      <div className="space-y-8">
        <div className="px-3">
          <h1 className="text-2xl font-bold tracking-wider text-white">GMALLI</h1>
          <p className="text-xs text-gray-400 tracking-widest mt-0.5">ADMIN PORTAL</p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wider transition-colors ${
                  isActive
                    ? "bg-sidebar-hover text-brand-red-light border-l-2 border-[#8B0000]"
                    : "text-gray-400 hover:text-white hover:bg-sidebar-hover"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-brand-red-light" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={() => console.log("Logging out...")}
        className="flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider text-gray-400 hover:text-white transition-colors mt-auto"
      >
        <LogOut className="w-4 h-4" />
        LOGOUT
      </button>
    </aside>
  );
}