import { formatShortDate } from '../utils/date';

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string; // base64 string or url
  productsCount: number;
  createdAt: string; // formatted date string e.g. "12 May"
}

export type CategoryInput = Omit<Category, 'id' | 'productsCount' | 'createdAt'>;

import mockData from '../constants/mock.json';

const STORAGE_KEY = 'quickbasket_categories';

// Initial mock data
const defaultCategories: Category[] = mockData.categories;

// Helper to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredCategories = (): Category[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  }
  return JSON.parse(stored);
};

export const categoryService = {
  // GET /categories
  getCategories: async (): Promise<Category[]> => {
    await delay();
    return getStoredCategories();
  },

  // POST /categories
  createCategory: async (data: CategoryInput): Promise<Category> => {
    await delay();
    const categories = getStoredCategories();
    
    // Check duplicate
    if (categories.some(c => c.name.toLowerCase() === data.name.toLowerCase())) {
      throw new Error("Category already exists");
    }

    const newCategory: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      productsCount: 0,
      createdAt: formatShortDate(new Date())
    };

    categories.unshift(newCategory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    return newCategory;
  },

  // PUT /categories/:id
  updateCategory: async (id: string, data: Partial<CategoryInput>): Promise<Category> => {
    await delay();
    const categories = getStoredCategories();
    
    // Check duplicate
    if (data.name) {
      if (categories.some(c => c.id !== id && c.name.toLowerCase() === data.name!.toLowerCase())) {
        throw new Error("Category already exists");
      }
    }

    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Category not found");

    categories[index] = { ...categories[index], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    return categories[index];
  },

  // DELETE /categories/:id
  deleteCategory: async (id: string): Promise<void> => {
    await delay();
    const categories = getStoredCategories();
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
