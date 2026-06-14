import { formatShortDate } from "../utils/date";
import { resolveImageUrl } from "../utils/image";
import { normalizeStatus } from "../utils/api-helpers";
import { Banner, BannerInput, RedirectType, BannerStatus } from "../types/banner";
import type { RawApiBanner } from "../types/api";
import { apiClient } from "../utils/api-client";
import { ENDPOINTS } from "../constants/endpoints";

export type { Banner, BannerInput, RedirectType, BannerStatus };

/** Normalizes the redirectType string to a capitalized canonical form */
function normalizeRedirectType(raw?: string): RedirectType {
  if (!raw) return "Category";
  return (raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()) as RedirectType;
}

const mapBanner = (item: RawApiBanner, fallbackOrder = 0): Banner => ({
  id: item.id,
  title: item.title ?? "",
  description: item.description ?? "",
  image: resolveImageUrl(item.imageUrl ?? item.image),
  redirectType: normalizeRedirectType(item.redirectType),
  redirectId: item.redirectId ?? item.targetId ?? item.categoryId ?? item.productId ?? "",
  redirectName: item.redirectName ?? item.targetName ?? "",
  displayOrder: item.displayOrder ?? item.priority ?? fallbackOrder,
  status: normalizeStatus(item),
  createdAt: formatShortDate(new Date(item.createdAt ?? Date.now())),
  updatedAt: formatShortDate(new Date(item.updatedAt ?? Date.now())),
});

export const bannerService = {
  // GET /banners
  getBanners: async (): Promise<Banner[]> => {
    const response = await apiClient.get(ENDPOINTS.BANNERS.BASE);
    const raw: RawApiBanner[] = Array.isArray(response.data?.data)
      ? response.data.data
      : [];
    return raw.map((item, i) => mapBanner(item, i));
  },

  // POST /admin/banners
  createBanner: async (data: BannerInput, imageFile?: File | null): Promise<Banner> => {
    let imageUrl = "";
    if (imageFile) {
      const uploadForm = new FormData();
      uploadForm.append("file", imageFile);
      const uploadRes = await apiClient.post(ENDPOINTS.MEDIA.UPLOAD, uploadForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      imageUrl = uploadRes.data?.data?.url || uploadRes.data?.url || uploadRes.data?.data?.imageUrl || "";
    }

    const isInternal = ["product", "category", "store"].includes(data.redirectType.toLowerCase());

    const payload: Record<string, any> = {
      title: data.title,
      description: data.description || "",
      redirectType: data.redirectType.toLowerCase(),
      priority: data.displayOrder,
      status: data.status.toLowerCase(),
      imageUrl: imageUrl || null
    };

    if (isInternal) {
      payload.redirectId = data.redirectId || null;
    } else {
      payload.redirectUrl = data.redirectId || null;
    }

    const response = await apiClient.post(ENDPOINTS.BANNERS.ADMIN_BASE, payload);
    const raw: RawApiBanner = response.data?.data ?? response.data?.banner ?? { id: `banner-${Date.now()}` };
    
    // Merge submitted data as fallback for fields the backend might not echo back
    return mapBanner({
      ...raw,
      title: raw.title ?? data.title,
      description: raw.description ?? data.description,
      redirectType: raw.redirectType ?? data.redirectType.toLowerCase(),
      redirectId: raw.redirectId ?? data.redirectId,
      redirectName: raw.redirectName ?? data.redirectName,
      displayOrder: raw.priority ?? raw.displayOrder ?? data.displayOrder,
    });
  },

  // PATCH /admin/banners/:id
  updateBanner: async (id: string, data: Partial<BannerInput>, imageFile?: File | null): Promise<Banner> => {
    const formData = new FormData();
    if (data.title !== undefined) formData.append("title", data.title);
    if (data.description !== undefined) formData.append("description", data.description);
    if (data.redirectType !== undefined) formData.append("redirectType", data.redirectType.toLowerCase());
    if (data.redirectId !== undefined) formData.append("redirectId", data.redirectId);
    if (data.displayOrder !== undefined) formData.append("priority", data.displayOrder.toString());
    if (data.status !== undefined) formData.append("status", data.status.toLowerCase());
    if (imageFile) formData.append("image", imageFile);

    const response = await apiClient.patch(`${ENDPOINTS.BANNERS.ADMIN_BASE}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const raw: RawApiBanner = response.data?.data ?? response.data?.banner ?? { id };
    return mapBanner({
      ...raw,
      title: raw.title ?? data.title,
      description: raw.description ?? data.description,
      redirectType: raw.redirectType ?? data.redirectType?.toLowerCase(),
      redirectId: raw.redirectId ?? data.redirectId,
      redirectName: raw.redirectName ?? data.redirectName,
      displayOrder: raw.priority ?? raw.displayOrder ?? data.displayOrder ?? 1,
    });
  },

  // PATCH /admin/banners/:id/status
  toggleStatus: async (id: string): Promise<void> => {
    await apiClient.patch(ENDPOINTS.BANNERS.STATUS(id));
  },
};
