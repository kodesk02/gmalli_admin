"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Tag,
  Layers,
  Building2,
  Loader2,
  X,
  Save,
} from "lucide-react";
import {
  useDeleteProduct,
  useProduct,
  useUpdateProduct,
} from "@/hooks/useProducts";
import { useRouter } from "next/navigation";
import { ProductFormData } from "@/lib/types";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading, isError } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: updateProduct, isPending } = useUpdateProduct();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    brand: "",
    category: "",
    tags: [],
    price: 0,
    price_range: "",
    description: "",
    in_stock: true,
  });

  const handleStartEditing = () => {
    if (product) {
      setFormData({
        name: product.name || "",
        brand: product.brand || "",
        category: product.category || "",
        tags: product.tags || [],
        price: product.price || 0,
        price_range: product.price_range || "",
        description: product.description || "",
        in_stock: product.in_stock ?? true,
      });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProduct(
      {
        id,
        data: formData,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B0000]" />
        <p className="text-xs text-gray-500 font-medium">
          Loading product details...
        </p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="bg-surface p-8 rounded-2xl border border-gray-100 text-center space-y-4 max-w-md mx-auto mt-10">
        <h2 className="text-base font-bold text-gray-800">Product Not Found</h2>
        <p className="text-xs text-gray-500">
          No product found matching ID: {id}
        </p>
        <Link
          href="/dashboard/products"
          className="inline-block px-5 py-2.5 bg-[#8B0000] text-surface text-xs font-bold rounded-xl transition-colors hover:bg-brand-red-light"
        >
          Back to Products 
        </Link>
      </div>
    );
  }

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(`Delete "${name}"? It will also disappear from the store.`)
    ) {
      try {
        await deleteProduct(id);
        router.push("/dashboard/products");
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/products"
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#8B0000] tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO PRODUCTS
        </Link>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <X className="w-3.5 h-3.5" /> CANCEL
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="px-4 py-2 bg-[#8B0000] text-surface rounded-xl text-xs font-bold hover:bg-red-900 transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                SAVE CHANGES
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleStartEditing}
                className="px-4 py-2 bg-surface border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-xs"
              >
                <Edit2 className="w-3.5 h-3.5" /> EDIT
              </button>
              <button
                onClick={() => handleDelete(product.id, product.name)}
                className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" /> DELETE
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Product Display Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Image */}
        <div className="lg:col-span-5 bg-surface p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-center">
          <div className="w-full h-80 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 relative">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Info from Selected ID */}
        <div className="lg:col-span-7 bg-surface p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs space-y-6">
          {/* Header & Status */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 w-full">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-[10px] font-bold text-text-muted tracking-wider uppercase flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-[#8B0000]" />{" "}
                    {product.category}
                  </span>
                  <h1 className="text-2xl font-bold text-text-primary">
                    {product.name}
                  </h1>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    Brand:{" "}
                    <span className="font-semibold text-gray-800">
                      {product.brand}
                    </span>
                  </p>
                </>
              )}
            </div>

            {isEditing ? (
              <label className="flex items-center gap-2 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) =>
                    setFormData({ ...formData, in_stock: e.target.checked })
                  }
                  className="rounded border-gray-300 text-[#8B0000] focus:ring-[#8B0000]"
                />
                <span className="text-[10px] font-bold text-gray-700 uppercase">
                  In Stock
                </span>
              </label>
            ) : (
              <>
                <span
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider uppercase shrink-0 ${
                    product.in_stock
                      ? "bg-emerald-100/80 text-emerald-700"
                      : "bg-rose-100/80 text-rose-700"
                  }`}
                >
                  {product.in_stock ? "IN STOCK" : "OUT OF STOCK"}
                </span>
              </>
            )}
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-xl bg-brand-cream border border-gray-100 space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              UNIT PRICE
            </p>
            {isEditing ? (
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-lg font-bold text-[#8B0000]"
              />
            ) : (
              <p className="text-2xl font-bold text-[#8B0000]">
                ₦{product.price?.toLocaleString()}
              </p>
            )}
            {isEditing ? (
              <input
                type="text"
                value={formData.price_range}
                onChange={(e) =>
                  setFormData({ ...formData, price_range: e.target.value })
                }
                placeholder="e.g. ₦10,000 - ₦15,000"
                className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700"
              />
            ) : (
              product.price_range && (
                <p className="text-xs text-gray-500 font-medium">
                  Range:{" "}
                  <span className="text-gray-700 font-semibold">
                    {product.price_range}
                  </span>
                </p>
              )
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                DESCRIPTION
              </p>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs leading-relaxed"
                />
              ) : (
                <p className="text-xs text-gray-600 leading-relaxed">
                  {product.description || "No description provided."}
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3" /> TAGS
              </p>
              {isEditing ? (
                <div>
                <input
                  type="text"
                  value={formData.tags.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g. electronics, wireless, accessories"
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs"
                />
                <p className="text-[10px] text-gray-400 mt-1">Separate multiple tags with commas</p>
              </div>
              ) : (
                product.tags &&
                product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
