export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface StoreProfile {
  id: string;
  storeName: string;
  ownerName: string;
  description: string;
  phoneNumber: string;
  email: string;
  address: string;
  logoUrl: string;
  bannerUrl: string;
  verificationStatus: "verified" | "pending" | "rejected";
  businessType?: string;
  gstNumber?: string;
  panNumber?: string;
  businessRegistrationDate?: string;
  streetAddress?: string;
  landmark?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  lastUpdated: string;
}

export interface BusinessHour {
  day: WeekDay;
  enabled: boolean;
  openingTime: string; // HH:mm format, e.g. "09:00"
  closingTime: string; // HH:mm format, e.g. "21:00"
}

export interface StoreOperations {
  storeStatus: boolean; // true = open, false = closed
  deliveryEnabled: boolean;
  minimumOrderAmount: number;
  estimatedDeliveryTime: number; // in minutes
  businessHours: BusinessHour[];
}

export type StoreProfileUpdateInput = Partial<Omit<StoreProfile, "id" | "verificationStatus" | "lastUpdated">>;
export type StoreOperationsUpdateInput = Partial<StoreOperations>;
