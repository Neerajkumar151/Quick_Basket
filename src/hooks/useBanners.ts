import { useQuery } from "@tanstack/react-query";
import { bannerService } from "../services/bannerService";

export const BANNERS_QUERY_KEY = ["banners"] as const;

/**
 * Fetches all banners with caching via TanStack Query.
 */
export function useBanners(statusFilter?: string, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...BANNERS_QUERY_KEY, statusFilter, page, limit],
    queryFn: () => bannerService.getBanners(statusFilter, page, limit),
    staleTime: 5 * 60 * 1000,
  });
}
