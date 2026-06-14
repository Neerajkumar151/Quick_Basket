import { useQuery } from '@tanstack/react-query';
import { reportsService, DateRange } from '../services/reports.service';

export const REPORTS_QUERY_KEYS = {
  sales: (period: string) => ['salesMetrics', period],
  revenue: (period: string, start?: string, end?: string) => ['revenueMetrics', period, start, end],
  trends: (period: string, start?: string, end?: string) => ['revenueTrends', period, start, end],
  breakdown: (period: string, start?: string, end?: string) => ['revenueBreakdown', period, start, end],
};

export const useSalesMetrics = (period: DateRange) => {
  return useQuery({
    queryKey: REPORTS_QUERY_KEYS.sales(period),
    queryFn: () => reportsService.getSalesMetrics(period),
  });
};

export const useRevenueMetrics = (period: DateRange, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: REPORTS_QUERY_KEYS.revenue(period, startDate, endDate),
    queryFn: () => reportsService.getRevenueMetrics(period, startDate, endDate),
    enabled: period !== 'custom' || (!!startDate && !!endDate),
  });
};

export const useRevenueTrends = (period: DateRange, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: REPORTS_QUERY_KEYS.trends(period, startDate, endDate),
    queryFn: () => reportsService.getRevenueTrends(period, startDate, endDate),
    enabled: period !== 'custom' || (!!startDate && !!endDate),
  });
};

export const useRevenueBreakdown = (period: DateRange, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: REPORTS_QUERY_KEYS.breakdown(period, startDate, endDate),
    queryFn: () => reportsService.getRevenueBreakdown(period, startDate, endDate),
    enabled: period !== 'custom' || (!!startDate && !!endDate),
  });
};
