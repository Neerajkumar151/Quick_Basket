import {
  Order,
  OrderStatus,
  ORDER_FLOW,
  TimelineEntry,
} from "../types/order";

const ORDERS_STORAGE_KEY = "qb_store_admin_orders";

import { SEED_ORDERS } from "../constants/mockSeedData";

// ─── Storage Helpers ─────────────────────────────────────────────────────────
const getStoredOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error("Failed to save orders", error);
  }
};

const initializeOrders = () => {
  const current = getStoredOrders();
  if (current.length === 0) {
    saveOrders(SEED_ORDERS);
  }
};

initializeOrders();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Order Service ────────────────────────────────────────────────────────────
export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    await delay(600);
    return getStoredOrders();
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    await delay(300);
    const orders = getStoredOrders();
    return orders.find((o) => o.id === id) || null;
  },

  /** Updates order status and automatically appends a timeline entry */
  updateOrderStatus: async (id: string, newStatus: OrderStatus): Promise<Order> => {
    await delay(600);
    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Order not found");

    const current = orders[index] as Order;

    // Guard: enforce state machine
    const allowed = ORDER_FLOW[current.status];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Cannot transition from "${current.status}" to "${newStatus}"`);
    }

    const newEntry: TimelineEntry = {
      status: newStatus,
      timestamp: new Date().toISOString(),
    };

    const updated: Order = {
      ...current,
      status: newStatus,
      timeline: [...current.timeline, newEntry],
    };

    orders[index] = updated;
    saveOrders(orders);
    return updated;
  },

  /** Convenience: re-fetch, used by Refresh button */
  refreshOrders: async (): Promise<Order[]> => {
    await delay(400);
    return getStoredOrders();
  },
};
