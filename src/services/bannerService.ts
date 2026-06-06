import { formatShortDate } from "../utils/date";
import { Banner, BannerInput, RedirectType, BannerStatus } from "../types/banner";

export type { Banner, BannerInput, RedirectType, BannerStatus };

const STORAGE_KEY = "quickbasket_banners";

const defaultBanners: Banner[] = [
  {
    id: "banner-1",
    title: "Latest iPhone Collection",
    description: "Discover the newest iPhones with amazing cameras.",
    image: "https://images.unsplash.com/photo-1603791164998-3160e1d13db1?w=800&q=80",
    redirectType: "Product",
    redirectId: "prod-1",
    redirectName: "iPhone 14 Pro Max",
    displayOrder: 1,
    status: "Active",
    createdAt: "12 May",
    updatedAt: "12 May",
  },
  {
    id: "banner-2",
    title: "Fresh Vegetables",
    description: "Get daily fresh organic vegetables delivered.",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80",
    redirectType: "Category",
    redirectId: "cat-1",
    redirectName: "Vegetables",
    displayOrder: 2,
    status: "Active",
    createdAt: "15 May",
    updatedAt: "15 May",
  },
];

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredBanners = (): Banner[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBanners));
    return defaultBanners;
  }
  return JSON.parse(stored);
};

export const bannerService = {
  getBanners: async (): Promise<Banner[]> => {
    await delay();
    const banners = getStoredBanners();
    return banners.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  createBanner: async (data: BannerInput): Promise<Banner> => {
    await delay();
    const banners = getStoredBanners();

    const newBanner: Banner = {
      ...data,
      id: `banner-${Date.now()}`,
      createdAt: formatShortDate(new Date()),
      updatedAt: formatShortDate(new Date()),
    };

    banners.push(newBanner);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
    return newBanner;
  },

  updateBanner: async (id: string, data: Partial<BannerInput>): Promise<Banner> => {
    await delay();
    const banners = getStoredBanners();

    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Banner not found");

    banners[index] = {
      ...banners[index],
      ...data,
      updatedAt: formatShortDate(new Date()),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
    return banners[index];
  },

  deleteBanner: async (id: string): Promise<void> => {
    await delay();
    const banners = getStoredBanners();
    const filtered = banners.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  toggleStatus: async (id: string): Promise<Banner> => {
    await delay();
    const banners = getStoredBanners();
    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Banner not found");

    banners[index].status = banners[index].status === "Active" ? "Inactive" : "Active";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
    return banners[index];
  },
};
