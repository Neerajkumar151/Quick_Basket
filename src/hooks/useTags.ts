import { useQuery } from "@tanstack/react-query";
import { tagService } from "../services/tagService";

export const TAGS_QUERY_KEY = ["tags"] as const;

/**
 * Fetches all tags. Results are cached — ProductForm consumes this hook
 * without triggering a new network call if tags are already loaded.
 */
export function useTags(
  searchQuery?: string,
  statusFilter?: string,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: [...TAGS_QUERY_KEY, searchQuery, statusFilter, page, limit],
    queryFn: () => tagService.getTags(searchQuery, statusFilter, page, limit),
    staleTime: 5 * 60 * 1000,
  });
}
