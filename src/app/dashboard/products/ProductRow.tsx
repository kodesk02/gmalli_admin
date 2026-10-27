import Image from "next/image";
import { MoreHorizontal, Eye, Edit, Trash2, Package } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductRowProps {
  product: Product;
  isMenuOpen: boolean;
  onOpen: () => void;
  onToggleMenu: () => void;
  onToggleStock: () => void;
  onDelete: () => void;
}

export function ProductRow({
  product,
  isMenuOpen,
  onOpen,
  onToggleMenu,
  onToggleStock,
  onDelete,
}: ProductRowProps) {
  return (
    <tr onClick={onOpen} className="hover:bg-gray-50/60 cursor-pointer transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-4 h-4 text-gray-300" />
            )}
          </div>
          <span className="font-bold text-foreground">{product.name}</span>
        </div>
      </td>

      <td className="py-4 px-6 font-medium text-gray-600">{product.brand}</td>
      <td className="py-4 px-6 font-medium text-gray-600">{product.category}</td>
      <td className="py-4 px-6 font-bold text-foreground">{formatNaira(product.price)}</td>

      {/* Clicking the pill toggles stock without opening the row */}
      <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onToggleStock}
          title="Click to toggle stock"
          className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider uppercase transition-colors ${
            product.in_stock
              ? "bg-emerald-100/80 text-emerald-700 hover:bg-emerald-200/80"
              : "bg-rose-100/80 text-rose-700 hover:bg-rose-200/80"
          }`}
        >
          {product.in_stock ? "IN STOCK" : "OUT OF STOCK"}
        </button>
      </td>

      <td className="py-4 px-6 text-right relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onToggleMenu}
          className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-6 top-12 w-36 bg-[#FFFDF9] border border-gray-100 rounded-xl shadow-lg z-20 py-1.5 text-left">
            <button
              onClick={onOpen}
              className="w-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-3.5 h-3.5 text-gray-500" /> View Details
            </button>
            <button
              onClick={onOpen}
              className="w-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit className="w-3.5 h-3.5 text-gray-500" /> Edit
            </button>
            <button
              onClick={onDelete}
              className="w-full px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}