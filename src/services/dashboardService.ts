import { apiClient } from "../utils/api-client";
import { ENDPOINTS } from "../constants/endpoints";
import { DashboardResponse } from "../types/dashboard";

export const dashboardService = {
  getDashboard: async (filters?: { period?: string }): Promise<DashboardResponse> => {
    try {
      const response = await apiClient.get(ENDPOINTS.DASHBOARD.GET, { params: filters });
      return response.data?.data;
    } catch (error) {
      console.error("DASHBOARD API ERROR:", error);
      throw error;
    }
  },
};
