import { formatShortDate } from "../utils/date";
import { Tag } from "../types/tag";
import { apiClient } from "../utils/api-client";
import { ENDPOINTS } from "../constants/endpoints";

export type { Tag };

const mapTag = (t: any): Tag => ({
  id: t.id,
  name: t.name,
  status: t.isActive === false ? "Inactive" : "Active",
  productsCount: parseInt(t.productCount ?? t.productsCount ?? "0") || 0,
  createdAt: formatShortDate(new Date(t.createdAt ?? t.created_at ?? Date.now())),
});

export const getStoredTags = async (): Promise<Tag[]> => {
  const res = await tagService.getTags("", "all", 1, 500);
  return res.data;
};

export const tagService = {
  // GET /tags
  getTags: async (
    search?: string,
    statusFilter?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Tag[]; meta: any }> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) queryParams.append("search", search);
    if (statusFilter && statusFilter !== "all") {
      queryParams.append("status", statusFilter);
    }

    const response = await apiClient.get(`${ENDPOINTS.TAGS.BASE}?${queryParams.toString()}`);
    const rawTags = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
      ? response.data
      : [];
      
    return {
      data: rawTags.map(mapTag),
      meta: response.data?.meta ?? { totalPages: 1, page: 1, total: rawTags.length },
    };
  },

  // POST /admin/tags
  createTag: async (
    data: Omit<Tag, "id" | "createdAt" | "productsCount">
  ): Promise<Tag> => {
    const payload = { name: data.name };
    const response = await apiClient.post(ENDPOINTS.TAGS.ADMIN, payload);
    const t = response.data?.data ?? response.data;
    return mapTag(t);
  },

  // PUT /admin/tags/:id
  updateTag: async (
    id: string,
    data: Partial<Omit<Tag, "id" | "createdAt" | "productsCount">>
  ): Promise<Tag> => {
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.status !== undefined) payload.isActive = data.status === "Active";

    const response = await apiClient.put(`${ENDPOINTS.TAGS.ADMIN}/${id}`, payload);
    const t = response.data?.data ?? response.data;
    return mapTag({ ...t, id });
  },

  // Convenience: toggles status via updateTag
  toggleStatus: async (tag: Tag): Promise<Tag> => {
    return tagService.updateTag(tag.id, {
      name: tag.name,
      status: tag.status === "Active" ? "Inactive" : "Active",
    });
  },
};
