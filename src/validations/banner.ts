import * as z from 'zod';
import type { TFunction } from "i18next";

export const createBannerSchema = (t: TFunction) => z.object({
  title: z.string().min(1, { message: t("banners.messages.errorTitleRequired") }),
  description: z.string().optional(),
  redirectType: z.enum(['Product', 'Category'], {
    message: t("banners.messages.errorTypeRequired")
  }),
  redirectId: z.string().min(1, { message: t("banners.messages.errorTargetRequired") }),
  redirectName: z.string().optional(),
  displayOrder: z.coerce.number().min(1, { message: t("banners.messages.errorOrderRequired") }),
  status: z.enum(['Active', 'Inactive']).default('Inactive'),
});

export interface BannerFormValues {
  title: string;
  description?: string;
  redirectType: "Product" | "Category";
  redirectId: string;
  redirectName?: string;
  displayOrder: number;
  status: "Active" | "Inactive";
}
