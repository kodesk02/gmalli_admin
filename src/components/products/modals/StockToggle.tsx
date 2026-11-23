import { cn } from "@/lib/utils";

interface StockToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function StockToggle({ checked, onChange }: StockToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p id="stock-label" className="text-xs font-bold text-foreground">In Stock</p>
        <p className="text-[10px] text-muted-foreground">Toggle product availability</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby="stock-label"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          checked ? "bg-primary" : "bg-muted-foreground/30"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-surface shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}