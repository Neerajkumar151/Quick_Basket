import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeProfileService, mapStoreProfile, mapStoreOperations, RawStoreProfile } from "../services/storeProfileService";
import { StoreProfileUpdateInput, StoreOperationsUpdateInput } from "../types/storeProfile";
import { apiClient } from "../utils/api-client";
import { ENDPOINTS } from "../constants/endpoints";

export const STORE_DATA_MASTER_KEY = ["storeDataMaster"];

// Master fetcher that hits the network exactly once
export const useStoreData = () => {
  return useQuery({
    queryKey: STORE_DATA_MASTER_KEY,
    queryFn: async (): Promise<RawStoreProfile> => {
      const response = await apiClient.get(ENDPOINTS.STORE.PROFILE);
      return response.data?.data ?? response.data ?? {};
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hooks for Profile Information
export const useStoreProfile = () => {
  const query = useStoreData();
  return {
    ...query,
    data: query.data ? mapStoreProfile(query.data) : undefined,
  };
};

export const useUpdateStoreProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, logoFile, bannerFile }: { data: StoreProfileUpdateInput; logoFile: File | null; bannerFile: File | null }) => 
      storeProfileService.updateStoreProfile(data, logoFile, bannerFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STORE_DATA_MASTER_KEY });
    },
  });
};

// Hooks for Store Operations
export const useStoreOperations = () => {
  const query = useStoreData();
  return {
    ...query,
    data: query.data ? mapStoreOperations(query.data) : undefined,
  };
};

export const useUpdateStoreOperations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StoreOperationsUpdateInput) => storeProfileService.updateStoreOperations(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STORE_DATA_MASTER_KEY });
    },
  });
};
