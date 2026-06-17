export interface Product {
  id: string;
  name: string;
  description?: string;
  sellingPrice: number;
  mrp?: number;
  stockQuantity: number;
  categoryId: string;
  categoryName?: string;
  subCategoryId?: string;
  subCategoryName?: string;
  tagIds?: string[];
  images: string[];
  status: "Active" | "Inactive";
  brand?: string;
  createdAt: string;
  updatedAt: string;
}
