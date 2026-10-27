import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { lowStockItems, recentOrders, stats } from "@/lib/data";
import { StatCard } from "@/components/dashboard/StatCard";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            isWarning={stat.isWarning}
            isRealtime={stat.isRealtime}
          />
        ))}
      </div>

      <div className="bg-[#FAF5F0] p-6 rounded-xl border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">
            Performance (7 Days)
          </h2>
          {/* <Link
            href="/dashboard/analytics"
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 tracking-wider"
          >
            DETAILS <ArrowRight className="w-3.5 h-3.5" />
          </Link> */}
        </div>

        <div className="h-48 flex items-end justify-between gap-4 pt-8 px-4">
          {[
            { day: "MON", height: "h-20" },
            { day: "TUE", height: "h-24" },
            { day: "WED", height: "h-14" },
            { day: "THU", height: "h-36" },
            { day: "FRI", height: "h-28" },
            { day: "SAT", height: "h-40" },
            { day: "SUN", height: "h-44" },
          ].map((bar) => (
            <div
              key={bar.day}
              className="flex-1 flex flex-col items-center gap-3"
            >
              <div
                className={`w-full bg-[#C88A85] rounded-lg ${bar.height} transition-all hover:bg-[#8B0000]`}
              />
              <span className="text-[10px] font-bold text-gray-400">
                {bar.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#FAF5F0] p-6 rounded-xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary">Recent Orders</h2>
            <Link
              href="/dashboard/orders"
              className="px-3 py-1.5 text-xs font-bold bg-[#8B0000] text-[#FAF5F0] rounded-lg hover:bg-brand-red-light transition-colors tracking-wider"
            >
              VIEW ALL
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold tracking-wider">
                  <th className="py-3 px-2">ORDER ID</th>
                  <th className="py-3 px-2">CUSTOMER</th>
                  <th className="py-3 px-2">AMOUNT</th>
                  <th className="py-3 px-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="py-4 px-2 font-bold text-primary">
                      {order.id}
                    </td>
                    <td className="py-4 px-2 font-medium text-gray-700">
                      {order.customer}
                    </td>
                    <td className="py-4 px-2 font-bold text-primary">
                      {order.amount}
                    </td>
                    <td className="py-4 px-2">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#FAF5F0] p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-primary">
                  Low Stock Alerts
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600">
                12 ITEMS
              </span>
            </div>

            {/* List */}
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100/70 flex items-center justify-center text-amber-700 font-bold text-xs">
                      📦
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {item.sku}
                      </p>
                      <p className="text-[10px] font-bold text-rose-600 mt-0.5">
                        {item.stock}
                      </p>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-gray-600 hover:text-gray-900 tracking-wider">
                    REORDER
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/dashboard/products"
            className="w-full py-2.5 rounded-lg border border-gray-200 text-center text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors block tracking-wider"
          >
            VIEW ALL INVENTORY
          </Link>
        </div>
      </div>
    </div>
  );
}
