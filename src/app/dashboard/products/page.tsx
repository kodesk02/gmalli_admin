"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { AddProductModal } from "@/components/products/modals/AddProductModal";
import { useDebounce } from "@/hooks/useDebounce";
import { useProducts, useToggleStock, useDeleteProduct } from "@/hooks/useProducts";
import { ProductRow } from "./ProductRow";

const PAGE_SIZE = 10;
const COLUMNS = ["PRODUCT", "BRAND", "CATEGORY", "PRICE", "STOCK STATUS"];

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i}>
      <td colSpan={6} className="py-4 px-6">
        <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
      </td>
    </tr>
  ));
}

export default function ProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // The API is only called with the debounced value
  const search = useDebounce(searchQuery);

  const { data, isLoading, isError, error, refetch } = useProducts({
    search,
    page,
    limit: PAGE_SIZE,
  });
  const { mutate: toggleStock } = useToggleStock();
  const { mutate: deleteProduct } = useDeleteProduct();

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1); // a new search always starts at page 1
  };

  const handleDelete = (id: string, name: string) => {
    setActiveDropdown(null);
    if (window.confirm(`Delete "${name}"? It will also disappear from the store.`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchInput
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search products or brands..."
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3 bg-[#8B0000] hover:bg-brand-red-light text-[#FFFDF9] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors tracking-wider"
        >
          <Plus className="w-4 h-4" /> ADD PRODUCT
        </button>
      </div>

      <div className="bg-[#FFFDF9] rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#8B0000]/20 bg-gray-50/50 text-text-muted font-bold tracking-wider">
                {COLUMNS.map((col) => (
                  <th key={col} className="py-4 px-6">{col}</th>
                ))}
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#8B0000]/20">
              {isLoading ? (
                <SkeletonRows />
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <p className="text-sm font-bold text-rose-600">{error.message}</p>
                    <button
                      onClick={() => refetch()}
                      className="mt-3 text-xs font-bold text-[#8B0000] hover:underline"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
                    {search ? `No products match "${search}"` : "No products yet. Add your first one."}
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    isMenuOpen={activeDropdown === product.id}
                    onOpen={() => router.push(`/dashboard/products/${product.id}`)}
                    onToggleMenu={() =>
                      setActiveDropdown(activeDropdown === product.id ? null : product.id)
                    }
                    onToggleStock={() =>
                      toggleStock({ id: product.id, inStock: !product.in_stock })
                    }
                    onDelete={() => handleDelete(product.id, product.name)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-100 text-xs">
          <span className="text-gray-500 font-medium">
            Showing {from}–{to} of {total} products
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-[#FFFDF9] border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-lg text-[10px] tracking-wider transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              PREV
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-[#FFFDF9] border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-lg text-[10px] tracking-wider transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}