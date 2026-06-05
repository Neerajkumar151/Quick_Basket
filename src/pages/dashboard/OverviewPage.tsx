import React from "react";
import {
  
  Plus,
  Image as ImageIcon,
  BadgeCheck,
  Store as StoreIcon,
  Clock,
} from "lucide-react";
import { KPICards } from "../../components/dashboard/KPICards";
import { AnalyticsSection } from "../../components/dashboard/AnalyticsSection";
import { OperationalInsights } from "../../components/dashboard/OperationalInsights";
import en from "../../locales/en.json";

export const OverviewPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in duration-500">
      {/* Store Info Header [NEW] */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-card border border-border rounded-xl shadow-sm mb-2">
        <div className="w-16 h-16 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <StoreIcon size={32} className="text-primary" />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-h2 font-bold text-card-foreground tracking-tight">
              {en.dashboard.storeInfo.name}
            </h2>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md text-caption font-semibold">
              <BadgeCheck size={14} />
              {en.dashboard.header.verified}
            </div>
          </div>
          <div className="flex items-center gap-4 text-description text-muted-foreground">
            <div className="flex items-center gap-1.5 text-status-delivered font-medium">
              <span className="w-2 h-2 rounded-full bg-status-delivered animate-pulse" />
              {en.dashboard.header.openNow}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              {en.dashboard.storeInfo.hours}
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
            <span className="hidden md:block">
              {en.dashboard.header.lastUpdated} {en.dashboard.storeInfo.lastUpdatedValue}
            </span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-h2 font-bold text-foreground tracking-tight">
            {en.dashboard.header.title}
          </h1>
          <p className="text-muted-foreground mt-1 text-description">
            {en.dashboard.header.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Action Buttons [MODIFY] */}
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-description font-medium text-foreground hover:bg-white/[0.02] transition-colors shadow-sm">
            <ImageIcon size={16} className="text-muted-foreground" />
            {en.dashboard.header.buttons.createBanner}
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-description font-semibold transition-colors shadow-[0_0_15px_rgba(var(--primary),0.3)]">
            <Plus size={16} />
            {en.dashboard.header.buttons.addProduct}
          </button>
        </div>
      </div>

      <KPICards />
      <AnalyticsSection />
      <OperationalInsights />
    </div>
  );
};
