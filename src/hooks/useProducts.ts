import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { queryKeys } from "../constants/queryKeys";

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
    queryKey: [...queryKeys.products, searchQuery, categoryFilter, subCategoryFilter, statusFilter, sortBy, page, limit],
    queryFn: () => productService.getProducts(searchQuery, categoryFilter, subCategoryFilter, statusFilter, sortBy, page, limit),
  });
}

