import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import { queryKeys } from "../constants/queryKeys";

export function useOrders(params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: [...queryKeys.orders, params],
    queryFn: () => orderService.getOrders(params),
  });
}
