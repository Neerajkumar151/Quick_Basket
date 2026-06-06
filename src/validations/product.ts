import { z } from "zod";
import en from "../locales/en.json";

export const productSchema = z
  .object({
    name: z.string().min(1, en.products.validation.nameRequired),
    description: z.string().optional(),
    sellingPrice: z.coerce.number().min(0, en.products.validation.sellingPriceMin),
    mrp: z.coerce.number().optional(),
    stockQuantity: z.coerce.number().min(0, en.products.validation.stockQuantityMin).default(0),
    categoryId: z.string().min(1, en.products.validation.categoryRequired),
    tagIds: z.array(z.string()).default([]),
    images: z.array(z.string()).min(1, en.products.validation.imagesRequired),
    status: z.enum(["Active", "Inactive"]).default("Inactive"),
  })
  .refine(
    (data) => {
      if (data.mrp !== undefined && data.mrp !== null && data.mrp > 0) {
        return data.sellingPrice <= data.mrp;
      }
      return true;
    },
    {
      message: en.products.validation.mrpExceeded,
      path: ["sellingPrice"],
    }
  );

export type ProductFormValues = z.infer<typeof productSchema>;
