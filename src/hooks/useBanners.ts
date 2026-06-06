import { useQuery } from "@tanstack/react-query";
import { bannerService } from "../services/bannerService";

export const BANNERS_QUERY_KEY = ["banners"] as const;

/**
 * Fetches all banners with caching via TanStack Query.
 */
export function useBanners() {
  return useQuery({
    queryKey: BANNERS_QUERY_KEY,
    queryFn: bannerService.getBanners,
  });
}
