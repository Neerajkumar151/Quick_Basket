/**
 * Typed interfaces that mirror the exact JSON shapes returned by the backend.
 * Using these instead of `any` ensures TypeScript catches field-name mismatches
 * at compile time rather than silently at runtime.
 */

// ─── Category ──────────────────────────────────────────────────────────────

/** Shape returned by GET /admin/categories (paginated listing) */
export interface RawApiCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  categoryImage?: string;
  status?: string;
  isActive?: boolean;
  productsCount?: number;
  createdAt?: string;
  created_at?: string;
}

/** Shape returned by GET /categories (tree / flat list) */
export interface RawApiCategoryTreeItem {
  id: string;
  parentId: string | null;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  parent?: { id: string; name: string } | null;
  subcategories?: RawApiCategoryTreeItem[];
}

// ─── Sub-Category ───────────────────────────────────────────────────────────

/** Shape returned by GET /sub-categories (paginated listing) */
export interface RawApiSubCategory {
  id: string;
  categoryId?: string;
  name?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  status?: string;
  isActive?: boolean;
  productsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Banner ─────────────────────────────────────────────────────────────────

/** Shape returned by GET /banners */
export interface RawApiBanner {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  redirectType?: string;
  redirectId?: string;
  targetId?: string;
  categoryId?: string;
  productId?: string;
  redirectName?: string;
  targetName?: string;
  displayOrder?: number;
  priority?: number;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
