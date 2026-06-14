import { useQuery } from "@tanstack/react-query";
import { subCategoryService } from "../services/subCategoryService";

export const SUB_CATEGORIES_QUERY_KEY = ["subCategories"] as const;

export function useSubCategories(searchQuery: string = "", categoryId: string = "", page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...SUB_CATEGORIES_QUERY_KEY, searchQuery, categoryId, page, limit],
    queryFn: () => subCategoryService.getSubCategories(searchQuery, categoryId, page, limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubCategoriesByParent(categoryId: string | undefined) {
  return useQuery({
    queryKey: [...SUB_CATEGORIES_QUERY_KEY, categoryId],
    queryFn: () => (categoryId ? subCategoryService.getSubCategoriesByParent(categoryId) : Promise.resolve([])),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}
