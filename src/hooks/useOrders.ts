import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import { queryKeys } from "../constants/queryKeys";

export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: () => orderService.getOrders(),
  });
}
