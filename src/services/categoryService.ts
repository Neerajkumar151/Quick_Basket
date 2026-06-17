import { formatShortDate } from "../utils/date";
import { resolveImageUrl } from "../utils/image";
import { normalizeStatus } from "../utils/api-helpers";
import { Category, CategoryInput } from "../types/category";
import type { RawApiCategory } from "../types/api";
import { apiClient } from "../utils/api-client";
import { ENDPOINTS } from "../constants/endpoints";

export type { Category, CategoryInput };

const mapCategory = (item: RawApiCategory): Category => ({
  id: item.id,
  name: item.name,
  description: item.description || "",
  image: resolveImageUrl(item.imageUrl ?? item.categoryImage ?? item.image),
  productsCount: item.productsCount || 0,
  status: normalizeStatus(item),
  createdAt: formatShortDate(new Date(item.created_at ?? item.createdAt ?? Date.now())),
});

export const categoryService = {
  // GET /admin/categories (paginated admin listing)
  getCategories: async (
    search?: string,
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<{ data: Category[]; meta: any }> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) queryParams.append("search", search);
    if (status) queryParams.append("status", status);

    const url = `${ENDPOINTS.CATEGORIES.ADMIN}?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    const raw: RawApiCategory[] = Array.isArray(response.data?.data)
      ? response.data.data
      : [];

    return {
      data: raw.map(mapCategory),
      meta: response.data?.meta ?? { totalPages: 1, page: 1, total: raw.length },
    };
  },



  // POST /admin/categories
  createCategory: async (
    data: CategoryInput,
    imageFile?: File | null
  ): Promise<Category> => {
    let uploadedImageUrl: string | undefined;

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("file", imageFile);
      const uploadRes = await apiClient.post(`${ENDPOINTS.MEDIA.UPLOAD}?type=category`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      uploadedImageUrl = uploadRes.data?.data?.imageUrl;
    }

    const payload = {
      name: data.name,
      description: data.description || "",
      parentId: "root",
      isActive: data.status === "Active",
      ...(uploadedImageUrl && { imageUrl: uploadedImageUrl }),
    };

    const response = await apiClient.post(ENDPOINTS.CATEGORIES.ADMIN, payload);
    const raw: RawApiCategory = response.data?.category ?? response.data?.data ?? {};
    
    return {
      ...data,
      id: raw.id ?? `cat-${Date.now()}`,
      productsCount: raw.productsCount ?? 0,
      status: data.status ?? "Active",
      createdAt: formatShortDate(new Date(raw.createdAt ?? Date.now())),
    };
  },

  // PUT /admin/categories/:id
  updateCategory: async (
    id: string,
    data: Partial<CategoryInput>,
    imageFile?: File | null
  ): Promise<Category> => {
    let uploadedImageUrl: string | undefined;

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("file", imageFile);
      const uploadRes = await apiClient.post(`${ENDPOINTS.MEDIA.UPLOAD}?type=category`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      uploadedImageUrl = uploadRes.data?.data?.imageUrl;
    }

    const payload: any = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.description !== undefined) payload.description = data.description;
    if (data.status !== undefined) payload.isActive = data.status === "Active";
    if (uploadedImageUrl) payload.imageUrl = uploadedImageUrl;

    const response = await apiClient.put(`${ENDPOINTS.CATEGORIES.ADMIN}/${id}`, payload);
    const raw: RawApiCategory = response.data?.data ?? response.data?.category ?? {};
    return mapCategory({ ...raw, id });
  },

  // PATCH /admin/categories/:id/status
  toggleStatus: async (id: string, isActive: boolean): Promise<void> => {
    await apiClient.patch(`${ENDPOINTS.CATEGORIES.ADMIN}/${id}/status`, { isActive });
  },
};
