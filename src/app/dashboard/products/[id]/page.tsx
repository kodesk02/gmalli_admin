"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Edit2, Trash2, Tag, Layers, Building2 } from "lucide-react";
import { initialProducts } from "@/lib/data";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = initialProducts.find((p) => p.id === id);
  if (!product) {
    return (
      <div className="bg-[#FFFDF9] p-8 rounded-2xl border border-gray-100 text-center space-y-4 max-w-md mx-auto mt-10">
        <h2 className="text-base font-bold text-gray-800">Product Not Found</h2>
        <p className="text-xs text-gray-500">No product found matching ID: {id}</p>
        <Link
          href="/dashboard/products"
          className="inline-block px-5 py-2.5 bg-[#8B0000] text-[#FFFDF9] text-xs font-bold rounded-xl transition-colors hover:bg-brand-red-light"
        >
          Back to Products
        </Link>
      </div>
    );
  }

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
          <button className="px-4 py-2 bg-[#FFFDF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-xs">
            <Edit2 className="w-3.5 h-3.5" /> EDIT
          </button>
          <button className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5" /> DELETE
          </button>
        </div>
      </div>

      {/* Main Product Display Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Product Image */}
        <div className="lg:col-span-5 bg-[#FFFDF9] p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-center">
          <div className="w-full h-80 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 relative">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          </div>
        </div>

        {/* Right Column: Dynamic Info from Selected ID */}
        <div className="lg:col-span-7 bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs space-y-6">
          
          {/* Header & Status */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#8A6865] tracking-wider uppercase flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-[#8B0000]" /> {product.category}
              </span>
              <h1 className="text-2xl font-bold text-text-primary">{product.name}</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                Brand: <span className="font-semibold text-gray-800">{product.brand}</span>
              </p>
            </div>

            <span
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider uppercase shrink-0 ${
                product.inStock
                  ? "bg-emerald-100/80 text-emerald-700"
                  : "bg-rose-100/80 text-rose-700"
              }`}
            >
              {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
            </span>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-xl bg-brand-cream border border-gray-100 space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              UNIT PRICE
            </p>
            <p className="text-2xl font-bold text-[#8B0000]">{product.price}</p>
            {product.bulkPrice && (
              <p className="text-xs text-gray-500 font-medium">
                Bulk Range: <span className="text-gray-700 font-semibold">{product.bulkPrice}</span>
              </p>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                DESCRIPTION
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-[#8A6865] uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3" /> TAGS
              </p>
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
            </div>
          )}

        </div>

      </div>
    </div>
  );
}