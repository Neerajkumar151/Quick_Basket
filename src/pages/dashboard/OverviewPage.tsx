import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Image as ImageIcon } from "lucide-react";
import { KPICards } from "../../components/dashboard/KPICards";
import { AnalyticsSection } from "../../components/dashboard/AnalyticsSection";
import { OperationalInsights } from "../../components/dashboard/OperationalInsights";
import { Button } from "../../components/ui/Button";
import { ErrorState } from "../../components/ui/ErrorState";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { StoreInfoHeader } from "../../components/store-profile/StoreInfoHeader";
import { useStoreProfile, useStoreOperations } from "../../hooks/useStoreProfile";
import { useDashboard } from "../../hooks/useDashboard";
import { Loader2 } from "lucide-react";

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [periodFilter, setPeriodFilter] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');

  const { data: profile, isLoading: isLoadingProfile } = useStoreProfile();
  const { data: operations, isLoading: isLoadingOperations } = useStoreOperations();
  const { data: dashboard, isLoading: isLoadingDashboard, isError: isErrorDashboard, refetch: refetchDashboard } = useDashboard({
    period: periodFilter.toLowerCase()
  });

  if (isLoadingDashboard) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in duration-500">
      <div className="mb-2">
        <StoreInfoHeader 
          profile={profile} 
          operations={operations} 
          isLoading={isLoadingProfile || isLoadingOperations} 
        />
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-h2 font-bold text-foreground tracking-tight">
            {t("dashboard.header.title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-description">
            {t("dashboard.header.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Action Buttons [MODIFY] */}
          <button
            onClick={() => navigate("/dashboard/banners")}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-description font-medium text-foreground hover:bg-white/[0.02] transition-colors shadow-sm"
          >
            <ImageIcon size={16} className="text-muted-foreground" />
            {t("dashboard.header.buttons.createBanner")}
          </button>

          <Link to="/dashboard/products">
            <Button className="gap-2 w-full sm:w-40">
              <Plus size={16} />
              {t("dashboard.header.buttons.addProduct")}
            </Button>
          </Link>
        </div>
      </div>

      {isErrorDashboard ? (
        <ErrorState onRetry={refetchDashboard} />
      ) : (
        <>
          <KPICards metrics={dashboard?.metrics} />
          <AnalyticsSection 
            analytics={dashboard?.analytics} 
            revenueFilter={periodFilter}
            setRevenueFilter={setPeriodFilter}
            ordersFilter={periodFilter}
            setOrdersFilter={setPeriodFilter}
          />
          <OperationalInsights recentOrders={dashboard?.recentOrders} />
        </>
      )}
    </div>
  );
};
