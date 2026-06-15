import { categoryService } from "./categoryService";
import { subCategoryService } from "./subCategoryService";
import { tagService } from "./tagService";

export interface CatalogMetadata {
  id: string;
  name: string;
}

export const catalogService = {
  // Returns a flat list of active parent-categories and tags for dropdowns.
  getMetadata: async (): Promise<{
    categories: CatalogMetadata[];
    tags: CatalogMetadata[];
  }> => {
    try {
      const catsRes = await categoryService.getCategories("", 1, 500);
      const categories = catsRes.data
        .filter((c) => c.status === "Active")
        .map((c) => ({ id: c.id, name: c.name }));

      const fetchedTagsRes = await tagService.getTags("", "all", 1, 500);
      const tags = fetchedTagsRes.data
        .filter((t) => t.status === "Active")
        .map((t) => ({ id: t.id, name: t.name }));

      return { categories, tags };
    } catch (error) {
      console.error("Failed to fetch catalog metadata:", error);
      return { categories: [], tags: [] };
    }
  },

  // Returns active sub-categories for a given parent category.
  getSubCategoryMetadata: async (
    categoryId: string
  ): Promise<CatalogMetadata[]> => {
    if (!categoryId) return [];
    
    try {
      const subCats = await subCategoryService.getSubCategoriesByParent(categoryId);
      return subCats
        .filter((s) => s.status === "Active")
        .map((s) => ({ id: s.id, name: s.name }));
    } catch (error) {
      console.error("Failed to fetch subcategory metadata:", error);
      return [];
    }
  },
};

