import React from "react";
import { Wallet, ShoppingBag, Package, AlertTriangle, TrendingUp, Clock, Truck, XCircle, CheckCircle2 } from "lucide-react";
import en from "../../locales/en.json";

const PRIMARY_KPI_DATA = [
  {
    title: en.dashboard.kpis.primary.revenue,
    value: "$128,430.50",
    icon: Wallet,
    colorClass: "text-status-delivered",
    bgClass: "bg-status-delivered/10",
  },
  {
    title: en.dashboard.kpis.primary.orders,
    value: "4,829",
    icon: ShoppingBag,
    colorClass: "text-status-processing",
    bgClass: "bg-status-processing/10",
  },
  {
    title: en.dashboard.kpis.primary.products,
    value: "1,240",
    icon: Package,
    colorClass: "text-status-purple",
    bgClass: "bg-status-purple/10",
  },
  {
    title: en.dashboard.kpis.primary.lowStock,
    value: "14",
    icon: AlertTriangle,
    colorClass: "text-status-cancelled",
    bgClass: "bg-status-cancelled/10",
  },
];

const ORDER_STATUS_KPI = [
  {
    title: en.dashboard.kpis.orderStatus.pending,
    value: "24",
    icon: Clock,
    colorClass: "text-status-pending",
    bgClass: "bg-status-pending/10",
    borderClass: "hover:border-status-pending/50",
  },
  {
    title: en.dashboard.kpis.orderStatus.processing,
    value: "38",
    icon: Package,
    colorClass: "text-status-processing",
    bgClass: "bg-status-processing/10",
    borderClass: "hover:border-status-processing/50",
  },
  {
    title: en.dashboard.kpis.orderStatus.delivered,
    value: "401",
    icon: CheckCircle2,
    colorClass: "text-status-delivered",
    bgClass: "bg-status-delivered/10",
    borderClass: "hover:border-status-delivered/50",
  },
  {
    title: en.dashboard.kpis.orderStatus.cancelled,
    value: "19",
    icon: XCircle,
    colorClass: "text-status-cancelled",
    bgClass: "bg-status-cancelled/10",
    borderClass: "hover:border-status-cancelled/50",
  },
];

export const KPICards: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRIMARY_KPI_DATA.map((kpi, idx) => (
          <div key={idx} className="bg-card border border-border rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] hover:shadow-md hover:border-border/80 transition-all group flex flex-col justify-between min-h-[110px]">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{kpi.title}</h3>
              <div className={`p-2 rounded-lg ${kpi.bgClass} ${kpi.colorClass}`}>
                <kpi.icon size={20} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">{kpi.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Order Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ORDER_STATUS_KPI.map((kpi, idx) => (
          <div key={idx} className={`bg-card/50 border border-border rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between cursor-pointer group min-h-[110px] ${kpi.borderClass}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{kpi.title}</h3>
              <div className={`p-2 rounded-lg ${kpi.bgClass} ${kpi.colorClass}`}>
                <kpi.icon size={20} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">{kpi.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
