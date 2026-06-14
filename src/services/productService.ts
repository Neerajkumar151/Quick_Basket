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

  const mappedImages =
    Array.isArray(item.gallery) && item.gallery.length > 0
      ? item.gallery.map((img: string) => resolveImageUrl(img))
      : item.imageUrl
      ? [resolveImageUrl(item.imageUrl)]
      : [];

  return {
    id: item.id,
    name: item.name ?? "Unknown Product",
    description: item.description ?? "",
    sellingPrice: parseFloat(item.price ?? item.sellingPrice) || 0,
    mrp: parseFloat(item.compareAtPrice ?? item.mrp) || undefined,
    stockQuantity: item.stockQuantity ?? 0,
    categoryId: item.categoryId ?? "",
    subCategoryId: item.subCategoryId ?? "",
    brand: item.brand ?? undefined,
    tagIds: mappedTagIds,
    images: mappedImages,
    status: item.isActive === false ? "Inactive" : "Active",
    createdAt: item.created_at ?? item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updated_at ?? item.updatedAt ?? new Date().toISOString(),
  };
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
      const sortMap: Record<string, { sortBy: string; sortOrder: string }> = {
        newest: { sortBy: "createdAt", sortOrder: "desc" },
        oldest: { sortBy: "createdAt", sortOrder: "asc" },
        priceAsc: { sortBy: "price", sortOrder: "asc" },
        priceDesc: { sortBy: "price", sortOrder: "desc" },
        nameAsc: { sortBy: "name", sortOrder: "asc" },
        nameDesc: { sortBy: "name", sortOrder: "desc" },
      };
      const mapped = sortMap[sortBy];
      if (mapped) {
        queryParams.append("sortBy", mapped.sortBy);
        queryParams.append("sortOrder", mapped.sortOrder);
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
    const base64ToFile = async (dataUrl: string, filename: string): Promise<File> => {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      return new File([blob], filename, { type: blob.type });
    };

    const formData = new FormData();
    formData.append("categoryId", data.categoryId);
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    formData.append("price", data.sellingPrice.toString());
    if (data.mrp) formData.append("compareAtPrice", data.mrp.toString());
    formData.append("stockQuantity", data.stockQuantity?.toString() ?? "0");
    if (data.tagIds?.length > 0) formData.append("tags", JSON.stringify(data.tagIds));
    if (data.subCategoryId) formData.append("subCategoryId", data.subCategoryId);
    if (data.brand) formData.append("brand", data.brand);
    formData.append("isActive", data.status === "Active" ? "true" : "false");

    const images = data.images ?? [];
    if (images.length > 0 && images[0].startsWith("data:image")) {
      const file = await base64ToFile(images[0], `product-image-${Date.now()}.jpg`);
      formData.append("productImage", file);
    }

    const response = await apiClient.post(ENDPOINTS.PRODUCTS.ADMIN, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapProduct(response.data?.data ?? response.data);
  },

  updateProduct: async (id: string, data: any): Promise<Product> => {
    const base64ToFile = async (dataUrl: string, filename: string): Promise<File> => {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      return new File([blob], filename, { type: blob.type });
    };

    const formData = new FormData();
    if (data.categoryId !== undefined) formData.append("categoryId", data.categoryId);
    if (data.name !== undefined) formData.append("name", data.name);
    if (data.description !== undefined) formData.append("description", data.description);
    if (data.sellingPrice !== undefined) formData.append("price", data.sellingPrice.toString());
    if (data.mrp !== undefined) formData.append("compareAtPrice", data.mrp?.toString() ?? "");
    if (data.stockQuantity !== undefined) formData.append("stockQuantity", data.stockQuantity.toString());
    if (data.tagIds !== undefined) formData.append("tags", JSON.stringify(data.tagIds));
    if (data.subCategoryId !== undefined) formData.append("subCategoryId", data.subCategoryId ?? "");
    if (data.brand !== undefined) formData.append("brand", data.brand ?? "");
    if (data.status !== undefined) formData.append("isActive", data.status === "Active" ? "true" : "false");

    const images = data.images ?? [];
    if (images.length > 0 && images[0].startsWith("data:image")) {
      const file = await base64ToFile(images[0], `product-image-${Date.now()}.jpg`);
      formData.append("productImage", file);
    }

    const response = await apiClient.put(`${ENDPOINTS.PRODUCTS.ADMIN}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapProduct(response.data?.data ?? response.data);
  },

  toggleStatus: async (id: string): Promise<Product> => {
    const response = await apiClient.patch(ENDPOINTS.PRODUCTS.STATUS(id));
    return mapProduct(response.data?.data ?? response.data);
  },
};
