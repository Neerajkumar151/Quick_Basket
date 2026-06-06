export interface SubCategory {
  id: string;
  name: string;
  categoryId: string; // The parent category
  description?: string;
  image?: string;
  status: "Active" | "Inactive";
  productsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export type SubCategoryInput = Omit<SubCategory, "id" | "productsCount" | "createdAt" | "updatedAt">;
