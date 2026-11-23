import { ChevronDown } from "lucide-react";
import { FormField, FormSection, fieldClass } from "@/components/ui/form";
import { PRODUCT_CATEGORIES } from "@/lib/data";
import { TagInput } from "./TagInputs";

interface ProductBasicFieldsProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function ProductBasicFields({ tags, onTagsChange }: ProductBasicFieldsProps) {
  return (
    <FormSection title="Basic Information">
      <FormField label="Product name">
        {(id) => (
          <input id={id} name="name" type="text" required maxLength={120}
            placeholder="e.g. Fresh Tomatoes (1kg)" className={fieldClass} />
        )}
      </FormField>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField label="Brand">
          {(id) => (
            <input id={id} name="brand" type="text" required maxLength={80}
              placeholder="e.g. Farm Fresh" className={fieldClass} />
          )}
        </FormField>

        <FormField label="Category">
          {(id) => (
            <div className="relative">
              <select id={id} name="category" required defaultValue=""
                className={`${fieldClass} appearance-none pr-10`}>
                <option value="" disabled>Select category...</option>
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown aria-hidden
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          )}
        </FormField>
      </div>

      <TagInput tags={tags} onChange={onTagsChange} />
    </FormSection>
  );
}