export interface Product {
  id: string;
  name: string;
  description?: string;
  sellingPrice: number;
  mrp?: number;
  stockQuantity: number;
  categoryId: string;
  tagIds: string[];
  images: string[];
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

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
  }
};

// Seed some initial data if empty
const initializeProducts = () => {
  const current = getStoredProducts();
  if (current.length === 0) {
    const mockProducts: Product[] = [
      {
        id: "prod_1",
        name: "Fresh Organic Bananas",
        description: "A bunch of 6 fresh organic bananas.",
        sellingPrice: 2.5,
        mrp: 3.0,
        stockQuantity: 150,
        categoryId: "1", // Assuming 'Fruits' has ID 1 or similar in category service
        tagIds: ["tag_1"], // Assuming 'Organic' has tag_1
        images: ["https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=400"],
        status: "Active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    saveProducts(mockProducts);
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
    products[index] = updatedProduct;
    saveProducts(products);
    return updatedProduct;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await delay(600);
    const products = getStoredProducts();
    const updatedProducts = products.filter((p) => p.id !== id);
    saveProducts(updatedProducts);
  },
};
