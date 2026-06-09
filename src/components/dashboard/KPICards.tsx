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

import mockData from "../../constants/mock.json";

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

export const KPICards: React.FC = () => {
  const { t } = useTranslation();
  const primaryKpiData = resolveKpiData(mockData.primaryKpis, t);
  const orderStatusKpi = resolveKpiData(mockData.orderStatusKpis, t);

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
