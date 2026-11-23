"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCreateProduct } from "@/hooks/useProducts";
import { ImageUploadSection } from "../ImageSelection";
import { ProductBasicFields } from "./ProductBasicFields";
import { ProductPricingFields } from "./ProductPricingFields";
import { PublishingPanel } from "./PublishingPanel";
import { toProductInput } from "./productFormData";

interface AddProductModalProps {
  isOpen: boolean; 
  onClose: () => void;
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [inStock, setInStock] = useState(true);
  const { mutate: createProduct, isPending } = useCreateProduct();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); 

  if (!isOpen) return null;

  const close = () => {
    setTags([]);
    setInStock(true);
    setImageUrl(null);
    setIsUploading(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUploading) return;
    const payload = toProductInput(
      new FormData(e.currentTarget),
      tags,
      inStock,
      imageUrl,
    );
    createProduct(payload, { onSuccess: close });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-brand-red-muted/40 p-4 backdrop-blur-xs sm:p-6">
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
        className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-3xl bg-brand-cream p-6 shadow-2xl sm:p-8"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border pb-4">
          <h2
            id="add-product-title"
            className="text-xl font-bold text-foreground"
          >
            Add Product
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden pr-1 pt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <ProductBasicFields tags={tags} onTagsChange={setTags} />
              <ProductPricingFields />
            </div>
            <div className="space-y-6 lg:col-span-5">
              <ImageUploadSection onChange={setImageUrl} onUploadingChange={setIsUploading}/>
              <PublishingPanel
                inStock={inStock}
                onInStockChange={setInStock}
                isPending={isPending || isUploading}
                onCancel={close}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
