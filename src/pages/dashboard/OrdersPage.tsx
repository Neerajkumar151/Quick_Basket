import { useState, useMemo } from "react";
import { RefreshCw, Eye, ShoppingCart, PackageCheck, Truck, XCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

import { PageHeader } from "../../components/ui/PageHeader";
import { FilterBar } from "../../components/ui/FilterBar";
import { SearchInput } from "../../components/ui/SearchInput";
import { Select } from "../../components/ui/Select";
import { DataTable, ColumnDef } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Button } from "../../components/ui/Button";
import { ErrorState } from "../../components/ui/ErrorState";
import { OrderDetailsModal } from "../../components/orders/OrderDetailsModal";
import { Pagination } from "../../components/ui/Pagination";
import { useOrders } from "../../hooks/useOrders";
import { useDashboard } from "../../hooks/useDashboard";
import { useDebounce } from "../../hooks/useDebounce";
import { Order, ORDER_STATUS } from "../../types/order";
import { formatCurrency } from "../../utils/number";
import { formatDateTime } from "../../utils/date";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../utils/api-client";
import { ENDPOINTS } from "../../constants/endpoints";
import { orderService } from "../../services/orderService";

export const OrdersPage = () => {
  const { t } = useTranslation();
  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: dashboardData, refetch: refetchDashboard, isRefetching: isRefetchingDashboard } = useDashboard();
  const metrics = dashboardData?.metrics;

  let apiSortBy = "createdAt";
  let apiSortOrder = "desc";
  if (sortBy === "oldest") {
    apiSortOrder = "asc";
  } else if (sortBy === "amountHigh") {
    apiSortBy = "totalAmount";
    apiSortOrder = "desc";
  } else if (sortBy === "amountLow") {
    apiSortBy = "totalAmount";
    apiSortOrder = "asc";
  }

  const { data: ordersResponse, isLoading, isError, refetch, isRefetching } = useOrders({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchQuery,
    status: statusFilter,
    sortBy: apiSortBy,
    sortOrder: apiSortOrder,
  });

  const orders = ordersResponse?.data || [];
  const totalPages = ordersResponse?.meta?.totalPages || 1;
  const totalItems = ordersResponse?.meta?.total || 0;

  // Drawer
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchDashboard()]);
    toast.success(t("orders.messages.refreshed"));
  };

  const handleViewOrder = async (order: Order) => {
    const toastId = toast.loading(t("orders.messages.loadingDetails", "Loading order details..."));
    try {
      // Fetch and map the API response into our internal Order structure
      const fullOrder = await orderService.getOrderById(order.id);
      
      if (fullOrder) {
        setSelectedOrder(fullOrder);
        setIsModalOpen(true);
      } else {
        toast.error(t("orders.messages.errorFetchDetails", "Failed to load order details."));
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      toast.error(t("orders.messages.errorFetchDetails", "Failed to load order details."));
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleStatusUpdated = (updated: Order) => {
    setSelectedOrder(updated);
  };

  // ── Stats cards ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const distribution = dashboardData?.analytics?.orderStatusDistribution || [];
    const getCount = (statusName: string) => 
      distribution.find(d => d.name.toLowerCase() === statusName.toLowerCase())?.value || 0;

    if (metrics) {
      return {
        total: metrics.totalOrders || 0,
        new: metrics.pendingOrders || 0,
        processing: getCount('processing'),
        outForDelivery: getCount('out for delivery'),
        delivered: metrics.deliveredOrders || 0,
        cancelled: metrics.cancelledOrders || 0,
      };
    }
    return {
      total: totalItems || orders.length,
      new: orders.filter((o: Order) => o.status === ORDER_STATUS.PENDING).length,
      processing: orders.filter((o: Order) => o.status === ORDER_STATUS.PROCESSING).length,
      outForDelivery: orders.filter((o: Order) => o.status === ORDER_STATUS.OUT_FOR_DELIVERY).length,
      delivered: orders.filter((o: Order) => o.status === ORDER_STATUS.DELIVERED).length,
      cancelled: orders.filter((o: Order) => o.status === ORDER_STATUS.CANCELLED).length,
    };
  }, [metrics, dashboardData, orders, totalItems]);

  const columns: ColumnDef<Order>[] = [
    {
      header: t("orders.table.orderId"),
      cell: (o: Order) => (
        <span className="font-mono font-bold text-primary text-description" title={o.id}>
          #{o.id.split('-')[0]?.toUpperCase()}
        </span>
      ),
    },
    {
      header: t("orders.table.customer"),
      cell: (o: Order) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{o.customerName}</span>
          <span className="text-caption text-muted-foreground">{o.customerPhone}</span>
        </div>
      ),
    },
    {
      header: t("orders.table.date"),
      cell: (o: Order) => (
        <span className="text-description text-muted-foreground whitespace-nowrap">
          {formatDateTime(o.orderDate)}
        </span>
      ),
    },
    {
      header: t("orders.table.amount"),
      cell: (o: Order) => (
        <span className="font-bold text-foreground">{formatCurrency(o.total)}</span>
      ),
    },
    {
      header: t("orders.table.status"),
      cell: (o: Order) => <StatusBadge status={o.status} />,
    },
    {
      header: t("orders.table.payment", "Payment"),
      cell: (o: Order) => (
        <div className="flex flex-col gap-1 items-start">
          <StatusBadge status={o.payment?.status} />
          <span className="text-caption text-muted-foreground uppercase tracking-wider font-medium">
            {o.payment?.method}
          </span>
        </div>
      ),
    },
    {
      header: t("orders.table.actions"),
      className: "text-right",
      cell: (o: Order) => (
        <div className="flex justify-end">
          <button
            onClick={() => handleViewOrder(o)}
            className="flex items-center gap-2 px-3 py-1.5 text-description font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
          >
            <Eye size={16} />
            {t("orders.table.view")}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <PageHeader
        title={t("orders.header.title")}
        description={t("orders.header.subtitle")}
      />

      {/* ── Stats Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label={t("orders.stats.total")}
          value={stats.total}
          icon={<ShoppingCart size={20} className="text-primary" />}
          color="bg-primary/10"
        />
        <StatCard
          label={t("orders.stats.new")}
          value={stats.new}
          icon={<Clock size={20} className="text-warning" />}
          color="bg-warning/10"
        />
        <StatCard
          label={t("orders.stats.processing")}
          value={stats.processing}
          icon={<RefreshCw size={20} className="text-status-blue" />}
          color="bg-status-blue/10"
        />
        <StatCard
          label={t("orders.stats.outForDelivery")}
          value={stats.outForDelivery}
          icon={<Truck size={20} className="text-status-purple" />}
          color="bg-status-purple/10"
        />
        <StatCard
          label={t("orders.stats.delivered")}
          value={stats.delivered}
          icon={<PackageCheck size={20} className="text-success" />}
          color="bg-success/10"
        />
        <StatCard
          label={t("orders.stats.cancelled")}
          value={stats.cancelled}
          icon={<XCircle size={20} className="text-error" />}
          color="bg-error/10"
        />
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <FilterBar>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <SearchInput
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); }}
            placeholder={t("orders.filters.searchPlaceholder")}
          />
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); }}
          >
            <option value="all">{t("orders.filters.statusAll")}</option>
            <option value={ORDER_STATUS.PENDING}>{ORDER_STATUS.PENDING}</option>
            <option value={ORDER_STATUS.PROCESSING}>{ORDER_STATUS.PROCESSING}</option>
            <option value={ORDER_STATUS.OUT_FOR_DELIVERY}>{ORDER_STATUS.OUT_FOR_DELIVERY}</option>
            <option value={ORDER_STATUS.DELIVERED}>{ORDER_STATUS.DELIVERED}</option>
            <option value={ORDER_STATUS.CANCELLED}>{ORDER_STATUS.CANCELLED}</option>
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); }}
          >
            <option value="newest">{t("orders.filters.sortNewest")}</option>
            <option value="oldest">{t("orders.filters.sortOldest")}</option>
            {/* <option value="amountHigh">{t("orders.filters.sortAmountHigh")}</option>
            <option value="amountLow">{t("orders.filters.sortAmountLow")}</option> */}
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefetching || isRefetchingDashboard}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isRefetching || isRefetchingDashboard ? "animate-spin" : ""} />
            {isRefetching || isRefetchingDashboard ? t("orders.filters.refreshing") : t("orders.filters.refresh")}
          </Button>
        </div>
      </FilterBar>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <>
            <DataTable
              data={orders}
              columns={columns}
              isLoading={isLoading}
              keyExtractor={(item) => item.id}
              emptyTitle={t("orders.messages.emptyTitle")}
              emptyDescription={t("orders.messages.emptySubtitle")}
              pagination={false}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      {/* ── Modal ────────────────────────────────────────────────────────── */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdated={handleStatusUpdated}
      />
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  label, value, icon, color,
}: { label: string; value: number; icon: React.ReactNode; color: string }) => (
  <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 shadow-sm">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div className="flex flex-col flex-1 min-w-0">
      <span className="text-h2 font-bold text-foreground truncate">{value}</span>
      <span className="text-caption font-medium text-muted-foreground leading-tight mt-0.5 break-words line-clamp-2" title={label}>{label}</span>
    </div>
  </div>
);
