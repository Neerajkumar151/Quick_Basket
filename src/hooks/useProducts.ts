import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

export const PRODUCTS_QUERY_KEY = ["products"] as const;

/**
 * Fetches all products. Results are cached — repeated calls across components
 * (e.g. ProductsPage + BannerForm) hit the cache instead of the network.
 */
export function useProducts(
  searchQuery?: string,
  categoryFilter?: string,
  subCategoryFilter?: string,
  statusFilter?: string,
  sortBy?: string,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, searchQuery, categoryFilter, subCategoryFilter, statusFilter, sortBy, page, limit],
    queryFn: () => productService.getProducts(searchQuery, categoryFilter, subCategoryFilter, statusFilter, sortBy, page, limit),
    staleTime: 5 * 60 * 1000,
  });
}

