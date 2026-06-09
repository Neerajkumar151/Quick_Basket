import { SubCategory, SubCategoryInput } from "../types/subCategory";
import mockData from "../constants/mock.json";

const STORAGE_KEY = "quickbasket_subCategories";

const getStoredSubCategories = (): SubCategory[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
};

const saveSubCategories = (subCategories: SubCategory[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subCategories));
};

// Seed some initial data if empty
const initializeSubCategories = () => {
  const current = getStoredSubCategories();
  if (current.length === 0) {
    const mockSubCategories: SubCategory[] = (mockData.subCategories as Omit<SubCategory, "updatedAt">[]).map(
      (sc) => ({
        ...sc,
        updatedAt: new Date().toISOString(),
      })
    );
    saveSubCategories(mockSubCategories);
  }
};

initializeSubCategories();

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const subCategoryService = {
  getSubCategories: async (): Promise<SubCategory[]> => {
    await delay(600);
    const subCategories = getStoredSubCategories();
    // Sort by newest first based on createdAt (or id as fallback if dates aren't parsed well)
    // As in mock.json createdAt is "17 May", let's assume we sort based on ID generation order or keep reversing
    // We'll rely on string comparison for simple dates or just return reversed so newest added is first
    return [...subCategories].reverse();
  },

  getSubCategoriesByParent: async (categoryId: string): Promise<SubCategory[]> => {
    await delay(300);
    const subCategories = getStoredSubCategories();
    return [...subCategories]
      .filter((sc) => sc.categoryId === categoryId)
      .reverse(); // Newest first
  },

  getSubCategoryById: async (id: string): Promise<SubCategory | null> => {
    await delay(300);
    const subCategories = getStoredSubCategories();
    return subCategories.find((c) => c.id === id) || null;
  },

  createSubCategory: async (data: SubCategoryInput): Promise<SubCategory> => {
    await delay(600);
    const subCategories = getStoredSubCategories();

    const newSubCategory: SubCategory = {
      ...data,
      id: `subcat-${Date.now()}`,
      productsCount: 0,
      createdAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      updatedAt: new Date().toISOString(),
    };

    // Push appends to the end, but since we reverse on get, it will show at the top
    subCategories.push(newSubCategory);
    saveSubCategories(subCategories);

    return newSubCategory;
  },

  updateSubCategory: async (
    id: string,
    data: Partial<SubCategoryInput>
  ): Promise<SubCategory> => {
    await delay(600);
    const subCategories = getStoredSubCategories();
    const index = subCategories.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new Error("Sub-Category not found");
    }

    const updatedSubCategory = {
      ...subCategories[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    subCategories[index] = updatedSubCategory as SubCategory;
    saveSubCategories(subCategories);

    return updatedSubCategory as SubCategory;
  },

  toggleStatus: async (id: string): Promise<SubCategory> => {
    await delay(400);
    const subCategories = getStoredSubCategories();
    const index = subCategories.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new Error("Sub-Category not found");
    }

    const newStatus =
      ((subCategories[index] as SubCategory).status) === "Active" ? "Inactive" : "Active";
    const updatedSubCategory = {
      ...subCategories[index],
      status: newStatus as "Active" | "Inactive",
      updatedAt: new Date().toISOString(),
    };

    subCategories[index] = updatedSubCategory as SubCategory;
    saveSubCategories(subCategories);

    return updatedSubCategory as SubCategory;
  },
};
