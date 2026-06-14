export interface DashboardStore {
  name: string;
  logoUrl: string;
  bannerUrl: string;
  verificationStatus: string;
  storeStatus: string;
  businessHours: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface DashboardAnalytics {
  revenueTrend: ChartDataPoint[];
  orderTrend: ChartDataPoint[];
  orderStatusDistribution: any[]; // You can refine this if orderStatusDistribution returns a specific structure
}

export interface RecentOrder {
  id: string;
  customer: string;
  time: string;
  status: string;
  amount: string;
}

export interface DashboardResponse {
  store: DashboardStore;
  metrics: DashboardMetrics;
  analytics: DashboardAnalytics;
  recentOrders: RecentOrder[];
}
