import { ComponentType } from "react";
import { LucideProps } from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: ComponentType<LucideProps>;
}

export interface StatCardItem {
  title: string;
  value: string;
  change: string;
  icon: ComponentType<LucideProps>;
  iconBg: string;
  iconColor: string;
  isWarning?: boolean;
  isRealtime?: boolean;
}

export type OrderStatus = "DELIVERED" | "PENDING" | "CANCELLED" | "PROCESSING";

export interface RecentOrder {
  id: string;
  customer: string;
  amount: string;
  status: OrderStatus;
}

export interface LowStockItem {
  name: string;
  sku: string;
  stock: string;
  iconBg: string;
}

export type OrderType = "delivery" | "pickup";
export type OrderStatusTrack =
  | "pending"
  | "confirmed"
  | "ready"
  | "delivered"
  | "cancelled";
export type FilterTab = "all" | "delivery" | "pickup" | "completed";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  type: OrderType;
  customer: string;
  phone: string;
  address?: string;
  pickupCode?: string;
  items: number;
  total: number;
  status: OrderStatusTrack;
  date: string;
  orderItems: OrderItem[];
}

export type PickupStatus = "pending" | "expiring" | "collected";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  type: OrderType;
  customer: string;
  phone: string;
  address?: string;
  pickupCode?: string;
  pickupExpires?: string;
  collectedAt?: string;
  items: number;
  total: number;
  status: OrderStatusTrack;
  date: string;
  orderItems: OrderItem[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  price_range: string | null;
  image: string | null;
  in_stock: boolean;
  tags: string[];
  created_at: string;
  description: string;
  updated_at: string;
}

export type ProductInput = Omit<Product, "id" | "created_at" | "updated_at">;

export type ProductFilters = {
  search?: string;
  category?: string;
  in_stock?: boolean;
  page?: number;
  limit?: number;
};

export interface ProductsPage {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}
