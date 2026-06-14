import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import { queryKeys } from "../constants/queryKeys";
import { OrderStatus } from "../types/order";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { DASHBOARD_QUERY_KEY } from "./useDashboard";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      toast.success(t("orders.messages.successUpdate", "Order status updated successfully"));
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['salesMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['revenueMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['revenueTrends'] });
      queryClient.invalidateQueries({ queryKey: ['revenueBreakdown'] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : t("orders.messages.errorUpdate", "Failed to update order status");
      toast.error(message);
    },
  });
}
