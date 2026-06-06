import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

export const PRODUCTS_QUERY_KEY = ["products"] as const;

/**
 * Fetches all products. Results are cached — repeated calls across components
 * (e.g. ProductsPage + BannerForm) hit the cache instead of the network.
 */
export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: productService.getProducts,
  });
}
