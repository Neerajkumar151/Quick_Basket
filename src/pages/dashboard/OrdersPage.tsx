import { useState, useEffect, useMemo } from "react";
import { RefreshCw, Eye, ShoppingCart, PackageCheck, Truck, XCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

import { PageHeader } from "../../components/ui/PageHeader";
import { FilterBar } from "../../components/ui/FilterBar";
import { SearchInput } from "../../components/ui/SearchInput";
import { Select } from "../../components/ui/Select";
import { DataTable, ColumnDef } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Pagination } from "../../components/ui/Pagination";
import { Button } from "../../components/ui/Button";
import { OrderDetailsDrawer } from "../../components/orders/OrderDetailsDrawer";

import { orderService } from "../../services/orderService";
import { Order, ORDER_STATUS } from "../../types/order";
import { formatCurrency } from "../../utils/number";
import { formatDateTime } from "../../utils/date";
import en from "../../locales/en.json";

const ITEMS_PER_PAGE = 10;

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Drawer
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchOrders = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch {
      toast.error(en.orders.messages.errorFetch);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await orderService.refreshOrders();
      setOrders(data);
      toast.success(en.orders.messages.refreshed);
    } catch {
      toast.error(en.orders.messages.errorFetch);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleStatusUpdated = (updated: Order) => {
    setOrders((prev) => prev.map((o: any) => (o.id === updated.id ? updated : o)));
    setSelectedOrder(updated);
  };

  // ── Stats cards ────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: orders.length,
    new: orders.filter((o: any) => o.status === ORDER_STATUS.NEW).length,
    outForDelivery: orders.filter((o: any) => o.status === ORDER_STATUS.OUT_FOR_DELIVERY).length,
    delivered: orders.filter((o: any) => o.status === ORDER_STATUS.DELIVERED).length,
    cancelled: orders.filter((o: any) => o.status === ORDER_STATUS.CANCELLED).length,
  }), [orders]);

  // ── Filter + Sort + Paginate ───────────────────────────────────────────────
  const processedOrders = useMemo(() => {
    let result = orders.filter((o: any) => {
      const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a: any, b: any) => {
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

  const totalPages = Math.ceil(processedOrders.length / ITEMS_PER_PAGE);
  const paginated = processedOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns: ColumnDef<Order>[] = [
    {
      header: en.orders.table.orderId,
      cell: (o: any) => (
        <span className="font-mono font-bold text-primary text-description">{o.id}</span>
      ),
    },
    {
      header: en.orders.table.customer,
      cell: (o: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{o.customerName}</span>
          <span className="text-caption text-muted-foreground">{o.customerPhone}</span>
        </div>
      ),
    },
    {
      header: en.orders.table.date,
      cell: (o: any) => (
        <span className="text-description text-muted-foreground whitespace-nowrap">
          {formatDateTime(o.orderDate)}
        </span>
      ),
    },
    {
      header: en.orders.table.amount,
      cell: (o: any) => (
        <span className="font-bold text-foreground">{formatCurrency(o.total)}</span>
      ),
    },
    {
      header: en.orders.table.status,
      cell: (o: any) => <StatusBadge status={o.status} />,
    },
    {
      header: en.orders.table.actions,
      className: "text-right",
      cell: (o: any) => (
        <div className="flex justify-end">
          <button
            onClick={() => handleViewOrder(o)}
            className="flex items-center gap-2 px-3 py-1.5 text-description font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
          >
            <Eye size={16} />
            {en.orders.table.view}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <PageHeader
        title={en.orders.header.title}
        description={en.orders.header.subtitle}
      />

      {/* ── Stats Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label={en.orders.stats.total}
          value={stats.total}
          icon={<ShoppingCart size={20} className="text-primary" />}
          color="bg-primary/10"
        />
        <StatCard
          label={en.orders.stats.new}
          value={stats.new}
          icon={<Clock size={20} className="text-warning" />}
          color="bg-warning/10"
        />
        <StatCard
          label={en.orders.stats.outForDelivery}
          value={stats.outForDelivery}
          icon={<Truck size={20} className="text-status-purple" />}
          color="bg-status-purple/10"
        />
        <StatCard
          label={en.orders.stats.delivered}
          value={stats.delivered}
          icon={<PackageCheck size={20} className="text-success" />}
          color="bg-success/10"
        />
        <StatCard
          label={en.orders.stats.cancelled}
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
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder={en.orders.filters.searchPlaceholder}
          />
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">{en.orders.filters.statusAll}</option>
            <option value={ORDER_STATUS.NEW}>{ORDER_STATUS.NEW}</option>
            <option value={ORDER_STATUS.ACCEPTED}>{ORDER_STATUS.ACCEPTED}</option>
            <option value={ORDER_STATUS.OUT_FOR_DELIVERY}>{ORDER_STATUS.OUT_FOR_DELIVERY}</option>
            <option value={ORDER_STATUS.DELIVERED}>{ORDER_STATUS.DELIVERED}</option>
            <option value={ORDER_STATUS.CANCELLED}>{ORDER_STATUS.CANCELLED}</option>
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
          >
            <option value="newest">{en.orders.filters.sortNewest}</option>
            <option value="oldest">{en.orders.filters.sortOldest}</option>
            <option value="amountHigh">{en.orders.filters.sortAmountHigh}</option>
            <option value="amountLow">{en.orders.filters.sortAmountLow}</option>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? en.orders.filters.refreshing : en.orders.filters.refresh}
          </Button>
        </div>
      </FilterBar>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col">
        <DataTable
          data={paginated}
          columns={columns}
          isLoading={isLoading}
          emptyTitle={en.orders.messages.emptyTitle}
          emptyDescription={en.orders.messages.emptySubtitle}
        />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* ── Drawer ───────────────────────────────────────────────────────── */}
      <OrderDetailsDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
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
