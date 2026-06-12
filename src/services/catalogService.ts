import { getStoredCategories } from "./categoryService";
import { getStoredTags } from "./tagService";
import { getStoredSubCategories } from "./subCategoryService";

export interface CatalogMetadata {
  id: string;
  name: string;
}

export const catalogService = {
  // GET /api/v1/catalog/metadata
  getMetadata: async (): Promise<{ categories: CatalogMetadata[], tags: CatalogMetadata[] }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // In production, this would be a single DB query selecting only id and name where status is Active
    const categories = getStoredCategories()
      .filter(c => c.status === "Active")
      .map(c => ({ id: c.id, name: c.name }));
      
    const tags = getStoredTags()
      .filter(t => t.status === "Active")
      .map(t => ({ id: t.id, name: t.name }));

    return { categories, tags };
  },

  // GET /api/v1/categories/:categoryId/sub-categories
  getSubCategoryMetadata: async (categoryId: string): Promise<CatalogMetadata[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    return getStoredSubCategories()
      .filter(s => s.status === "Active" && s.categoryId === categoryId)
      .map(s => ({ id: s.id, name: s.name }));
  }
};
