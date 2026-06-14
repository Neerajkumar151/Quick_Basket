export const queryKeys = {
  products: ['products'] as const,
  orders: ['orders'] as const,
  categories: ['categories'] as const,
  categoryTree: ['categoryTree'] as const,
  subCategories: ['subCategories'] as const,
  banners: ['banners'] as const,
  tags: ['tags'] as const,
  catalogMetadata: ['catalogMetadata'] as const,
  subCategoryMetadata: (categoryId?: string) => ['subCategoryMetadata', categoryId] as const,
  storeProfile: ['storeProfile'] as const,
  reports: {
    sales: ['reports', 'sales'] as const,
    trends: ['reports', 'trends'] as const,
    revenue: ['reports', 'revenue'] as const,
    revenueBreakdown: ['reports', 'revenueBreakdown'] as const,
  }
};
