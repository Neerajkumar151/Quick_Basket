import { z } from "zod";
import type { TFunction } from "i18next";

export const createProductSchema = (t: TFunction) => z
  .object({
    name: z.string().min(1, t("products.validation.nameRequired")),
    description: z.string().optional(),
    brand: z.string().optional(),
    sellingPrice: z.coerce.number().min(0, t("products.validation.sellingPriceMin")),
    mrp: z.coerce.number().optional(),
    stockQuantity: z.coerce.number().min(0, t("products.validation.stockQuantityMin")).default(0),
    categoryId: z.string().min(1, t("products.validation.categoryRequired")),
    subCategoryId: z.string().min(1, t("products.validation.subCategoryRequired", "Sub-Category is required")),
    tagIds: z.array(z.string()).default([]),
    images: z.array(z.string()).min(1, t("products.validation.imagesRequired")),
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
      message: t("products.validation.mrpExceeded"),
      path: ["sellingPrice"],
    }
  );

export interface ProductFormValues {
  name: string;
  description?: string;
  brand?: string;
  sellingPrice: number;
  mrp?: number;
  stockQuantity: number;
  categoryId: string;
  subCategoryId: string;
  tagIds: string[];
  images: string[];
  status: "Active" | "Inactive";
}
