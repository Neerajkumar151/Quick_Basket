import * as z from 'zod';
import en from '../locales/en.json';

export const bannerSchema = z.object({
  title: z.string().min(1, { message: en.banners.messages.errorTitleRequired }),
  description: z.string().optional(),
  redirectType: z.enum(['Product', 'Category'], {
    message: en.banners.messages.errorTypeRequired
  }),
  redirectId: z.string().min(1, { message: en.banners.messages.errorTargetRequired }),
  redirectName: z.string().optional(),
  displayOrder: z.coerce.number().min(1, { message: en.banners.messages.errorOrderRequired }),
  status: z.enum(['Active', 'Inactive']).default('Inactive'),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;
