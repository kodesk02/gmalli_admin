"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Truck,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { FilterTab, OrderStatusTrack, OrderType } from "@/lib/types";
import { mockOrders } from "@/lib/data";
import { SearchInput } from "@/components/SearchInput";
import { useRouter } from "next/navigation";

export const statusConfig: Record<
  OrderStatusTrack,
  { label: string; className: string }
> = {
  pending: { label: "PENDING", className: "bg-amber-100/80  text-amber-700" },
  confirmed: {
    label: "CONFIRMED",
    className: "bg-blue-100/80   text-blue-700",
  },
  ready: { label: "READY", className: "bg-purple-100/80 text-purple-700" },
  delivered: {
    label: "DELIVERED",
    className: "bg-emerald-100/80 text-emerald-700",
  },
  cancelled: {
    label: "CANCELLED",
    className: "bg-rose-100/80   text-rose-700",
  },
};

function StatusBadge({ status }: { status: OrderStatusTrack }) {
  const config = statusConfig[status];
  return (
    <span
      className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider uppercase inline-block ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function TypeCell({ type }: { type: OrderType }) {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      {type === "delivery" ? (
        <Truck className="w-3.5 h-3.5" />
      ) : (
        <ShoppingBag className="w-3.5 h-3.5" />
      )}
      <span className="text-xs font-medium capitalize">{type}</span>
    </div>
  );
}
export function formatNaira(amount: number) {
  return `₦ ${amount.toLocaleString("en-NG")}`;
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusTrack | "all">(
    "all",
  );
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const ITEMS_PER_PAGE = 10;

  const filtered = mockOrders.filter((order) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "completed" &&
        (order.status === "delivered" || order.status === "cancelled")) ||
      order.type === activeTab;

    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesTab && matchesSearch && matchesStatus;
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "delivery", label: "Delivery" },
    { key: "pickup", label: "Pickup" },
    { key: "completed", label: "Completed" },
  ];

  const totalEntries = 2451;
  const startEntry = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endEntry = Math.min(currentPage * ITEMS_PER_PAGE, totalEntries);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-[#FFFDF9] border border-[#8B0000]/20 rounded-2xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-colors ${
                activeTab === tab.key
                  ? "bg-[#8B0000] text-[#FFFDF9]"
                  : "text-text-muted hover:text-[#8B0000]"
              }`}
            >
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search orders or customers..."
          />

          <div className="relative">
            <button
              onClick={() => setShowStatusMenu((p) => !p)}
              className="flex items-center gap-2 px-4 py-3 bg-[#FFFDF9] border border-[#8B0000]/30 rounded-2xl text-xs font-bold text-text-muted hover:border-[#8B0000]/60 transition-colors tracking-wider whitespace-nowrap"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h18M6 8h12M9 12h6"
                />
              </svg>
              {statusFilter === "all" ? "STATUS" : statusFilter.toUpperCase()}
            </button>

            {showStatusMenu && (
              <div className="absolute right-0 top-12 w-44 bg-[#FFFDF9] border border-[#8B0000]/20 rounded-xl shadow-lg z-20 py-1.5">
                {(
                  [
                    "all",
                    "pending",
                    "confirmed",
                    "ready",
                    "delivered",
                    "cancelled",
                  ] as const
                ).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setShowStatusMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-xs font-bold text-left capitalize tracking-wider transition-colors ${
                      statusFilter === s
                        ? "text-[#8B0000] bg-[#8B0000]/5"
                        : "text-text-muted hover:bg-gray-50"
                    }`}
                  >
                    {s === "all" ? "ALL STATUSES" : s.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#FFFDF9] rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#8B0000]/20 bg-gray-50/50 text-text-muted font-bold tracking-wider">
                <th className="py-4 px-6">ORDER ID</th>
                <th className="py-4 px-6">TYPE</th>
                <th className="py-4 px-6">CUSTOMER</th>
                <th className="py-4 px-6">ITEMS</th>
                <th className="py-4 px-6">TOTAL</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6">DATE</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#8B0000]/10">
              {filtered.map((order) => (
                <tr
                  onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                  key={order.id}
                  className="hover:bg-gray-50/60 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-6 font-bold text-brand-red-light">
                    #{order.id}
                  </td>

                  <td className="py-4 px-6">
                    <TypeCell type={order.type} />
                  </td>

                  <td className="py-4 px-6 font-medium text-gray-600">
                    {order.customer}
                  </td>

                  <td className="py-4 px-6 font-medium text-gray-600">
                    {order.items}
                  </td>

                  <td className="py-4 px-6 font-bold text-brand-red-light">
                    {formatNaira(order.total)}
                  </td>

                  <td className="py-4 px-6">
                    <StatusBadge status={order.status} />
                  </td>

                  <td className="py-4 px-6 font-medium text-gray-600">
                    {order.date}
                  </td>

                  <td
                    className="py-4 px-6 text-right relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === order.id ? null : order.id,
                        )
                      }
                      className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {activeDropdown === order.id && (
                      <div className="absolute right-6 top-12 w-40 bg-[#FFFDF9] border border-gray-100 rounded-xl shadow-lg z-20 py-1.5 text-left">
                        <button className="w-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Eye className="w-3.5 h-3.5 text-gray-500" />
                          View Details
                        </button>
                        <button className="w-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                          Update Status
                        </button>
                        <button className="w-full px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-16 text-center text-gray-400 text-sm"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-100 text-xs">
          <span className="text-gray-500 font-medium">
            Showing {startEntry}–{endEntry} of {totalEntries.toLocaleString()}{" "}
            orders
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-100 text-gray-400 font-bold rounded-lg disabled:cursor-not-allowed text-[10px] tracking-wider hover:bg-gray-200 transition-colors disabled:hover:bg-gray-100"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 font-bold rounded-lg text-[10px] tracking-wider transition-colors ${
                  currentPage === page
                    ? "bg-[#8B0000] text-[#FFFDF9]"
                    : "bg-[#FFFDF9] border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <span className="px-2 text-gray-400">...</span>

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-[#FFFDF9] border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-lg text-[10px] tracking-wider transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
