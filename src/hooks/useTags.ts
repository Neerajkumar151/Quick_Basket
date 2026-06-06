import { useQuery } from "@tanstack/react-query";
import { tagService } from "../services/tagService";

export const TAGS_QUERY_KEY = ["tags"] as const;

/**
 * Fetches all tags. Results are cached — ProductForm consumes this hook
 * without triggering a new network call if tags are already loaded.
 */
export function useTags() {
  return useQuery({
    queryKey: TAGS_QUERY_KEY,
    queryFn: tagService.getTags,
  });
}
