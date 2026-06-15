import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { queryKeys } from "../constants/queryKeys";
import { ProductFormValues } from "../validations/product";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { DASHBOARD_QUERY_KEY } from "./useDashboard";

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: ProductFormValues) => productService.createProduct(data),
    onSuccess: () => {
      toast.success(t("products.messages.successCreate", "Product created successfully"));
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : t("products.messages.errorSave", "Failed to save product");
      toast.error(message);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormValues }) => productService.updateProduct(id, data),
    onSuccess: () => {
      toast.success(t("products.messages.successUpdate", "Product updated successfully"));
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : t("products.messages.errorSave", "Failed to save product");
      toast.error(message);
    },
  });
}

export function useToggleProductStatus() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => productService.toggleStatus(id),
    onSuccess: () => {
      toast.success(t("products.messages.successStatus", "Status updated successfully"));
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
    onError: () => {
      toast.error(t("products.messages.errorStatus", "Failed to update status"));
    },
  });
}
