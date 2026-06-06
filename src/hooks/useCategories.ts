import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

/**
 * Fetches all categories. Results are cached — ProductsPage, ProductForm, and
 * BannerForm all share the same cache entry instead of each making a separate call.
 */
export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: categoryService.getCategories,
  });
}
