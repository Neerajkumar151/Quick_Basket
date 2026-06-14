import { Order, OrderStatus, ORDER_FLOW } from "../types/order";
import { apiClient } from "../utils/api-client";
import { ENDPOINTS } from "../constants/endpoints";

// ─── Raw API shape (adjust to your backend's actual response) ────────────────
interface RawOrder {
  id: string;
  customer?: { name?: string; phone?: string; email?: string };
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderDate?: string;
  createdAt?: string;
  status: string;
  deliveryAddress?: {
    flatNo?: string;
    area?: string;
    city?: string;
    pincode?: string;
    state?: string;
  };
  address?: {
    flatNo?: string;
    area?: string;
    city?: string;
    pincode?: string;
    state?: string;
  };
  items?: Array<{
    productId?: string;
    product?: { id?: string; name?: string };
    productName?: string;
    quantity?: number;
    unitPrice?: number;
    price?: number;
  }>;
  payment?: { method?: string; status?: string; transactionId?: string };
  timeline?: Array<{ status: string; timestamp: string; note?: string }>;
  subtotal?: number;
  deliveryFee?: number;
  tax?: number;
  total?: number;
  grandTotal?: number;
}

const mapOrder = (raw: RawOrder): Order => ({
  id: raw.id,
  customerName: raw.customer?.name ?? raw.customerName ?? "Unknown",
  customerPhone: raw.customer?.phone ?? raw.customerPhone ?? "",
  customerEmail: raw.customer?.email ?? raw.customerEmail ?? "",
  orderDate: raw.orderDate ?? raw.createdAt ?? new Date().toISOString(),
  status: raw.status as OrderStatus,
  address: {
    flatNo: raw.deliveryAddress?.flatNo ?? raw.address?.flatNo ?? "",
    area: raw.deliveryAddress?.area ?? raw.address?.area ?? "",
    city: raw.deliveryAddress?.city ?? raw.address?.city ?? "",
    pincode: raw.deliveryAddress?.pincode ?? raw.address?.pincode ?? "",
    state: raw.deliveryAddress?.state ?? raw.address?.state ?? "",
  },
  items: (raw.items ?? []).map((item) => ({
    productId: item.productId ?? item.product?.id ?? "",
    productName: item.productName ?? item.product?.name ?? "Unknown",
    quantity: item.quantity ?? 1,
    unitPrice: item.unitPrice ?? item.price ?? 0,
  })),
  payment: {
    method: (raw.payment?.method ?? "UPI") as Order["payment"]["method"],
    status: (raw.payment?.status ?? "Pending") as Order["payment"]["status"],
    transactionId: raw.payment?.transactionId,
  },
  timeline: (raw.timeline ?? []).map((entry) => ({
    status: entry.status as OrderStatus,
    timestamp: entry.timestamp,
    note: entry.note,
  })),
  subtotal: raw.subtotal ?? 0,
  deliveryFee: raw.deliveryFee ?? 0,
  tax: raw.tax ?? 0,
  total: raw.total ?? raw.grandTotal ?? 0,
});

// ─── Order Service ────────────────────────────────────────────────────────────
export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get(ENDPOINTS.ORDERS.BASE);
    const raw: RawOrder[] = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
      ? response.data
      : [];
    return raw.map(mapOrder);
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    const response = await apiClient.get(ENDPOINTS.ORDERS.DETAILS(id));
    const raw: RawOrder | undefined =
      response.data?.data ?? response.data?.order ?? response.data;
    if (!raw) return null;
    return mapOrder(raw);
  },

  /** Updates order status on the backend and returns the updated order */
  updateOrderStatus: async (id: string, newStatus: OrderStatus): Promise<Order> => {
    // Guard: enforce state machine on the client side too
    const current = await orderService.getOrderById(id);
    if (current) {
      const allowed = ORDER_FLOW[current.status];
      if (!allowed.includes(newStatus)) {
        throw new Error(`Cannot transition from "${current.status}" to "${newStatus}"`);
      }
    }

    const response = await apiClient.patch(ENDPOINTS.ORDERS.STATUS(id), {
      status: newStatus,
    });

    const raw: RawOrder | undefined =
      response.data?.data ?? response.data?.order ?? response.data;

    // If backend echoes back the full updated order, map it; otherwise re-fetch
    if (raw?.id) return mapOrder(raw);
    const refreshed = await orderService.getOrderById(id);
    if (!refreshed) throw new Error("Order not found after status update");
    return refreshed;
  },

  /** Re-fetches all orders (used by manual Refresh button) */
  refreshOrders: async (): Promise<Order[]> => {
    return orderService.getOrders();
  },
};
