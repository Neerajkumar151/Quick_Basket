import { apiClient } from "../utils/api-client";
import { ENDPOINTS } from "../constants/endpoints";
import { DashboardResponse } from "../types/dashboard";

export const dashboardService = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.GET);
    return response.data?.data;
  },
};
