import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { api, toQueryString } from "@/lib/api";
import type { Product, ProductFilters, ProductInput, ProductsPage } from "@/lib/types";
import { queryKeys } from "@/lib/queryKeys";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => api.get<ProductsPage>(`/admin/products${toQueryString(filters)}`),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => api.get<{ product: Product }>(`/admin/products/${id}`).then((r) => r.product),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductInput) =>
      api.post<{ product: Product }>("/admin/products", data).then((r) => r.product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success("Product created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductInput> }) =>
      api.patch<{ product: Product }>(`/admin/products/${id}`, data).then((r) => r.product),
    onSuccess: (product) => {
      queryClient.setQueryData(queryKeys.products.detail(product.id), product);
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      toast.success("Product updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success("Product deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useToggleStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, in_stock }: { id: string; in_stock: boolean }) =>
      api
        .patch<{ product: Product }>(`/admin/products/${id}/stock`, { in_stock: in_stock })
        .then((r) => r.product),

    onMutate: async ({ id, in_stock }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.lists() });

      const snapshots = queryClient.getQueriesData<ProductsPage>({
        queryKey: queryKeys.products.lists(),
      });

      queryClient.setQueriesData<ProductsPage>(
        { queryKey: queryKeys.products.lists() },
        (old) =>
          old && {
            ...old,
            products: old.products.map((p) =>
              p.id === id ? { ...p, in_stock: in_stock } : p
            ),
          }
      );

      return { snapshots };
    },

    onError: (err: Error, _vars, context) => {
      context?.snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error(err.message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}