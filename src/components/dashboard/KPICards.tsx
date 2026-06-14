import React from "react";
import {
  Wallet,
  ShoppingBag,
  Package,
  Clock,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { DashboardMetrics } from "../../types/dashboard";

export interface KPICardsProps {
  metrics?: DashboardMetrics;
  items?: KPIItem[];
}

// Map string icon names from JSON to actual React Lucide components
const IconMap: Record<string, any> = {
  Wallet,
  ShoppingBag,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
};

const resolveKpiData = (kpiArray: { title: string, icon: string, bgClass: string, colorClass: string, value: string, borderClass?: string }[], t: TFunction) => {
  return kpiArray.map((kpi) => {
    return {
      ...kpi,
      title: t(kpi.title as any),
      icon: IconMap[kpi.icon],
    };
  });
};

export interface KPIItem {
  id?: string;
  title: string;
  value?: string | number;
  icon: any;
  bgClass: string;
  colorClass: string;
  borderClass?: string;
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics, items }) => {
  const { t } = useTranslation();

  // Construct KPI arrays from real metrics
  const primaryKpiData = resolveKpiData([
    {
      title: "dashboard.kpis.primary.revenue",
      value: `₹${metrics?.totalRevenue?.toLocaleString() || "0"}`,
      icon: "Wallet",
      colorClass: "text-status-delivered",
      bgClass: "bg-status-delivered/10"
    },
    {
      title: "dashboard.kpis.primary.orders",
      value: `${metrics?.totalOrders?.toLocaleString() || "0"}`,
      icon: "ShoppingBag",
      colorClass: "text-primary",
      bgClass: "bg-primary/10"
    },
    {
      title: "dashboard.kpis.primary.products",
      value: `${metrics?.totalProducts?.toLocaleString() || "0"}`,
      icon: "Package",
      colorClass: "text-status-purple",
      bgClass: "bg-status-purple/10"
    }
  ], t);

  const orderStatusKpi = resolveKpiData([
    {
      title: "dashboard.kpis.orderStatus.pending",
      value: `${metrics?.pendingOrders?.toLocaleString() || "0"}`,
      icon: "Clock",
      colorClass: "text-status-pending",
      bgClass: "bg-status-pending/10",
      borderClass: "hover:border-status-pending/50"
    },
    {
      title: "dashboard.kpis.orderStatus.delivered",
      value: `${metrics?.deliveredOrders?.toLocaleString() || "0"}`,
      icon: "CheckCircle2",
      colorClass: "text-status-delivered",
      bgClass: "bg-status-delivered/10",
      borderClass: "hover:border-status-delivered/50"
    },
    {
      title: "dashboard.kpis.orderStatus.cancelled",
      value: `${metrics?.cancelledOrders?.toLocaleString() || "0"}`,
      icon: "XCircle",
      colorClass: "text-status-cancelled",
      bgClass: "bg-status-cancelled/10",
      borderClass: "hover:border-status-cancelled/50"
    }
  ], t);

  if (items) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((kpi, idx) => (
          <div
            key={`kpi-${kpi.id || idx}`}
            className={`bg-card border border-border rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] hover:shadow-md hover:border-border/80 transition-all group flex flex-col justify-between min-h-[110px] ${kpi.borderClass || ''}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-caption font-bold text-muted-foreground uppercase tracking-wider">
                {kpi.title}
              </h3>
              <div className={`p-2 rounded-lg ${kpi.bgClass} ${kpi.colorClass}`}>
                <kpi.icon size={20} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-h1 font-extrabold text-foreground tracking-tight">
                {kpi.value ?? '-'}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* Primary Metrics */}
      {primaryKpiData.map((kpi, idx) => (
        <div
          key={`primary-${idx}`}
          className="bg-card border border-border rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] hover:shadow-md hover:border-border/80 transition-all group flex flex-col justify-between min-h-[110px]"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-caption font-bold text-muted-foreground uppercase tracking-wider">
              {kpi.title}
            </h3>
            <div className={`p-2 rounded-lg ${kpi.bgClass} ${kpi.colorClass}`}>
              <kpi.icon size={20} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-h1 font-extrabold text-foreground tracking-tight">
              {kpi.value}
            </span>
          </div>
        </div>
      ))}

      {/* Order Status Metrics */}
      {orderStatusKpi.map((kpi, idx) => (
        <div
          key={`status-${idx}`}
          className={`bg-card/50 border border-border rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between cursor-pointer group min-h-[110px] ${kpi.borderClass}`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-caption font-bold text-muted-foreground uppercase tracking-wider">
              {kpi.title}
            </h3>
            <div className={`p-2 rounded-lg ${kpi.bgClass} ${kpi.colorClass}`}>
              <kpi.icon size={20} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-h1 font-extrabold text-foreground tracking-tight">
              {kpi.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
