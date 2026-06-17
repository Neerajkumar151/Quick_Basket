import { StoreProfile, StoreOperations, StoreProfileUpdateInput, StoreOperationsUpdateInput, WeekDay, BusinessHour } from "../types/storeProfile";
import { apiClient } from "../utils/api-client";
import { ENDPOINTS } from "../constants/endpoints";
import { resolveImageUrl } from "../utils/image";
export interface RawStoreProfile {
  id?: string;
  name?: string;
  address?: string;
  businessType?: string;
  gstNumber?: string | null;
  panNumber?: string | null;
  verificationStatus?: string;
  rejectionRemarks?: string | null;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  description?: string | null;
  contactNumber?: string | null;
  email?: string | null;
  status?: string;
  openingTime?: string | null;
  closingTime?: string | null;
  workingDays?: string | null;
  deliveryEnabled?: boolean;
  minOrderAmount?: string;
  estimatedDeliveryTime?: string | null;
  currentStep?: number;
  onboardingStatus?: string;
  basicInfoStatus?: string;
  basicInfoRemark?: string | null;
  locationStatus?: string;
  locationRemark?: string | null;
  identityStatus?: string;
  identityRemark?: string | null;
  streetAddress?: string;
  landmark?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
  businessRegistrationDate?: string;
  isActive?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export const mapStoreProfile = (raw: RawStoreProfile): StoreProfile => {
  let verificationStatus: "verified" | "pending" | "rejected" = "pending";
  if (raw.verificationStatus === "approved" || raw.verificationStatus === "verified") {
    verificationStatus = "verified";
  } else if (raw.verificationStatus === "rejected") {
    verificationStatus = "rejected";
  }

  let address = raw.address && raw.address !== "null" ? raw.address : "";
  if (!address) {
    address = [raw.streetAddress, raw.landmark, raw.city, raw.state, raw.postalCode, raw.country]
      .filter(Boolean)
      .join(", ");
  }

  return {
    id: raw.id ?? "",
    storeName: raw.name ?? "",
    ownerName: raw.ownerName ?? "",
    description: raw.description ?? "",
    phoneNumber: raw.ownerPhone ?? raw.contactNumber ?? "",
    email: raw.ownerEmail ?? raw.email ?? "",
    address: address,
    businessType: raw.businessType,
    gstNumber: raw.gstNumber ?? undefined,
    panNumber: raw.panNumber ?? undefined,
    businessRegistrationDate: raw.businessRegistrationDate,
    streetAddress: raw.streetAddress,
    landmark: raw.landmark,
    city: raw.city,
    state: raw.state,
    postalCode: raw.postalCode,
    country: raw.country,
    logoUrl: resolveImageUrl(raw.logoUrl ?? undefined),
    bannerUrl: resolveImageUrl(raw.bannerUrl ?? undefined),
    verificationStatus: verificationStatus,
    lastUpdated: raw.updated_at ?? raw.created_at ?? new Date().toISOString(),
  };
};

const ALL_DAYS: WeekDay[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const mapStoreOperations = (raw: RawStoreProfile): StoreOperations => {
  const activeDays = raw.workingDays ? raw.workingDays.split(",").map(d => d.trim()) : [];
  const openTime = raw.openingTime || "09:00";
  const closeTime = raw.closingTime || "21:00";

  const businessHours: BusinessHour[] = ALL_DAYS.map(day => ({
    day,
    enabled: activeDays.includes(day),
    openingTime: openTime,
    closingTime: closeTime
  }));

  return {
    storeStatus: raw.status === "Open",
    deliveryEnabled: raw.deliveryEnabled ?? false,
    minimumOrderAmount: parseFloat(raw.minOrderAmount || "0"),
    estimatedDeliveryTime: raw.estimatedDeliveryTime ? parseInt(raw.estimatedDeliveryTime, 10) : 30,
    businessHours
  };
};

export const storeProfileService = {
  updateStoreProfile: async (data: StoreProfileUpdateInput, logoFile?: File | null, bannerFile?: File | null): Promise<StoreProfile> => {
    const formData = new FormData();
    if (data.storeName !== undefined) formData.append("name", data.storeName);
    if (data.ownerName !== undefined) formData.append("ownerName", data.ownerName);
    if (data.description !== undefined) formData.append("description", data.description);
    if (data.phoneNumber !== undefined) formData.append("contactNumber", data.phoneNumber);
    if (data.email !== undefined) formData.append("email", data.email);
    if (data.address !== undefined) formData.append("address", data.address);
    if (data.businessType !== undefined) formData.append("businessType", data.businessType);
    if (data.gstNumber !== undefined) formData.append("gstNumber", data.gstNumber);
    if (data.panNumber !== undefined) formData.append("panNumber", data.panNumber);
    
    if (logoFile) formData.append("logo", logoFile);
    if (bannerFile) formData.append("banner", bannerFile);

    const response = await apiClient.put(ENDPOINTS.STORE.PROFILE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const raw: RawStoreProfile = response.data?.data ?? response.data ?? {};
    return mapStoreProfile(raw);
  },

  updateStoreOperations: async (data: StoreOperationsUpdateInput): Promise<StoreOperations> => {
    let payload: Record<string, string | boolean | number> = {};

    if (data.deliveryEnabled !== undefined) payload.deliveryEnabled = data.deliveryEnabled;
    if (data.minimumOrderAmount !== undefined) payload.minOrderAmount = data.minimumOrderAmount.toString();
    if (data.estimatedDeliveryTime !== undefined) payload.estimatedDeliveryTime = data.estimatedDeliveryTime.toString();
    
    if (data.storeStatus !== undefined) {
      payload.status = data.storeStatus ? "Open" : "Closed";
      payload.isActive = data.storeStatus; 
    }

    if (data.businessHours) {
      const activeDays = data.businessHours.filter(h => h.enabled).map(h => h.day).join(",");
      payload.workingDays = activeDays;
      
      const firstActive = data.businessHours.find(h => h.enabled);
      if (firstActive) {
        payload.openingTime = firstActive.openingTime;
        payload.closingTime = firstActive.closingTime;
      } else {
        // Fallback if all days disabled
        payload.openingTime = "09:00";
        payload.closingTime = "21:00";
      }
    }

    const response = await apiClient.put(ENDPOINTS.STORE.OPERATIONS, payload);
    const raw: RawStoreProfile = response.data?.data ?? response.data ?? {};
    return mapStoreOperations(raw);
  }
};
