import React from "react";
import {
  Wallet,
  ShoppingBag,
  Package,
  Clock,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import en from "../../locales/en.json";

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

const resolveKpiData = (kpiArray: any[]) => {
  return kpiArray.map((kpi) => {
    const keys = kpi.title.split(".");
    let translatedTitle = en as any;
    keys.forEach((k: string) => {
      translatedTitle = translatedTitle[k];
    });
    return {
      ...kpi,
      title: translatedTitle as string,
      icon: IconMap[kpi.icon],
    };
  });
};

const PRIMARY_KPI_DATA = resolveKpiData(mockData.primaryKpis);
const ORDER_STATUS_KPI = resolveKpiData(mockData.orderStatusKpis);

export const KPICards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* Primary Metrics */}
      {PRIMARY_KPI_DATA.map((kpi, idx) => (
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
      {ORDER_STATUS_KPI.map((kpi, idx) => (
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
