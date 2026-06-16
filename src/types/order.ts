// ─── Order Status Enum ─────────────────────────────────────────────────────
export const ORDER_STATUS = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// ─── State Machine ──────────────────────────────────────────────────────────
export const ORDER_FLOW: Record<OrderStatus, OrderStatus[]> = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.OUT_FOR_DELIVERY],
  [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: [],
};

// ─── Sub-types ──────────────────────────────────────────────────────────────
export interface Address {
  flatNo: string;
  area: string;
  city: string;
  pincode: string;
  state: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

export interface PaymentInfo {
  method: "UPI" | "Cash on Delivery" | "Card" | "Net Banking";
  status: "Paid" | "Pending" | "Failed";
  transactionId?: string;
}

export interface TimelineEntry {
  status: OrderStatus;
  timestamp: string; // ISO string
  note?: string;
}

// ─── Main Order Interface ────────────────────────────────────────────────────
export interface Order {
  id: string;
  customerId?: string;
  storeName?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderDate: string; // ISO string
  status: OrderStatus;
  address: Address;
  items: OrderItem[];
  payment: PaymentInfo;
  timeline: TimelineEntry[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  availableStatusUpdates?: string[];
}
