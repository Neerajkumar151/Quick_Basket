/**
 * Shared utilities for normalizing API responses consistently
 * across all service files.
 */

/**
 * Normalizes status from various backend response shapes into
 * a canonical "Active" | "Inactive" string.
 *
 * Handles:
 * - `status: "Active"` / `status: "Inactive"` (string, case-insensitive)
 * - `isActive: true` / `isActive: false` (boolean)
 * - Missing fields (defaults to "Active")
 */
export function normalizeStatus(item: {
  status?: string;
  isActive?: boolean;
}): "Active" | "Inactive" {
  if (item.status !== undefined) {
    return item.status.toLowerCase() === "inactive" ? "Inactive" : "Active";
  }
  if (item.isActive !== undefined) {
    return item.isActive === false ? "Inactive" : "Active";
  }
  return "Active";
}

/**
 * Extracts a paginated data array from a standard API response envelope.
 * Returns an empty array if the shape doesn't match.
 */
export function extractDataArray<T>(responseData: unknown): T[] {
  if (!responseData || typeof responseData !== "object") return [];
  const d = responseData as Record<string, unknown>;
  if (Array.isArray(d.data)) return d.data as T[];
  if (Array.isArray(responseData)) return responseData as T[];
  return [];
}

/**
 * Extracts pagination meta from a standard API response envelope.
 */
export function extractMeta(
  responseData: unknown
): { total: number; page: number; totalPages: number } {
  const defaultMeta = { total: 0, page: 1, totalPages: 1 };
  if (!responseData || typeof responseData !== "object") return defaultMeta;
  const d = responseData as Record<string, unknown>;
  return (d.meta as typeof defaultMeta) || defaultMeta;
}
