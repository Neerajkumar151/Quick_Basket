import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types/category";

export const CATEGORY_TREE_QUERY_KEY = ["categoryTree"] as const;

/**
 * Fetches all categories for use in dropdowns and sub-category trees.
 * Results are cached for 30 seconds via TanStack Query, so multiple
 * components (catalog dropdowns, sub-category metadata, etc.) all share
 * one API call instead of each firing their own.
 */
export function useCategoryTree() {
  return useQuery<Category[]>({
    queryKey: CATEGORY_TREE_QUERY_KEY,
    queryFn: async () => {
      const result = await categoryService.getCategories("", 1, 500);
      return result.data;
    },
    staleTime: 30 * 1000,
  });
}
