import type { ProductInput } from "@/lib/types";

const readText = (data: FormData, key: string): string => {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
};

export function toProductInput(data: FormData, tags: string[], inStock: boolean, image: string | null): ProductInput {
  return {
    name: readText(data, "name"),
    brand: readText(data, "brand"),
    category: readText(data, "category"),
    price: Number(readText(data, "price")),
    price_range: readText(data, "price_range") || null,
    description: readText(data, "description") || null,
    image,
    in_stock: inStock,
    tags,
  };
}