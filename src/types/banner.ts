export type RedirectType = "Product" | "Category";
export type BannerStatus = "Active" | "Inactive";

export interface Banner {
  id: string;
  title: string;
  description?: string;
  image?: string;
  redirectType: RedirectType;
  redirectId: string;
  redirectName: string;
  displayOrder: number;
  status: BannerStatus;
  createdAt: string;
  updatedAt: string;
}

export type BannerInput = Omit<Banner, "id" | "createdAt" | "updatedAt">;
