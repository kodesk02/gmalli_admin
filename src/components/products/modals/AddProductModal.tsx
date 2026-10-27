"use client";

import { useState } from "react";
import { X, Tag, Save, ChevronDown } from "lucide-react";
import { ImageUploadSection } from "../ImageSelection";
import { useCreateProduct } from "@/hooks/useProducts";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [inStock, setInStock] = useState(true);
  const { mutate: createProduct, isPending } = useCreateProduct();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    createProduct(
      {
        name: data.get("name") as string,
        brand: data.get("brand") as string,
        category: data.get("category") as string,
        price: Number(data.get("price")),
        price_range: (data.get("price_range") as string) || null,
        in_stock: inStock,
        tags: tags,
        image: null,
      },
      { onSuccess: onClose }
    );
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };
  

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-red-muted/40 backdrop-blur-xs p-4 sm:p-6 overflow-hidden">
      <form onSubmit={handleSubmit} className="bg-brand-cream rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-text-primary">Add Product</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto pt-6 pr-1 space-y-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <div className="border border-gray-100 rounded-2xl p-5 bg-[#FFFDF9] space-y-4">
                <h3 className="text-sm font-bold text-text-primary">
                  Basic Information
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    PRODUCT NAME
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dangote Cement 50kg"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      BRAND
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dangote"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      CATEGORY
                    </label>
                    <div className="relative">
                      <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-700 appearance-none bg-[#FFFDF9] focus:outline-none focus:ring-1 focus:ring-[#8B0000]">
                        <option value="">Select Category...</option>
                        <option value="kitchen">Kitchen Essentials</option>
                        <option value="snacks">Snacks</option>
                        <option value="hairCare">Haircare</option>
                        <option value="bodyCare">Bodycare</option>
                        <option value="skincare">Skincare</option>
                        <option value="clothing">Clothing</option>
                        <option value="frozen">Frozen Produce</option>
                        <option value="freshProduce">Fresh Produce</option>
                        <option value="eggs">Eggs</option>
                        <option value="essentials">Household Essentials</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    TAGS (MULTI-SELECT)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Type and press enter to add..."
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                    />
                    <Tag className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium flex items-center gap-1.5"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-400 hover:text-gray-600 text-xs"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 rounded-2xl p-5 bg-[#FFFDF9] space-y-4">
                <h3 className="text-sm font-bold text-text-primary">
                  Pricing & Details
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      PRICE
                    </label>
                    <input
                      type="text"
                      placeholder="₦ 0.00"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      PRICE RANGE / BULK (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₦4,500 - ₦5,000"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    PRODUCT DESCRIPTION
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detailed description of the product..."
                    className="w-full p-4 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Image & Publishing */}
            <div className="lg:col-span-5 space-y-6">
              <ImageUploadSection />

              {/* Publishing Section */}
              <div className="border border-gray-100 rounded-2xl p-5 bg-[#FFFDF9] space-y-6">
                <h3 className="text-sm font-bold text-text-primary">Publishing</h3>

                {/* Stock Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-text-primary">In Stock</p>
                    <p className="text-[10px] text-gray-400">
                      Toggle product availability
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setInStock(!inStock)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      inStock ? "bg-[#8B0000]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#FFFDF9] shadow-lg ring-0 transition duration-200 ease-in-out ${
                        inStock ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 bg-[#8B0000] text-[#FFFDF9] text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#8B0000]/90 transition-colors"
                  >
                    <Save className="w-4 h-4" /> 
                    {isPending ? "Publishing..." : "Publish"}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors text-center block"
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
