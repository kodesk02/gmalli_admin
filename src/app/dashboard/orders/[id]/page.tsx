"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Truck,
  ShoppingBag,
  MapPin,
  Phone,
  User,
  Calendar,
  Package,
  ChevronDown,
  Check,
} from "lucide-react";
import { mockOrders } from "@/lib/data";
import { OrderStatusTrack } from "@/lib/types";
import { toast } from "sonner";
import { formatNaira, statusConfig } from "../page";

const statusFlow: OrderStatusTrack[] = [
  "pending",
  "confirmed",
  "ready",
  "delivered",
];

function StatusProgress({ current }: { current: OrderStatusTrack }) {
  if (current === "cancelled") {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl">
        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
        <span className="text-xs font-bold text-rose-700 tracking-wider">
          ORDER CANCELLED
        </span>
      </div>
    );
  }

  const currentIndex = statusFlow.indexOf(current);

  return (
    <div className="flex items-center gap-2">
      {statusFlow.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const isPending = i > currentIndex;

        return (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              {/* Step dot */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                  isDone
                    ? "bg-[#8B0000] border-[#8B0000]"
                    : isActive
                      ? "bg-white border-[#8B0000]"
                      : "bg-white border-gray-200"
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : isActive ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B0000]" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                )}
              </div>

              {/* Step label */}
              <span
                className={`text-[10px] font-bold tracking-wider capitalize text-center ${
                  isDone || isActive ? "text-[#8B0000]" : "text-gray-300"
                }`}
              >
                {step.toUpperCase()}
              </span>
            </div>

            {/* Connector line */}
            {i < statusFlow.length - 1 && (
              <div
                className={`h-0.5 flex-1 mb-4 rounded-full transition-colors ${
                  i < currentIndex ? "bg-[#8B0000]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const order = mockOrders.find((o) => o.id === id);

  const [status, setStatus] = useState<OrderStatusTrack>(
    order?.status ?? "pending",
  );
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Package className="w-12 h-12 text-gray-300" />
        <p className="text-gray-400 text-sm font-medium">Order not found</p>
        <button
          onClick={() => router.back()}
          className="text-xs text-[#8B0000] font-bold hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const config = statusConfig[status];
  const allStatuses = Object.keys(statusConfig) as OrderStatusTrack[];
  const hasChanged = status !== order.status;

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    toast.success(
      `Order #${order.id} updated to ${statusConfig[status].label}`,
    );
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Back + Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-xs text-text-muted font-bold tracking-wider">
              ORDER
            </p>
            <h1 className="text-xl font-bold text-brand-red">#{order.id}</h1>
          </div>
        </div>

        {/* Type badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#FFFDF9] border border-[#8B0000]/20 rounded-xl">
          {order.type === "delivery" ? (
            <Truck className="w-4 h-4 text-[#8B0000]" />
          ) : (
            <ShoppingBag className="w-4 h-4 text-[#8B0000]" />
          )}
          <span className="text-xs font-bold text-[#8B0000] tracking-wider capitalize">
            {order.type.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column (wider) ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="bg-[#FFFDF9] rounded-2xl border border-gray-100 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-text-muted tracking-wider">
                ORDER STATUS
              </h2>
              <span
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${config.className}`}
              >
                {config.label}
              </span>
            </div>

            {/* Progress */}
            <StatusProgress current={status} />

            {/* Status Editor */}
            <div className="pt-4 border-t border-[#8B0000]/10">
              <p className="text-xs font-bold text-text-muted tracking-wider mb-3">
                UPDATE STATUS
              </p>
              <div className="flex items-center gap-3">
                {/* Dropdown */}
                <div className="relative flex-1">
                  <button
                    onClick={() => setShowStatusMenu((p) => !p)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#8B0000]/30 rounded-xl text-xs font-bold text-brand-red hover:border-[#8B0000]/60 transition-colors"
                  >
                    <span>{config.label}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showStatusMenu && (
                    <div className="absolute top-12 left-0 right-0 bg-[#FFFDF9] border border-[#8B0000]/20 rounded-xl shadow-lg z-20 py-1.5">
                      {allStatuses.map((s) => {
                        const sc = statusConfig[s];
                        return (
                          <button
                            key={s}
                            onClick={() => {
                              setStatus(s);
                              setShowStatusMenu(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold tracking-wider transition-colors hover:bg-gray-50 ${
                              status === s ? sc.className : "text-gray-500"
                            }`}
                          >
                            {sc.label}
                            {status === s && <Check className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Save button */}
                <button
                  onClick={handleSave}
                  disabled={!hasChanged || isSaving}
                  className="px-6 py-3 bg-[#8B0000] hover:bg-brand-red-light disabled:opacity-40 disabled:cursor-not-allowed text-[#FFFDF9] text-xs font-bold rounded-xl tracking-wider transition-colors"
                >
                  {isSaving ? "SAVING..." : "SAVE"}
                </button>
              </div>
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-[#FFFDF9] rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#8B0000]/10">
              <h2 className="text-xs font-bold text-text-muted tracking-wider">
                ORDER ITEMS ({order.items})
              </h2>
            </div>

            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50/50 border-b border-[#8B0000]/10 text-text-muted font-bold tracking-wider">
                  <th className="py-3 px-6 text-left">PRODUCT</th>
                  <th className="py-3 px-6 text-center">QTY</th>
                  <th className="py-3 px-6 text-right">PRICE</th>
                  <th className="py-3 px-6 text-right">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8B0000]/10">
                {order.orderItems.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50/40 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-brand-red">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-6 text-center text-gray-500 font-medium">
                      {item.qty}
                    </td>
                    <td className="py-3.5 px-6 text-right text-gray-500 font-medium">
                      {formatNaira(item.price)}
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-brand-red">
                      {formatNaira(item.price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#8B0000]/20 bg-gray-50/50">
                  <td
                    colSpan={3}
                    className="py-4 px-6 font-bold text-text-muted tracking-wider text-right"
                  >
                    TOTAL
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-[#8B0000] text-sm">
                    {formatNaira(order.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-[#FFFDF9] rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-xs font-bold text-text-muted tracking-wider">
              CUSTOMER
            </h2>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8B0000]/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[#8B0000]" />
              </div>
              <div>
                <p className="font-bold text-brand-red text-sm">
                  {order.customer}
                </p>
                <p className="text-xs text-gray-500">Guest Customer</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-[#8B0000]/10">
              <div className="flex items-start gap-3">
                <Phone className="w-3.5 h-3.5 text-[#8B0000] mt-0.5 shrink-0" />
                <p className="text-xs text-gray-600 font-medium">
                  {order.phone}
                </p>
              </div>
              {order.type === "delivery" && order.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-3.5 h-3.5 text-[#8B0000] mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    {order.address}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-[#FFFDF9] rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-xs font-bold text-text-muted tracking-wider">
              ORDER INFO
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Date</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-red">
                  <Calendar className="w-3.5 h-3.5 text-[#8B0000]" />
                  {order.date}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Items</span>
                <span className="text-xs font-bold text-brand-red">
                  {order.items} products
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Type</span>
                <span className="text-xs font-bold text-brand-red capitalize">
                  {order.type}
                </span>
              </div>

              {order.type === "pickup" && order.pickupCode && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">
                    Pickup Code
                  </span>
                  <code className="text-xs font-bold text-[#8B0000] bg-[#8B0000]/10 px-2 py-1 rounded-lg tracking-widest">
                    {order.pickupCode}
                  </code>
                </div>
              )}

              <div className="pt-3 border-t border-[#8B0000]/10 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Total</span>
                <span className="text-sm font-bold text-[#8B0000]">
                  {formatNaira(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
