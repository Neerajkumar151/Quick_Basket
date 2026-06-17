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
    flat?: string;
    area?: string;
    street?: string;
    city?: string;
    pincode?: string;
    state?: string;
  };
  items?: Array<{
    productId?: string;
    product?: { id?: string; name?: string };
    productName?: string;
    name?: string;
    quantity?: number;
    unitPrice?: number;
    price?: number;
    image?: string;
  }>;
  payment?: { method?: string; status?: string; transactionId?: string };
  timeline?: Array<{ status: string; timestamp: string; note?: string }>;
  subtotal?: number;
  deliveryFee?: number;
  deliveryCharge?: number;
  tax?: number;
  taxes?: number;
  total?: number;
  totalAmount?: number;
  grandTotal?: number;
  availableStatusUpdates?: string[];
}

const mapBackendStatusToFrontend = (status: string): OrderStatus => {
  const s = status.toLowerCase().replace(/_/g, " ");
  switch (s) {
    case "pending": return "Pending";
    case "confirmed": return "Processing"; // Map confirmed to processing
    case "processing": return "Processing";
    case "out for delivery": return "Out for Delivery";
    case "delivered": return "Delivered";
    case "cancelled": return "Cancelled";
    default: return (status.charAt(0).toUpperCase() + status.slice(1)) as OrderStatus;
  }
};

const mapOrder = (raw: RawOrder): Order => ({
  id: raw.id,
  customerName: raw.customer?.name ?? raw.customerName ?? "Unknown",
  customerPhone: raw.customer?.phone ?? raw.customerPhone ?? "",
  customerEmail: raw.customer?.email ?? raw.customerEmail ?? "",
  orderDate: raw.orderDate ?? raw.createdAt ?? new Date().toISOString(),
  status: mapBackendStatusToFrontend(raw.status),
  address: {
    flatNo: raw.deliveryAddress?.flatNo ?? raw.address?.flatNo ?? raw.address?.flat ?? "",
    area: raw.deliveryAddress?.area ?? raw.address?.area ?? raw.address?.street ?? "",
    city: raw.deliveryAddress?.city ?? raw.address?.city ?? "",
    pincode: raw.deliveryAddress?.pincode ?? raw.address?.pincode ?? "",
    state: raw.deliveryAddress?.state ?? raw.address?.state ?? "",
  },
  items: (raw.items ?? []).map((item) => ({
    productId: item.productId ?? item.product?.id ?? "",
    productName: item.productName ?? item.product?.name ?? item.name ?? "Unknown",
    quantity: item.quantity ?? 1,
    unitPrice: item.unitPrice ?? item.price ?? 0,
    image: item.image,
  })),
  payment: {
    method: ((raw as any).paymentMethod ?? raw.payment?.method ?? "UPI") as Order["payment"]["method"],
    status: ((raw as any).paymentStatus ?? raw.payment?.status ?? "Pending") as Order["payment"]["status"],
    transactionId: raw.payment?.transactionId,
  },
  timeline: (raw.timeline ?? []).map((entry) => ({
    status: mapBackendStatusToFrontend(entry.status),
    timestamp: entry.timestamp,
    note: entry.note,
  })),
  subtotal: raw.subtotal ?? 0,
  deliveryFee: raw.deliveryFee ?? raw.deliveryCharge ?? 0,
  tax: raw.tax ?? raw.taxes ?? 0,
  total: raw.totalAmount ?? raw.total ?? raw.grandTotal ?? 0,
  availableStatusUpdates: Array.from(new Set((raw.availableStatusUpdates ?? []).map(mapBackendStatusToFrontend))),
});

// ─── Order Service ────────────────────────────────────────────────────────────
export const orderService = {
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    status?: string;
    search?: string;
  }): Promise<{ data: Order[]; meta: any }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("order", params.sortOrder);
    if (params?.status && params.status !== "all") queryParams.append("status", params.status.toLowerCase());
    if (params?.search) queryParams.append("search", params.search);

    const response = await apiClient.get(`${ENDPOINTS.ORDERS.BASE}?${queryParams.toString()}`);
    const raw: RawOrder[] = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
      ? response.data
      : [];
    return { data: raw.map(mapOrder), meta: response.data?.meta || { total: raw.length, page: 1, totalPages: 1 } };
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
  refreshOrders: async (): Promise<{ data: Order[]; meta: any }> => {
    return orderService.getOrders();
  },
};
