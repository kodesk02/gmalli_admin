import { Save } from "lucide-react";
import { FormSection } from "@/components/ui/form";
import { StockToggle } from "./StockToggle";

interface PublishingPanelProps {
  inStock: boolean;
  onInStockChange: (inStock: boolean) => void;
  isPending: boolean;
  onCancel: () => void;
}

export function PublishingPanel({ inStock, onInStockChange, isPending, onCancel }: PublishingPanelProps) {
  return (
    <FormSection title="Publishing">
      <StockToggle checked={inStock} onChange={onInStockChange} />
      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save aria-hidden className="h-4 w-4" />
          {isPending ? "Publishing..." : "Publish"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="block w-full py-2 text-center text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </FormSection>
  );
}