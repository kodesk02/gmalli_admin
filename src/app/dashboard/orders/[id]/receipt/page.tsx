// app/orders/[id]/receipt/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer, CheckCircle2 } from "lucide-react";
import { mockOrders } from "@/lib/data";
import { formatNaira } from "../../page";

export default function ReceiptPage() {
  const { id } = useParams();
  const router = useRouter();
  const order = mockOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
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

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* ── Header (hidden on print) ── */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#8B0000] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8B0000] hover:bg-[#A52020] text-[#FFFDF9] text-xs font-bold rounded-xl tracking-wider transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          Print
        </button>
      </div>

      {/* ── Receipt ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6 print:shadow-none print:border-0">
        {/* Brand + status */}
        <div className="flex items-start justify-between pb-6 border-b border-dashed border-gray-200">
          <div>
            <p className="text-sm font-bold text-[#8B0000] tracking-wide">
              RECEIPT
            </p>
            <p className="text-xs text-gray-400 font-medium mt-1">
              #{order.id} &middot; {order.date}
            </p>
          </div>
          {order.status === "delivered" && (
            <div className="flex items-center gap-1.5 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px] font-bold tracking-wider">
                PAID
              </span>
            </div>
          )}
        </div>

        {/* Customer */}
        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-dashed border-gray-200 text-xs">
          <div>
            <p className="text-gray-400 font-medium mb-1">Customer</p>
            <p className="font-bold text-[#111111]">{order.customer}</p>
            <p className="text-gray-500 mt-0.5">{order.phone}</p>
          </div>
          <div>
            <p className="text-gray-400 font-medium mb-1">
              {order.type === "delivery" ? "Delivery Address" : "Pickup Code"}
            </p>
            <p className="font-bold text-[#111111] leading-relaxed">
              {order.type === "delivery" ? order.address : order.pickupCode}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#8B0000]/10 text-[#8B0000] text-[10px] font-bold flex items-center justify-center shrink-0">
                  {item.qty}
                </span>
                <span className="text-gray-600 font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-[#111111]">
                {formatNaira(item.price * item.qty)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="pt-6 border-t border-dashed border-gray-200 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 tracking-wider">
            TOTAL
          </span>
          <span className="text-lg font-bold text-[#8B0000]">
            {formatNaira(order.total)}
          </span>
        </div>

        <p className="text-center text-[10px] text-gray-300 pt-4">
          Thank you for your order
        </p>
      </div>
    </div>
  );
}