import { Product } from "../types/product";
import mockData from "../constants/mock.json";

export type { Product };

const PRODUCTS_STORAGE_KEY = "qb_store_admin_products";

const getStoredProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse products from local storage", error);
    return [];
  }
};

const saveProducts = (products: Product[]) => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Failed to save products to local storage", error);
    throw new Error("Storage limit exceeded. If you uploaded an image, it might be too large.");
  }
};

// Seed from mock.json if localStorage is empty
const initializeProducts = () => {
  const current = getStoredProducts();
  if (current.length === 0) {
    const seedProducts: Product[] = (mockData.products as Omit<Product, "createdAt" | "updatedAt">[]).map(
      (p) => ({
        ...p,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
    saveProducts(seedProducts);
  }
};

initializeProducts();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    await delay(600);
    return getStoredProducts();
  },

  getProductById: async (id: string): Promise<Product | null> => {
    await delay(300);
    const products = getStoredProducts();
    return products.find((p) => p.id === id) || null;
  },

  createProduct: async (
    data: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> => {
    await delay(600);
    const products = getStoredProducts();
    const newProduct: Product = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    saveProducts(products);
    return newProduct;
  },

  updateProduct: async (
    id: string,
    data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
  ): Promise<Product> => {
    await delay(600);
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");

    const updatedProduct = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    products[index] = updatedProduct as Product;
    saveProducts(products);
    return updatedProduct as Product;
  },
};
