"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { initialProducts } from "@/lib/data";
import Image from "next/image";
import { AddProductModal } from "@/components/products/modals/AddProductModal";
import { SearchInput } from "@/components/SearchInput";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Search Bar & Add Button Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search products, brands, or SKUs..."
        />

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3 bg-[#8B0000] hover:bg-brand-red-light text-[#FFFDF9] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors tracking-wider"
        >
          <Plus className="w-4 h-4" /> ADD PRODUCT
        </button>
      </div>

      {/* Products Table Card */}
      <div className="bg-[#FFFDF9] rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#8B0000]/20 bg-gray-50/50 text-[#8A6865] font-bold tracking-wider">
                <th className="py-4 px-6">PRODUCT</th>
                <th className="py-4 px-6">BRAND</th>
                <th className="py-4 px-6">CATEGORY</th>
                <th className="py-4 px-6">PRICE</th>
                <th className="py-4 px-6">STOCK STATUS</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8B0000]/20">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  onClick={() =>
                    router.push(`/dashboard/products/${product.id}`)
                  }
                  className="hover:bg-gray-50/60 cursor-pointer transition-colors"
                >
                  {/* Product Column */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          width={100}
                          height={100}
                        />
                      </div>
                      <span className="font-bold text-text-primary">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-medium text-gray-600">
                    {product.brand}
                  </td>

                  <td className="py-4 px-6 font-medium text-gray-600">
                    {product.category}
                  </td>

                  <td className="py-4 px-6 font-bold text-text-primary">
                    {product.price}
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider uppercase inline-block ${
                        product.inStock
                          ? "bg-emerald-100/80 text-emerald-700"
                          : "bg-rose-100/80 text-rose-700"
                      }`}
                    >
                      {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
                    </span>
                  </td>

                  {/* Actions Dropdown */}
                  <td
                    className="py-4 px-6 text-right relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === product.id ? null : product.id,
                        )
                      }
                      className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {activeDropdown === product.id && (
                      <div className="absolute right-6 top-12 w-36 bg-[#FFFDF9] border border-gray-100 rounded-xl shadow-lg z-20 py-1.5 text-left">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/products/${product.id}`)
                          }
                          className="w-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Eye className="w-3.5 h-3.5 text-gray-500" /> View
                          Details
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/dashboard/products/${product.id}`)
                          }
                          className="w-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit className="w-3.5 h-3.5 text-gray-500" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setProducts(
                              products.filter((p) => p.id !== product.id),
                            );
                            setActiveDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />{" "}
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-100 text-xs">
          <span className="text-gray-500 font-medium">
            Showing 1-{filteredProducts.length} of {products.length} products
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled
              className="px-4 py-2 bg-gray-100 text-gray-400 font-bold rounded-lg cursor-not-allowed text-[10px] tracking-wider"
            >
              PREV
            </button>
            <button className="px-4 py-2 bg-[#FFFDF9] border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-lg text-[10px] tracking-wider transition-colors">
              NEXT
            </button>
          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
