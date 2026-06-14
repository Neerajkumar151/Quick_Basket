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
import { useOrders } from "../../hooks/useOrders";
import { useDebounce } from "../../hooks/useDebounce";
import { Order, ORDER_STATUS } from "../../types/order";
import { formatCurrency } from "../../utils/number";
import { formatDateTime } from "../../utils/date";
import { useTranslation } from "react-i18next";

export const OrdersPage = () => {
  const { t } = useTranslation();
  const { data: fetchedOrders, isLoading, isError, refetch, isRefetching } = useOrders();
  const orders = fetchedOrders || [];

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Drawer
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefresh = async () => {
    await refetch();
    toast.success(t("orders.messages.refreshed"));
  };

  const handleViewOrder = async (order: Order) => {
    const toastId = toast.loading(t("orders.messages.loadingDetails", "Loading order details..."));
    try {
      const fullOrder = orders.find((o) => o.id === order.id) || order;
      if (fullOrder) {
        setSelectedOrder(fullOrder);
        setIsModalOpen(true);
      } else {
        toast.error(t("orders.messages.errorFetchDetails", "Failed to load order details."));
      }
    } catch {
      toast.error(t("orders.messages.errorFetchDetails", "Failed to load order details."));
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleStatusUpdated = (updated: Order) => {
    setSelectedOrder(updated);
  };

  // ── Stats cards ────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: orders.length,
    new: orders.filter((o: Order) => o.status === ORDER_STATUS.PENDING).length,
    outForDelivery: orders.filter((o: Order) => o.status === ORDER_STATUS.OUT_FOR_DELIVERY).length,
    delivered: orders.filter((o: Order) => o.status === ORDER_STATUS.DELIVERED).length,
    cancelled: orders.filter((o: Order) => o.status === ORDER_STATUS.CANCELLED).length,
  }), [orders]);

  // ── Filter + Sort + Paginate ───────────────────────────────────────────────
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const processedOrders = useMemo(() => {
    let result = orders.filter((o: Order) => {
      const matchesSearch = o.id.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a: Order, b: Order) => {
      switch (sortBy) {
        case "oldest": return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
        case "amountHigh": return b.total - a.total;
        case "amountLow": return a.total - b.total;
        case "newest":
        default: return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      }
    });

    return result;
  }, [orders, searchQuery, statusFilter, sortBy]);

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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
            <option value="amountHigh">{t("orders.filters.sortAmountHigh")}</option>
            <option value="amountLow">{t("orders.filters.sortAmountLow")}</option>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefetching}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isRefetching ? "animate-spin" : ""} />
            {isRefetching ? t("orders.filters.refreshing") : t("orders.filters.refresh")}
          </Button>
        </div>
      </FilterBar>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col">
        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <DataTable
            data={processedOrders}
            columns={columns}
            isLoading={isLoading}
            keyExtractor={(item) => item.id}
            emptyTitle={t("orders.messages.emptyTitle")}
            emptyDescription={t("orders.messages.emptySubtitle")}
            itemsPerPage={10}
          />
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
  <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 shadow-sm">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-h3 font-bold text-foreground">{value}</span>
      <span className="text-caption text-muted-foreground">{label}</span>
    </div>
  </div>
);
