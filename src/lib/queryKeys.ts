const products = ["products"] as const;

export const queryKeys = {
  products: {
    all: products,
    lists: () => [...products, "list"] as const, // matches EVERY list, any filters
    list: (filters: object) => [...products, "list", filters] as const,
    detail: (id: string) => [...products, "detail", id] as const,
  },
};