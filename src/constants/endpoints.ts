/**
 * Centralized API Endpoints
 * All network requests should reference these constants rather than hardcoding strings.
 */

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/stores/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  MEDIA: {
    UPLOAD: "/media/upload",
  },
  ONBOARDING: {
    BASIC_INFO: "/stores/onboarding/basic-info",
    LOCATION: "/stores/onboarding/location",
    IDENTITY: "/stores/onboarding/identity",
    STATUS: "/stores/onboarding/status",
    DRAFT: "/stores/onboarding/draft",
    ME: "/stores/onboarding/me",
  },
  DASHBOARD: {
    GET: "/stores/dashboard",
  },
  CATEGORIES: {
    BASE: "/categories",
    ADMIN: "/admin/categories",
    STATUS: (id: string) => `/categories/${id}/status`,
  },
  SUB_CATEGORIES: {
    BASE: "/sub-categories",
    STATUS: (id: string) => `/sub-categories/${id}/status`,
  },
  CATALOG: {
    METADATA: "/catalog/metadata",
    SUB_CATEGORIES: (categoryId: string) => `/categories/${categoryId}/sub-categories`,
  },
  PRODUCTS: {
    BASE: "/products",
    ADMIN: "/admin/products",
    DETAILS: (id: string) => `/products/${id}`,
    STATUS: (id: string) => `/admin/products/${id}/status`,
  },
  ORDERS: {
    BASE: "/orders",
    DETAILS: (id: string) => `/orders/${id}`,
    STATUS: (id: string) => `/orders/${id}/status`,
  },
  STORE: {
    STATUS: "/store/status",
    PROFILE: "/stores/profile",
    OPERATIONS: "/stores/operations",
  },
  TAGS: {
    BASE: "/tags",
    ADMIN: "/admin/tags",
    STATUS: (id: string) => `/tags/${id}/status`,
  },
  BANNERS: {
    BASE: "/banners",
    ADMIN_BASE: "/admin/banners",
    STATUS: (id: string) => `/admin/banners/${id}/status`,
  },
} as const;
