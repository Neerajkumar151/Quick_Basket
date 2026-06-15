import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export const DASHBOARD_QUERY_KEY = ["dashboard"];

export const useDashboard = (filters?: { period?: string }) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, filters],
    queryFn: () => dashboardService.getDashboard(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });
};
