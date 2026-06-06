import * as z from "zod";
import en from "../locales/en.json";

export const storeProfileSchema = z.object({
  storeName: z.string().min(1, en.storeProfile.messages.validationName),
  ownerName: z.string().min(1, "Owner Name is required"),
  description: z.string().optional(),
  phoneNumber: z.string().min(1, en.storeProfile.messages.validationPhone),
  email: z.string().email(en.storeProfile.messages.validationEmail),
  address: z.string().min(1, en.storeProfile.messages.validationAddress),
});

export type StoreProfileFormValues = z.infer<typeof storeProfileSchema>;
