import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

/**
 * Fetches all categories. Results are cached — ProductsPage, ProductForm, and
 * BannerForm all share the same cache entry instead of each making a separate call.
 */
export function useCategories(searchQuery: string = "", page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, searchQuery, page, limit],
    queryFn: () => categoryService.getCategories(searchQuery, page, limit),
    staleTime: 5 * 60 * 1000,
  });
}
