import { z } from "zod";

export const basicInfoSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters").max(50, "Store name is too long"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  email: z.string().email("Please enter a valid business email").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|ac\.in|co\.in|gov|mil|io|co|us|uk)$/i, "Please enter a genuine email address (e.g. .com, .in, .ac.in)"),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

export const locationDetailsSchema = z.object({
  streetAddress: z.string().min(5, "Street address must be at least 5 characters"),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Valid PIN code is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type LocationDetailsFormValues = z.infer<typeof locationDetailsSchema>;

export const businessIdentitySchema = z.object({
  businessType: z.string().min(1, "Please select a business type"),
  gstin: z
    .string()
    .optional()
    .refine((val) => !val || val.trim() === "" || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val), {
      message: "Please enter a valid 15-digit GSTIN",
    }),
  pan: z
    .string()
    .min(1, "PAN Number is required")
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN (e.g. ABCDE1234F)"),
  registrationDate: z.string().min(1, "Registration date is required"),
  registrationProof: z
    .any()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files?.[0]?.size <= 10 * 1024 * 1024,
      "Max file size is 10MB"
    )
    .refine(
      (files) =>
        !files || files.length === 0 || ["application/pdf", "image/png", "image/jpeg"].includes(files?.[0]?.type),
      "Only PDF, PNG, and JPG formats are supported"
    ),
});

export type BusinessIdentityFormValues = z.infer<typeof businessIdentitySchema>;