import {
  Order,
  OrderStatus,
  ORDER_STATUS,
  ORDER_FLOW,
  TimelineEntry,
} from "../types/order";

const ORDERS_STORAGE_KEY = "qb_store_admin_orders";

// ─── Realistic Mock Seed Data ────────────────────────────────────────────────
const SEED_ORDERS: Order[] = [
  {
    id: "ORD-1001",
    customerName: "Ravi Sharma",
    customerPhone: "+91 98765 43210",
    customerEmail: "ravi.sharma@gmail.com",
    orderDate: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    status: ORDER_STATUS.NEW,
    address: { flatNo: "12A", area: "Koramangala 5th Block", city: "Bengaluru", pincode: "560095", state: "Karnataka" },
    items: [
      { productId: "p1", productName: "Fresh Organic Bananas", quantity: 3, unitPrice: 45 },
      { productId: "p2", productName: "Amul Full Cream Milk 1L", quantity: 2, unitPrice: 68 },
    ],
    payment: { method: "UPI", status: "Paid", transactionId: "TXN2025060501" },
    timeline: [{ status: ORDER_STATUS.NEW, timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() }],
    subtotal: 271, deliveryFee: 30, tax: 14, total: 315,
  },
  {
    id: "ORD-1002",
    customerName: "Priya Mehta",
    customerPhone: "+91 91234 56789",
    customerEmail: "priya.mehta@outlook.com",
    orderDate: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: ORDER_STATUS.ACCEPTED,
    address: { flatNo: "B-204", area: "Whitefield", city: "Bengaluru", pincode: "560066", state: "Karnataka" },
    items: [
      { productId: "p3", productName: "Whole Wheat Bread", quantity: 1, unitPrice: 55 },
      { productId: "p4", productName: "Amul Butter 100g", quantity: 2, unitPrice: 55 },
      { productId: "p5", productName: "Tata Salt 1kg", quantity: 1, unitPrice: 28 },
    ],
    payment: { method: "Cash on Delivery", status: "Pending" },
    timeline: [
      { status: ORDER_STATUS.NEW, timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
      { status: ORDER_STATUS.ACCEPTED, timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
    ],
    subtotal: 193, deliveryFee: 40, tax: 12, total: 245,
  },
  {
    id: "ORD-1003",
    customerName: "Arjun Nair",
    customerPhone: "+91 87654 32109",
    customerEmail: "arjun.nair@yahoo.com",
    orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: ORDER_STATUS.OUT_FOR_DELIVERY,
    address: { flatNo: "Villa 7", area: "Electronic City Phase 1", city: "Bengaluru", pincode: "560100", state: "Karnataka" },
    items: [
      { productId: "p6", productName: "iPhone 14 Pro Max 256GB", quantity: 1, unitPrice: 129900 },
    ],
    payment: { method: "Card", status: "Paid", transactionId: "TXN2025060503" },
    timeline: [
      { status: ORDER_STATUS.NEW, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { status: ORDER_STATUS.ACCEPTED, timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString() },
      { status: ORDER_STATUS.OUT_FOR_DELIVERY, timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
    ],
    subtotal: 129900, deliveryFee: 0, tax: 6495, total: 136395,
  },
  {
    id: "ORD-1004",
    customerName: "Sunita Agarwal",
    customerPhone: "+91 99988 77665",
    customerEmail: "sunita.a@rediffmail.com",
    orderDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: ORDER_STATUS.DELIVERED,
    address: { flatNo: "301", area: "JP Nagar 7th Phase", city: "Bengaluru", pincode: "560078", state: "Karnataka" },
    items: [
      { productId: "p7", productName: "Aashirvaad Atta 5kg", quantity: 1, unitPrice: 285 },
      { productId: "p8", productName: "Fortune Sunflower Oil 1L", quantity: 2, unitPrice: 155 },
      { productId: "p1", productName: "Fresh Organic Bananas", quantity: 1, unitPrice: 45 },
    ],
    payment: { method: "UPI", status: "Paid", transactionId: "TXN2025060504" },
    timeline: [
      { status: ORDER_STATUS.NEW, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
      { status: ORDER_STATUS.ACCEPTED, timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString() },
      { status: ORDER_STATUS.OUT_FOR_DELIVERY, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
      { status: ORDER_STATUS.DELIVERED, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    ],
    subtotal: 640, deliveryFee: 30, tax: 32, total: 702,
  },
  {
    id: "ORD-1005",
    customerName: "Mohammed Khalid",
    customerPhone: "+91 77711 22334",
    customerEmail: "m.khalid@gmail.com",
    orderDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: ORDER_STATUS.CANCELLED,
    address: { flatNo: "8/1", area: "Shivajinagar", city: "Bengaluru", pincode: "560001", state: "Karnataka" },
    items: [
      { productId: "p9", productName: "Dove Soap (Pack of 3)", quantity: 1, unitPrice: 189 },
      { productId: "p2", productName: "Amul Full Cream Milk 1L", quantity: 4, unitPrice: 68 },
    ],
    payment: { method: "Net Banking", status: "Failed" },
    timeline: [
      { status: ORDER_STATUS.NEW, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
      { status: ORDER_STATUS.CANCELLED, timestamp: new Date(Date.now() - 2.8 * 60 * 60 * 1000).toISOString(), note: "Payment failed" },
    ],
    subtotal: 461, deliveryFee: 40, tax: 23, total: 524,
  },
  {
    id: "ORD-1006",
    customerName: "Deepika Reddy",
    customerPhone: "+91 88822 55566",
    customerEmail: "deepika.r@company.com",
    orderDate: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    status: ORDER_STATUS.NEW,
    address: { flatNo: "A-12", area: "Indiranagar 100 Feet Road", city: "Bengaluru", pincode: "560038", state: "Karnataka" },
    items: [
      { productId: "p10", productName: "Greek Yogurt 400g", quantity: 2, unitPrice: 120 },
      { productId: "p4", productName: "Amul Butter 100g", quantity: 1, unitPrice: 55 },
    ],
    payment: { method: "UPI", status: "Paid", transactionId: "TXN2025060506" },
    timeline: [{ status: ORDER_STATUS.NEW, timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString() }],
    subtotal: 295, deliveryFee: 30, tax: 15, total: 340,
  },
];

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

    const current = orders[index];

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
