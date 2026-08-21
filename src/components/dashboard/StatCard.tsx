import { LucideIcon, TrendingUp, AlertCircle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  isWarning?: boolean;
  isRealtime?: boolean;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  isWarning,
  isRealtime,
}: StatCardProps) {
  return (
    <div className="relative bg-[#FFFDF9] p-5 rounded-2xl border border-[#EFE6DC] shadow-xs flex justify-between items-start overflow-hidden">
      
      <div className="space-y-2 relative z-10">
        <span className="text-[11px] font-bold text-[#8A6865] tracking-wider uppercase">
          {title}
        </span>
        <p className="text-3xl font-extrabold text-[#6F352E] tracking-tight">{value}</p>

        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {!isWarning && !isRealtime && (
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          )}
          {isWarning && <AlertCircle className="w-4 h-4 text-amber-600" />}
          <span
            className={
              isWarning
                ? "text-amber-600"
                : isRealtime
                ? "text-indigo-600"
                : "text-emerald-600"
            }
          >
            {change}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl">
        <Icon className="w-6 h-6 text-[#6F352E]" />
      </div>

      <div className="absolute right-1 top-2 opacity-[0.06] text-[#5C1D13] pointer-events-none">
        <Icon className="w-16 h-16" />
      </div>
    </div>
  );
}