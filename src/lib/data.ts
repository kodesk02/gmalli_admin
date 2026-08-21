import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  QrCode,
  BarChart3,
  Settings,
  ShoppingBag,
  Wallet,
  ClipboardList,
  Users,
} from "lucide-react";

import {
  NavItem,
  StatCardItem,
  RecentOrder,
  LowStockItem,
  Product,
} from "./types";

export const navItems: NavItem[] = [
  { name: "OVERVIEW", href: "/dashboard", icon: LayoutDashboard },
  { name: "PRODUCTS", href: "/dashboard/products", icon: Package },
  { name: "ORDERS", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "DELIVERY", href: "/dashboard/orders/delivery", icon: Truck },
  { name: "PICKUP", href: "/dashboard/orders/pickup", icon: QrCode },
  { name: "ANALYTICS", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "SETTINGS", href: "/dashboard/settings", icon: Settings },
];

export const stats: StatCardItem[] = [
  {
    title: "TOTAL ORDERS TODAY",
    value: "1,245",
    change: "+12% vs yesterday",
    icon: ShoppingBag,
    iconBg: "bg-orange-100/60",
    iconColor: "text-orange-600",
  },
  {
    title: "REVENUE TODAY",
    value: "₦4.2M",
    change: "+8.4% vs yesterday",
    icon: Wallet,
    iconBg: "bg-emerald-100/60",
    iconColor: "text-emerald-600",
  },
  {
    title: "PENDING ORDERS",
    value: "86",
    change: "Needs attention",
    isWarning: true,
    icon: ClipboardList,
    iconBg: "bg-amber-100/60",
    iconColor: "text-amber-600",
  },
  {
    title: "ACTIVE VISITORS",
    value: "3,492",
    change: "Real-time",
    isRealtime: true,
    icon: Users,
    iconBg: "bg-indigo-100/60",
    iconColor: "text-indigo-600",
  },
];

export const recentOrders: RecentOrder[] = [
  {
    id: "#ORD-0921",
    customer: "Chioma Adebayo",
    amount: "₦45,500",
    status: "DELIVERED",
  },
  {
    id: "#ORD-0920",
    customer: "Ibrahim Musa",
    amount: "₦12,200",
    status: "PENDING",
  },
  {
    id: "#ORD-0919",
    customer: "Grace Okafor",
    amount: "₦89,000",
    status: "DELIVERED",
  },
];

export const lowStockItems: LowStockItem[] = [
  {
    name: "Dangote Cement 50kg",
    sku: "SKU: BLD-001",
    stock: "5 left in stock",
    iconBg: "bg-amber-100/80",
  },
  {
    name: "Eva Water 1.5L",
    sku: "SKU: BEV-102",
    stock: "18 left",
    iconBg: "bg-amber-100/80",
  },
];

export const initialProducts: Product[] = [
  {
    id: "1",
    name: "Premium Parboiled Rice 50kg",
    brand: "Mama Gold",
    category: "Grains & Staples",
    price: "₦45,000",
    bulkPrice: "₦43,500 - ₦45,000",
    inStock: true,
    image: "/images/clothing.jpg",
    description:
      "High-grade premium parboiled rice sourced directly from local processing mills. Cleaned, long-grain, and completely stone-free.",
    tags: ["Grains", "Staples", "50kg", "Rice"],
  },
  {
    id: "2",
    name: "Full Cream Milk Powder 900g",
    brand: "Peak",
    category: "Dairy",
    price: "₦8,500",
    bulkPrice: "₦8,000 - ₦8,500",
    inStock: false,
    image: "/images/eggs.jpg",
    description:
      "Rich and creamy full cream milk powder packed with essential vitamins and minerals for daily household nutrition.",
    tags: ["Milk", "Dairy", "Powder", "900g"],
  },
  {
    id: "3",
    name: "Pure Vegetable Oil 5L",
    brand: "Kings",
    category: "Oils & Spices",
    price: "₦12,200",
    bulkPrice: "₦11,800 - ₦12,200",
    inStock: true,
    image: "/images/frozenfood.jpg",
    description:
      "Refined cholesterol-free pure vegetable cooking oil suitable for frying, baking, and all everyday culinary needs.",
    tags: ["Oil", "Cooking", "5L", "Spices"],
  },
];