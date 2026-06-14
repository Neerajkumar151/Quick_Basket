import { useQuery } from '@tanstack/react-query';
import { catalogService } from '../services/catalogService';

export const CATALOG_METADATA_QUERY_KEY = 'catalogMetadata';
export const SUB_CATEGORIES_METADATA_QUERY_KEY = 'subCategoriesMetadata';

export function useCatalogMetadata() {
  return useQuery({
    queryKey: [CATALOG_METADATA_QUERY_KEY],
    queryFn: catalogService.getMetadata,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubCategoryMetadata(categoryId: string | undefined) {
  return useQuery({
    queryKey: [SUB_CATEGORIES_METADATA_QUERY_KEY, categoryId],
    queryFn: () => catalogService.getSubCategoryMetadata(categoryId as string),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}
