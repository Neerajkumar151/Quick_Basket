import { formatShortDate } from '../utils/date';

export interface Tag {
  id: string;
  name: string;
  productsCount: number;
  createdAt: string; // formatted date string e.g. "12 May"
}

import mockData from '../constants/mock.json';

const STORAGE_KEY = 'quickbasket_tags';

// Initial mock data
const defaultTags: Tag[] = mockData.tags;

// Helper to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredTags = (): Tag[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTags));
    return defaultTags;
  }
  return JSON.parse(stored);
};

export const tagService = {
  // GET /tags
  getTags: async (): Promise<Tag[]> => {
    await delay();
    return getStoredTags();
  },

  // POST /tags
  createTag: async (data: Omit<Tag, 'id' | 'createdAt' | 'productsCount'>): Promise<Tag> => {
    await delay();
    const tags = getStoredTags();
    
    // Check duplicate
    if (tags.some(t => t.name.toLowerCase() === data.name.toLowerCase())) {
      throw new Error("Tag already exists");
    }

    const newTag: Tag = {
      ...data,
      id: `tag-${Date.now()}`,
      productsCount: 0,
      createdAt: formatShortDate(new Date())
    };

    tags.unshift(newTag);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
    return newTag;
  },

  // PUT /tags/:id
  updateTag: async (id: string, data: Partial<Omit<Tag, 'id' | 'createdAt' | 'productsCount'>>): Promise<Tag> => {
    await delay();
    const tags = getStoredTags();
    
    // Check duplicate
    if (data.name) {
      if (tags.some(t => t.id !== id && t.name.toLowerCase() === data.name!.toLowerCase())) {
        throw new Error("Tag already exists");
      }
    }

    const index = tags.findIndex(t => t.id === id);
    if (index === -1) throw new Error("Tag not found");

    tags[index] = { ...tags[index], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
    return tags[index];
  }
};
