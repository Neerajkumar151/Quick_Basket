import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeProfileService } from "../services/storeProfileService";
import { StoreProfileUpdateInput, StoreOperationsUpdateInput } from "../types/storeProfile";

export const STORE_PROFILE_QUERY_KEY = ["storeProfile"];
export const STORE_OPERATIONS_QUERY_KEY = ["storeOperations"];

// Hooks for Profile Information
export const useStoreProfile = () => {
  return useQuery({
    queryKey: STORE_PROFILE_QUERY_KEY,
    queryFn: storeProfileService.getStoreProfile,
  });
};

export const useUpdateStoreProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StoreProfileUpdateInput) => storeProfileService.updateStoreProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STORE_PROFILE_QUERY_KEY });
    },
  });
};

// Hooks for Store Operations
export const useStoreOperations = () => {
  return useQuery({
    queryKey: STORE_OPERATIONS_QUERY_KEY,
    queryFn: storeProfileService.getStoreOperations,
  });
};

export const useUpdateStoreOperations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StoreOperationsUpdateInput) => storeProfileService.updateStoreOperations(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STORE_OPERATIONS_QUERY_KEY });
    },
  });
};
