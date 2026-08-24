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

// 5. Low Stock Alerts Type
export interface LowStockItem {
  name: string;
  sku: string;
  stock: string;
  iconBg: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  inStock: boolean;
  image: string;
  bulkPrice?: string;
  description?: string;
  tags?: string[];
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
