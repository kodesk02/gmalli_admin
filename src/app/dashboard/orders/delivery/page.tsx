"use client";

import { useState } from "react";
import {
  Phone,
  MapPin,
  User,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { Order, OrderStatusTrack } from "@/lib/types";
import { SearchInput } from "@/components/SearchInput";
import { toast } from "sonner";
import { mockOrders } from "@/lib/data";
import { useRouter } from "next/navigation";

// ─── Delivery-specific status flow ───────────────────────
type DeliveryStatus = "pending" | "confirmed" | "en_route" | "delivered";

const deliverySteps: { key: DeliveryStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "en_route", label: "En Route" },
  { key: "delivered", label: "Delivered" },
];

// Map from Order status → DeliveryStatus
const toDeliveryStatus = (s: OrderStatusTrack): DeliveryStatus => {
  if (s === "confirmed") return "confirmed";
  if (s === "ready") return "en_route";
  if (s === "delivered") return "delivered";
  return "pending";
};

const statusColors: Record<DeliveryStatus, string> = {
  pending: "text-amber-500",
  confirmed: "text-blue-500",
  en_route: "text-[#8B0000]",
  delivered: "text-emerald-500",
};

const statusLabels: Record<DeliveryStatus, string> = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  en_route: "OUT FOR DELIVERY",
  delivered: "DELIVERED",
};

const progressPercent: Record<DeliveryStatus, number> = {
  pending: 8,
  confirmed: 38,
  en_route: 68,
  delivered: 100,
};

const progressColor: Record<DeliveryStatus, string> = {
  pending: "bg-amber-400",
  confirmed: "bg-blue-500",
  en_route: "bg-[#8B0000]",
  delivered: "bg-emerald-500",
};

function formatNaira(amount: number) {
  return `₦ ${amount.toLocaleString("en-NG")}`;
}

// ─── Progress Bar ─────────────────────────────────────────
function DeliveryProgress({ status }: { status: DeliveryStatus }) {
  const currentIndex = deliverySteps.findIndex((s) => s.key === status);

  return (
    <div className="space-y-2">
      {/* Step labels */}
      <div className="flex justify-between">
        {deliverySteps.map((step, i) => (
          <span
            key={step.key}
            className={`text-[10px] font-bold tracking-wide ${
              i <= currentIndex ? statusColors[status] : "text-gray-300"
            }`}
          >
            {step.label}
          </span>
        ))}
      </div>

      {/* Bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressColor[status]}`}
          style={{ width: `${progressPercent[status]}%` }}
        />
      </div>
    </div>
  );
}

// ─── Update Status Dropdown ───────────────────────────────
const updateOptions: { key: DeliveryStatus; label: string }[] = [
  { key: "confirmed", label: "Confirmed" },
  { key: "en_route", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

function UpdateDropdown({
  current,
  onUpdate,
}: {
  current: DeliveryStatus;
  onUpdate: (s: DeliveryStatus) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#8B0000] hover:bg-[#A52020] text-[#FFFDF9] text-xs font-bold rounded-xl tracking-wider transition-colors"
      >
        Update
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute bottom-12 left-0 w-48 bg-[#FFFDF9] border border-[#8B0000]/20 rounded-xl shadow-lg z-30 py-1.5">
          {updateOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                onUpdate(opt.key);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold tracking-wide transition-colors hover:bg-gray-50 ${
                current === opt.key ? statusColors[opt.key] : "text-gray-500"
              }`}
            >
              {opt.label}
              {current === opt.key && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Delivery Card ────────────────────────────────────────
function DeliveryCard({ order }: { order: Order }) {
  const router = useRouter()
  const [status, setStatus] = useState<DeliveryStatus>(
    toDeliveryStatus(order.status),
  );
  const [expanded, setExpanded] = useState(false);
  const isDelivered = status === "delivered";

  const handleUpdate = (next: DeliveryStatus) => {
    setStatus(next);
    toast.success(`#${order.id} updated to ${statusLabels[next]}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      {/* ── Card Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-[#111111] text-sm tracking-wide">
            #{order.id}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            {order.date}, 09:15 AM
          </p>
        </div>
        <span
          className={`text-[10px] font-bold tracking-widest ${statusColors[status]}`}
        >
          {statusLabels[status]}
        </span>
      </div>

      {/* ── Progress ── */}
      <DeliveryProgress status={status} />

      <div className="border-t border-gray-100" />

      {/* ── Customer Info ── */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-sm font-bold text-[#111111]">
            {order.customer}
          </span>
        </div>

        <div className="flex items-center gap-2 pl-1">
          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-xs text-gray-500 font-medium">
            {order.phone}
          </span>
        </div>

        {order.address && (
          <div className="flex items-start gap-2 pl-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <span className="text-xs text-gray-500 font-medium leading-relaxed">
              {order.address}
            </span>
          </div>
        )}
      </div>

      {/* ── Items Accordion ── */}
      <div className="bg-brand-cream rounded-xl overflow-hidden border border-gray-100">
        <button
          onClick={() => setExpanded((p) => !p)}
          className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-[#111111]"
        >
          <span>
            {order.items} {order.items === 1 ? "Item" : "Items"}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#111111]">
              {formatNaira(order.total)}
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="border-t border-brand-red divide-y divide-gray-100">
            {order.orderItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#8B0000]/10 text-[#8B0000] text-[10px] font-bold flex items-center justify-center">
                    {item.qty}
                  </span>
                  <span className="text-xs text-gray-600 font-medium">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#111111]">
                  {formatNaira(item.price * item.qty)}
                </span>
              </div>
            ))}

            <div className="flex items-center justify-between px-4 py-3 bg-[#FAF5F0]">
              <span className="text-xs font-bold text-gray-500 tracking-wider">
                TOTAL
              </span>
              <span className="text-xs font-bold text-[#8B0000]">
                {formatNaira(order.total)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex items-center gap-3 pt-1">
        <a
          href={`tel:${order.phone}`}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold tracking-wide transition-colors ${
            isDelivered
              ? "border-gray-100 text-gray-300 cursor-not-allowed pointer-events-none"
              : "border-gray-200 text-[#111111] hover:bg-gray-50"
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          Call
        </a>

        {isDelivered ? (
          <button
            onClick={() => router.push(`/dashboard/orders/${order.id}/receipt`)}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#111111] hover:bg-gray-50 tracking-wide transition-colors"
          >
            View Receipt
          </button>
        ) : (
          <div className="flex-1 flex justify-center">
            <UpdateDropdown current={status} onUpdate={handleUpdate} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default function DeliveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState<DeliveryStatus | "all">(
    "all",
  );

  // Only delivery orders
  const deliveryOrders = mockOrders.filter((o) => o.type === "delivery");

  const filtered = deliveryOrders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || toDeliveryStatus(order.status) === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* ── Page Title + Search ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#111111]">
            Active Deliveries
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Manage ongoing dispatch orders across Ibadan zones.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search Order ID, Name..."
          />

          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilter((p) => !p)}
              className="flex items-center gap-2 px-4 py-3 bg-[#FFFDF9] border border-[#8B0000]/30 rounded-2xl text-xs font-bold text-[#8A6865] hover:border-[#8B0000]/60 transition-colors tracking-wider"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter
            </button>

            {showFilter && (
              <div className="absolute right-0 top-12 w-44 bg-[#FFFDF9] border border-[#8B0000]/20 rounded-xl shadow-lg z-20 py-1.5">
                {(
                  [
                    { key: "all", label: "ALL" },
                    { key: "pending", label: "PENDING" },
                    { key: "confirmed", label: "CONFIRMED" },
                    { key: "en_route", label: "OUT FOR DELIVERY" },
                    { key: "delivered", label: "DELIVERED" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setFilterStatus(opt.key);
                      setShowFilter(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold tracking-wider text-left transition-colors hover:bg-gray-50 ${
                      filterStatus === opt.key
                        ? "text-[#8B0000]"
                        : "text-gray-500"
                    }`}
                  >
                    {opt.label}
                    {filterStatus === opt.key && (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((order) => (
            <DeliveryCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Phone className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-sm font-bold text-gray-400">No deliveries found</p>
          <p className="text-xs text-gray-300">
            Try adjusting your search or filter
          </p>
        </div>
      )}
    </div>
  );
}
