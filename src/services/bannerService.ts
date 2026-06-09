import { formatShortDate } from "../utils/date";
import { Banner, BannerInput, RedirectType, BannerStatus } from "../types/banner";

export type { Banner, BannerInput, RedirectType, BannerStatus };

const STORAGE_KEY = "quickbasket_banners";

import { defaultBanners } from "../constants/mockSeedData";

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
      ...(banners[index] as Banner),
      ...data,
      updatedAt: formatShortDate(new Date()),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
    return banners[index] as Banner;
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

    (banners[index] as Banner).status = (banners[index] as Banner).status === "Active" ? "Inactive" : "Active";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
    return banners[index] as Banner;
  },
};
