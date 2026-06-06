import { useQuery } from "@tanstack/react-query";
import { subCategoryService } from "../services/subCategoryService";

export const SUB_CATEGORIES_QUERY_KEY = ["subCategories"] as const;

export function useSubCategories() {
  return useQuery({
    queryKey: SUB_CATEGORIES_QUERY_KEY,
    queryFn: () => subCategoryService.getSubCategories(),
    staleTime: 30 * 1000,
  });
}

export function useSubCategoriesByParent(categoryId: string | undefined) {
  return useQuery({
    queryKey: [...SUB_CATEGORIES_QUERY_KEY, categoryId],
    queryFn: () => (categoryId ? subCategoryService.getSubCategoriesByParent(categoryId) : Promise.resolve([])),
    enabled: !!categoryId,
    staleTime: 30 * 1000,
  });
}
