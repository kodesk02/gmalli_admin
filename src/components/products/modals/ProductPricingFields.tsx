import { FormField, FormSection, fieldClass } from "@/components/ui/form";

export function ProductPricingFields() {
  return (
    <FormSection title="Pricing & Details">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField label="Price (₦)">
          {(id) => (
            <input id={id} name="price" type="number" inputMode="decimal"
              min="0" step="any" required placeholder="0.00" className={fieldClass} />
          )}
        </FormField>

        <FormField label="Price range / bulk (optional)">
          {(id) => (
            <input id={id} name="price_range" type="text" maxLength={60}
              placeholder="e.g. Under ₦5,000" className={fieldClass} />
          )}
        </FormField>
      </div>

      <FormField label="Product description">
        {(id) => (
          <textarea id={id} name="description" rows={3} maxLength={1000}
            placeholder="Detailed description of the product..."
            className={`${fieldClass} resize-none`} />
        )}
      </FormField>
    </FormSection>
  );
}