import { StoreProfile, StoreOperations, StoreProfileUpdateInput, StoreOperationsUpdateInput } from "../types/storeProfile";
import mockData from "../constants/mock.json";

const PROFILE_STORAGE_KEY = "quickbasket_store_profile";
const OPERATIONS_STORAGE_KEY = "quickbasket_store_operations";

const defaultProfile: StoreProfile = mockData.storeProfile as StoreProfile;
const defaultOperations: StoreOperations = mockData.storeOperations as unknown as StoreOperations;

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredProfile = (): StoreProfile => {
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }
  return { ...defaultProfile, ...JSON.parse(stored) };
};

const getStoredOperations = (): StoreOperations => {
  const stored = localStorage.getItem(OPERATIONS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(OPERATIONS_STORAGE_KEY, JSON.stringify(defaultOperations));
    return defaultOperations;
  }
  return JSON.parse(stored);
};

export const storeProfileService = {
  getStoreProfile: async (): Promise<StoreProfile> => {
    await delay();
    return getStoredProfile();
  },

  updateStoreProfile: async (data: StoreProfileUpdateInput): Promise<StoreProfile> => {
    await delay();
    const currentProfile = getStoredProfile();
    const updatedProfile = {
      ...currentProfile,
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    return updatedProfile;
  },

  getStoreOperations: async (): Promise<StoreOperations> => {
    await delay();
    return getStoredOperations();
  },

  updateStoreOperations: async (data: StoreOperationsUpdateInput): Promise<StoreOperations> => {
    await delay();
    const currentOperations = getStoredOperations();
    const updatedOperations = {
      ...currentOperations,
      ...data
    };
    localStorage.setItem(OPERATIONS_STORAGE_KEY, JSON.stringify(updatedOperations));
    return updatedOperations;
  }
};
