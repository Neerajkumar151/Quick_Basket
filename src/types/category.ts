export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string; // base64 string or url
  productsCount: number;
  subCategoriesCount?: number;
  status: "Active" | "Inactive";
  createdAt: string; // formatted date string e.g. "12 May"
}

export type CategoryInput = Omit<Category, "id" | "productsCount" | "createdAt">;
