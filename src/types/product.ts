export interface Product {
  id: string;
  name: string;
  description?: string;
  sellingPrice: number;
  mrp?: number;
  stockQuantity: number;
  categoryId: string;
  subCategoryId?: string;
  tagIds?: string[];
  images: string[];
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}
