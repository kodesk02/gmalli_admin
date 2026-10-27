"use client";

import { useState } from "react";
import { CheckCircle2, SlidersHorizontal, Check, AlertTriangle } from "lucide-react";
import { mockOrders } from "@/lib/data";
import { Order } from "@/lib/types";
import { SearchInput } from "@/components/SearchInput";
import { toast } from "sonner";

// ─── Helpers ─────────────────────────────────────────────
type CardStatus = "pending" | "expiring" | "collected";

const getCardStatus = (order: Order): CardStatus => {
  if (order.status === "delivered" || order.collectedAt) return "collected";
  if (order.pickupExpires?.toLowerCase().startsWith("today")) return "expiring";
  return "pending";
};

function formatNaira(amount: number) {
  return `₦ ${amount.toLocaleString("en-NG")}`;
}

// ─── Pickup Card ──────────────────────────────────────────
function PickupCard({
  order,
  onCollect,
}: {
  order: Order;
  onCollect: (id: string) => void;
}) {
  const cardStatus = getCardStatus(order);
  const isCollected = cardStatus === "collected";
  const isExpiring  = cardStatus === "expiring";

  return (
    <div
      className={`rounded-2xl border p-5 space-y-4 transition-all ${
        isCollected
          ? "bg-gray-50 border-gray-100 opacity-70"
          : isExpiring
          ? "bg-white border-[#8B0000]/40 shadow-sm shadow-[#8B0000]/10"
          : "bg-white border-gray-100 shadow-sm"
      }`}
    >
      {/* ── Pickup Code ── */}
      <div className="text-center pb-3 border-b border-dashed border-gray-200">
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 mb-1">
          PICKUP CODE
        </p>
        <p
          className={`text-2xl font-bold tracking-widest font-mono ${
            isCollected
              ? "text-gray-300 line-through"
              : isExpiring
              ? "text-[#8B0000]"
              : "text-[#111111]"
          }`}
        >
          {order.pickupCode}
        </p>
      </div>

      {/* ── Details ── */}
      <div className="space-y-3 text-xs">
        <div className="flex items-start justify-between gap-2">
          <span className="text-gray-400 font-medium shrink-0">Customer</span>
          <span className="font-bold text-[#111111] text-right">
            {order.customer}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2">
          <span className="text-gray-400 font-medium shrink-0">Items</span>
          <div className="text-right">
            <p className="font-bold text-[#111111]">
              {order.orderItems
                .map((i) => `${i.qty} ${i.name}`)
                .slice(0, 2)
                .join(", ")}
              {order.orderItems.length > 2 && (
                <span className="text-gray-400">
                  {" "}+{order.orderItems.length - 2} more
                </span>
              )}
            </p>
            <p className="text-gray-400 mt-0.5">Order #{order.id}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-400 font-medium shrink-0">
            {isCollected ? "Status" : "Expires"}
          </span>
          {isCollected ? (
            <span className="text-gray-400 font-medium">
              {order.collectedAt}
            </span>
          ) : isExpiring ? (
            <span className="flex items-center gap-1 text-[#8B0000] font-bold">
              <AlertTriangle className="w-3 h-3" />
              {order.pickupExpires}
            </span>
          ) : (
            <span className="text-[#111111] font-bold">
              {order.pickupExpires}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-400 font-medium shrink-0">Total</span>
          <span className="font-bold text-[#111111]">
            {formatNaira(order.total)}
          </span>
        </div>
      </div>

      {/* ── Action Button ── */}
      {isCollected ? (
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed tracking-wider"
        >
          <CheckCircle2 className="w-4 h-4" />
          COLLECTED
        </button>
      ) : (
        <button
          onClick={() => onCollect(order.id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl tracking-wider transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          MARK AS COLLECTED
        </button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────
type FilterOption = "all" | "pending" | "expiring" | "collected";

const filterOptions: { key: FilterOption; label: string }[] = [
  { key: "all",       label: "ALL"       },
  { key: "pending",   label: "PENDING"   },
  { key: "expiring",  label: "EXPIRING"  },
  { key: "collected", label: "COLLECTED" },
];

export default function PickupPage() {
  const [searchQuery, setSearchQuery]     = useState("");
  const [filter, setFilter]               = useState<FilterOption>("all");
  const [showFilter, setShowFilter]       = useState(false);
  const [orders, setOrders]               = useState(
    mockOrders.filter((o) => o.type === "pickup")
  );

  const handleCollect = (id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status: "delivered" as const, collectedAt: "Just now" }
          : o
      )
    );
    toast.success("Order marked as collected!");
  };

  const filtered = orders.filter((order) => {
    const cardStatus = getCardStatus(order);

    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.pickupCode?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" || cardStatus === filter;

    return matchesSearch && matchesFilter;
  });

  const pendingCount  = orders.filter((o) => getCardStatus(o) === "pending").length;
  const expiringCount = orders.filter((o) => getCardStatus(o) === "expiring").length;

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#111111]">Pickup Orders</h2>
          <div className="flex items-center gap-3 mt-1">
            {pendingCount > 0 && (
              <span className="text-xs text-gray-400 font-medium">
                {pendingCount} awaiting pickup
              </span>
            )}
            {expiringCount > 0 && (
              <>
                <span className="text-gray-200">·</span>
                <span className="text-xs text-[#8B0000] font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {expiringCount} expiring today
                </span>
              </>
            )}
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Scan or enter Pickup Code (e.g., GML-8492-X)"
          />

          <div className="relative">
            <button
              onClick={() => setShowFilter((p) => !p)}
              className="flex items-center gap-2 px-4 py-3 bg-[#FFFDF9] border border-[#8B0000]/30 rounded-2xl text-xs font-bold text-[#8A6865] hover:border-[#8B0000]/60 transition-colors tracking-wider"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              FILTER
            </button>

            {showFilter && (
              <div className="absolute right-0 top-12 w-40 bg-[#FFFDF9] border border-[#8B0000]/20 rounded-xl shadow-lg z-20 py-1.5">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => { setFilter(opt.key); setShowFilter(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold tracking-wider text-left transition-colors hover:bg-gray-50 ${
                      filter === opt.key ? "text-[#8B0000]" : "text-gray-500"
                    }`}
                  >
                    {opt.label}
                    {filter === opt.key && (
                      <Check className="w-3.5 h-3.5 text-[#8B0000]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Cards Grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((order) => (
            <PickupCard
              key={order.id}
              order={order}
              onCollect={handleCollect}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-sm font-bold text-gray-400">No pickup orders found</p>
          <p className="text-xs text-gray-300">
            Try adjusting your search or filter
          </p>
        </div>
      )}
    </div>
  );
}