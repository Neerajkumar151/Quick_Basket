import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export const DASHBOARD_QUERY_KEY = ["dashboard"];

export const useDashboard = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: dashboardService.getDashboard,
  });
};
