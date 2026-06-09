import { useState, useCallback } from 'react';

export function useEntityDrawer<T>() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const openDrawer = useCallback((item?: T) => {
    setEditingItem(item || null);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    setEditingItem(null);
  }, []);

  return {
    isOpen,
    editingItem,
    openDrawer,
    closeDrawer,
  };
}
