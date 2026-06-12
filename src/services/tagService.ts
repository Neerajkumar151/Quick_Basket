import { formatShortDate } from "../utils/date";
import { Tag } from "../types/tag";

export type { Tag };

import mockData from "../constants/mock.json";

const STORAGE_KEY = "quickbasket_tags";

const defaultTags: Tag[] = mockData.tags as Tag[];

// Helper to simulate network delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredTags = (): Tag[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTags));
    return defaultTags;
  }
  const parsed = JSON.parse(stored);

  // Force update if the stored mock data is older/smaller than the new mock data
  if (parsed.length < defaultTags.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTags));
    return defaultTags;
  }

  return parsed;
};

export const tagService = {
  // GET /tags
  getTags: async (): Promise<Tag[]> => {
    await delay();
    return getStoredTags();
  },

  // POST /tags
  createTag: async (
    data: Omit<Tag, "id" | "createdAt" | "productsCount">
  ): Promise<Tag> => {
    await delay();
    const tags = getStoredTags();

    // Check duplicate
    if (tags.some((t) => t.name.toLowerCase() === data.name.toLowerCase())) {
      throw new Error("Tag already exists");
    }

    const newTag: Tag = {
      ...data,
      id: `tag-${Date.now()}`,
      productsCount: 0,
      status: data.status || "Active",
      createdAt: formatShortDate(new Date()),
    };

    tags.unshift(newTag);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
    return newTag;
  },

  // PATCH /tags/:id/status
  toggleStatus: async (id: string): Promise<Tag> => {
    await delay();
    const tags = getStoredTags();
    const index = tags.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Tag not found");

    ((tags[index] as Tag).status) = ((tags[index] as Tag).status) === "Active" ? "Inactive" : "Active";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
    return tags[index] as Tag;
  },

  // PUT /tags/:id
  updateTag: async (
    id: string,
    data: Partial<Omit<Tag, "id" | "createdAt" | "productsCount">>
  ): Promise<Tag> => {
    await delay();
    const tags = getStoredTags();

    // Check duplicate
    if (data.name) {
      if (
        tags.some(
          (t) => t.id !== id && t.name.toLowerCase() === data.name!.toLowerCase()
        )
      ) {
        throw new Error("Tag already exists");
      }
    }

    const index = tags.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Tag not found");

    tags[index] = { ...(tags[index] as Tag), ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
    return tags[index] as Tag;
  },
};
