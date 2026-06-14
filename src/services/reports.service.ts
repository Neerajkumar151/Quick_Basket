import { apiClient } from '../utils/api-client';
import { ENDPOINTS } from '../constants/endpoints';
import { RecentOrder } from '../types/dashboard';

export type DateRange = 'today' | 'thisWeek' | 'thisMonth' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface SalesMetrics {
  totalOrders: number;
  totalSales: number;
  totalRevenue: number;
  deliveredOrders: number;
  cancelledOrders: number;
  aov: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  grossRevenue: number;
  totalOrders: number;
  deliveredRevenue: number;
}

export interface TrendDataPoint {
  name: string;
  value: number;
}

const buildQueryParams = (period: DateRange, startDate?: string, endDate?: string, metric?: 'sales' | 'revenue') => {
  const params: Record<string, string> = { period };
  if (period === 'custom' && startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  if (metric) {
    params.metric = metric;
  }
  return params;
};

export const reportsService = {
  getSalesMetrics: async (period: DateRange, startDate?: string, endDate?: string): Promise<SalesMetrics> => {
    const response = await apiClient.get(ENDPOINTS.REPORTS.SALES_METRICS, {
      params: buildQueryParams(period, startDate, endDate)
    });
    return response.data?.data;
  },

  getRevenueMetrics: async (period: DateRange, startDate?: string, endDate?: string): Promise<RevenueMetrics> => {
    const response = await apiClient.get(ENDPOINTS.REPORTS.REVENUE_METRICS, {
      params: buildQueryParams(period, startDate, endDate)
    });
    return response.data?.data;
  },

  getRevenueTrends: async (period: DateRange, startDate?: string, endDate?: string): Promise<TrendDataPoint[]> => {
    const response = await apiClient.get(ENDPOINTS.REPORTS.TRENDS, {
      params: buildQueryParams(period, startDate, endDate, 'revenue')
    });
    return response.data?.data;
  },

  getRevenueBreakdown: async (period: DateRange, startDate?: string, endDate?: string): Promise<RecentOrder[]> => {
    const response = await apiClient.get(ENDPOINTS.REPORTS.REVENUE_BREAKDOWN, {
      params: buildQueryParams(period, startDate, endDate)
    });
    return response.data?.data || [];
  }
};
