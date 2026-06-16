import * as z from "zod";
import type { TFunction } from "i18next";

export const createStoreProfileSchema = (t: TFunction) => z.object({
  storeName: z.string().min(1, t("storeProfile.messages.validationName")),
  ownerName: z.string().min(1, t("storeProfile.contact.ownerName")),
  description: z.string().optional(),
  phoneNumber: z.string().min(1, t("storeProfile.messages.validationPhone")),
  email: z.string().email(t("storeProfile.messages.validationEmail")).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|ac\.in|co\.in|gov|mil|io|co|us|uk)$/i, "Please enter a genuine email address (e.g. .com, .in, .ac.in)"),
  address: z.string().optional(),
  businessType: z.string().optional(),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
});

export type StoreProfileFormValues = z.infer<ReturnType<typeof createStoreProfileSchema>>;
