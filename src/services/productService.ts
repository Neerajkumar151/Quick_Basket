import { Product } from "../types/product";
import { apiClient } from "../utils/api-client";
import { ENDPOINTS } from "../constants/endpoints";
import { resolveImageUrl } from "../utils/image";

export type { Product };

// ─── Raw API → Domain mapper ──────────────────────────────────────────────────
const mapProduct = (item: any): Product => {
  const mappedTagIds = Array.isArray(item.tags)
    ? item.tags.map((t: any) => (typeof t === "string" ? t : t.id))
    : Array.isArray(item.tagIds)
    ? item.tagIds
    : [];

  const mappedImages: string[] = [];
  if (item.imageUrl) {
    mappedImages.push(resolveImageUrl(item.imageUrl));
  }
  if (Array.isArray(item.gallery)) {
    item.gallery.forEach((img: string) => {
      if (img) mappedImages.push(resolveImageUrl(img));
    });
  }

  return {
    id: item.id,
    name: item.name ?? "Unknown Product",
    description: item.description ?? "",
    sellingPrice: parseFloat(item.price ?? item.sellingPrice) || 0,
    mrp: parseFloat(item.compareAtPrice ?? item.mrp) || undefined,
    stockQuantity: item.stockQuantity ?? 0,
    categoryId: item.categoryId ?? "",
    categoryName: item.Category?.name ?? item.category?.name,
    subCategoryId: item.subCategoryId ?? "",
    subCategoryName: item.SubCategory?.name ?? item.subCategory?.name,
    brand: item.brand ?? undefined,
    tagIds: mappedTagIds,
    images: mappedImages,
    status: item.isActive === false ? "Inactive" : "Active",
    createdAt: item.created_at ?? item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updated_at ?? item.updatedAt ?? new Date().toISOString(),
  };
};

const base64ToFile = async (dataUrl: string, filename: string): Promise<File> => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

export const productService = {
  getProducts: async (
    search?: string,
    categoryFilter?: string,
    subCategoryFilter?: string,
    statusFilter?: string,
    sortBy?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Product[]; meta: any }> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) queryParams.append("search", search);
    if (categoryFilter && categoryFilter !== "all")
      queryParams.append("categoryId", categoryFilter);
    if (subCategoryFilter && subCategoryFilter !== "all")
      queryParams.append("subCategoryId", subCategoryFilter);
    if (statusFilter && statusFilter !== "all") {
      queryParams.append("isActive", statusFilter === "Active" ? "true" : "false");
    }
    if (sortBy) {
      const sortMap: Record<string, string> = {
        newest: "latest",
        popularity: "popularity",
        priceAsc: "price_asc",
        priceDesc: "price_desc",
      };
      const mapped = sortMap[sortBy];
      if (mapped) {
        queryParams.append("sortBy", mapped);
      }
    }

    const response = await apiClient.get(
      `${ENDPOINTS.PRODUCTS.BASE}?${queryParams.toString()}`
    );

    const rawProducts = Array.isArray(response.data?.data)
      ? response.data.data
      : [];
    const data = rawProducts.map(mapProduct);

    const pagination = response.data?.pagination ?? response.data?.meta ?? {};
    const meta = {
      totalPages: pagination.pages ?? pagination.totalPages ?? 1,
      page,
      total: pagination.total ?? data.length,
    };

    return { data, meta };
  },

  getProductById: async (id: string): Promise<Product | null> => {
    const response = await apiClient.get(ENDPOINTS.PRODUCTS.DETAILS(id));
    const raw = response.data?.data ?? response.data?.product ?? response.data;
    if (!raw?.id) return null;
    return mapProduct(raw);
  },

  createProduct: async (data: any): Promise<Product> => {
    const images = data.images ?? [];
    let primaryImageUrl: string | undefined;
    const galleryUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (image.startsWith("data:image")) {
        const file = await base64ToFile(image, `product-image-${Date.now()}-${i}.jpg`);
        const uploadForm = new FormData();
        uploadForm.append("file", file);
        const uploadRes = await apiClient.post(`${ENDPOINTS.MEDIA.UPLOAD}?type=product`, uploadForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const url = uploadRes.data?.data?.imageUrl || uploadRes.data?.data?.url || uploadRes.data?.url || "";
        
        if (i === 0) primaryImageUrl = url;
        else galleryUrls.push(url);
      } else {
        if (i === 0) primaryImageUrl = image;
        else galleryUrls.push(image);
      }
    }

    const payload: any = {
      categoryId: data.categoryId,
      name: data.name,
      description: data.description || "",
      price: data.sellingPrice.toString(),
      compareAtPrice: data.mrp?.toString() || "",
      stockQuantity: data.stockQuantity ?? 0,
      tags: data.tagIds ?? [],
      subCategoryId: data.subCategoryId || "",
      brand: data.brand || "",
      isActive: data.status === "Active",
    };

    if (primaryImageUrl) payload.imageUrl = primaryImageUrl;
    if (galleryUrls.length > 0) payload.gallery = galleryUrls;

    const response = await apiClient.post(ENDPOINTS.PRODUCTS.ADMIN, payload);
    return mapProduct(response.data?.data ?? response.data);
  },

  updateProduct: async (id: string, data: any): Promise<Product> => {
    const images = data.images ?? [];
    let primaryImageUrl: string | undefined;
    const galleryUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (image.startsWith("data:image")) {
        const file = await base64ToFile(image, `product-image-${Date.now()}-${i}.jpg`);
        const uploadForm = new FormData();
        uploadForm.append("file", file);
        const uploadRes = await apiClient.post(`${ENDPOINTS.MEDIA.UPLOAD}?type=product`, uploadForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const url = uploadRes.data?.data?.imageUrl || uploadRes.data?.data?.url || uploadRes.data?.url || "";
        
        if (i === 0) primaryImageUrl = url;
        else galleryUrls.push(url);
      } else {
        if (i === 0) primaryImageUrl = image;
        else galleryUrls.push(image);
      }
    }

    const payload: any = {};
    if (data.categoryId !== undefined) payload.categoryId = data.categoryId;
    if (data.name !== undefined) payload.name = data.name;
    if (data.description !== undefined) payload.description = data.description;
    if (data.sellingPrice !== undefined) payload.price = data.sellingPrice.toString();
    if (data.mrp !== undefined) payload.compareAtPrice = data.mrp?.toString() ?? "";
    if (data.stockQuantity !== undefined) payload.stockQuantity = data.stockQuantity;
    if (data.tagIds !== undefined) payload.tags = data.tagIds;
    if (data.subCategoryId !== undefined) payload.subCategoryId = data.subCategoryId;
    if (data.brand !== undefined) payload.brand = data.brand;
    if (data.status !== undefined) payload.isActive = data.status === "Active";

    if (primaryImageUrl) payload.imageUrl = primaryImageUrl;
    payload.gallery = galleryUrls;

    const response = await apiClient.put(`${ENDPOINTS.PRODUCTS.ADMIN}/${id}`, payload);
    return mapProduct(response.data?.data ?? response.data);
  },

  toggleStatus: async (id: string): Promise<Product> => {
    const response = await apiClient.patch(ENDPOINTS.PRODUCTS.STATUS(id));
    return mapProduct(response.data?.data ?? response.data);
  },
};
