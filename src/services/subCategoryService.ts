import { SubCategory, SubCategoryInput } from "../types/subCategory";
import { apiClient } from "../utils/api-client";
import { ENDPOINTS } from "../constants/endpoints";
import { formatShortDate } from "../utils/date";
import { resolveImageUrl } from "../utils/image";
import { normalizeStatus } from "../utils/api-helpers";
import type { RawApiSubCategory } from "../types/api";

const mapSubCategory = (item: RawApiSubCategory): SubCategory => ({
  id: item.id,
  categoryId: item.categoryId ?? "",
  name: item.name ?? "",
  description: item.description ?? "",
  image: resolveImageUrl(item.image ?? item.imageUrl),
  status: normalizeStatus(item),
  productsCount: item.productsCount ?? 0,
  createdAt: formatShortDate(new Date(item.createdAt ?? Date.now())),
  updatedAt: formatShortDate(new Date(item.updatedAt ?? Date.now())),
});

export const subCategoryService = {
  // GET /sub-categories (paginated)
  getSubCategories: async (
    search?: string,
    categoryId?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: SubCategory[]; meta: any }> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) queryParams.append("search", search);
    if (categoryId) queryParams.append("categoryId", categoryId);

    const response = await apiClient.get(
      `${ENDPOINTS.SUB_CATEGORIES.BASE}?${queryParams.toString()}`
    );
    const raw: RawApiSubCategory[] = Array.isArray(response.data?.data)
      ? response.data.data
      : [];

    return {
      data: raw.map(mapSubCategory),
      meta: response.data?.meta ?? { totalPages: 1, page: 1, total: raw.length },
    };
  },

  // GET /sub-categories?categoryId=:id&limit=100
  getSubCategoriesByParent: async (categoryId: string): Promise<SubCategory[]> => {
    const res = await subCategoryService.getSubCategories("", categoryId, 1, 100);
    return res.data;
  },

  // GET /sub-categories/:id
  getSubCategoryById: async (id: string): Promise<SubCategory | null> => {
    const response = await apiClient.get(`${ENDPOINTS.SUB_CATEGORIES.BASE}/${id}`);
    const item: RawApiSubCategory | undefined =
      response.data?.data ?? response.data?.subCategory;
    if (!item) return null;
    return mapSubCategory(item);
  },

  // POST /sub-categories
  createSubCategory: async (
    data: SubCategoryInput,
    imageFile?: File | null
  ): Promise<SubCategory> => {
    let uploadedImageUrl: string | undefined;

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("file", imageFile);
      const uploadRes = await apiClient.post(`${ENDPOINTS.MEDIA.UPLOAD}?type=subcategory`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      uploadedImageUrl = uploadRes.data?.data?.imageUrl;
    }

    const payload = {
      categoryId: data.categoryId,
      name: data.name,
      description: data.description || "",
      isActive: data.status === "Active",
      status: data.status,
      ...(uploadedImageUrl && { imageUrl: uploadedImageUrl }),
    };

    const response = await apiClient.post(ENDPOINTS.SUB_CATEGORIES.BASE, payload);
    const raw: RawApiSubCategory = response.data?.id ? response.data : (response.data?.data ?? response.data?.subCategory ?? { id: `subcat-${Date.now()}` });
    return mapSubCategory({
      ...raw,
      categoryId: raw.categoryId ?? data.categoryId,
      name: raw.name ?? data.name,
      description: raw.description ?? data.description,
      image: raw.image ?? raw.imageUrl ?? data.image,
    });
  },

  // PUT /sub-categories/:id
  updateSubCategory: async (
    id: string,
    data: Partial<SubCategoryInput>,
    imageFile?: File | null
  ): Promise<SubCategory> => {
    let uploadedImageUrl: string | undefined;

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("file", imageFile);
      const uploadRes = await apiClient.post(`${ENDPOINTS.MEDIA.UPLOAD}?type=subcategory`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      uploadedImageUrl = uploadRes.data?.data?.imageUrl;
    }

    const payload: any = {};
    if (data.categoryId !== undefined) payload.categoryId = data.categoryId;
    if (data.name !== undefined) payload.name = data.name;
    if (data.description !== undefined) payload.description = data.description;
    if (data.status !== undefined) {
      payload.isActive = data.status === "Active";
    }
    if (uploadedImageUrl) payload.imageUrl = uploadedImageUrl;

    const response = await apiClient.put(`${ENDPOINTS.SUB_CATEGORIES.BASE}/${id}`, payload);
    const raw: RawApiSubCategory = response.data?.id ? response.data : (response.data?.data ?? response.data?.subCategory ?? { id });
    return mapSubCategory({
      ...raw,
      categoryId: raw.categoryId ?? data.categoryId,
      name: raw.name ?? data.name,
      description: raw.description ?? data.description,
    });
  },

  // PATCH /sub-categories/:id/status
  toggleStatus: async (id: string): Promise<void> => {
    await apiClient.patch(ENDPOINTS.SUB_CATEGORIES.STATUS(id));
  },
};
