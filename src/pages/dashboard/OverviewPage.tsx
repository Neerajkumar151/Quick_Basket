import React from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Image as ImageIcon,
  Store as StoreIcon,
  Clock,
} from "lucide-react";
import { KPICards } from "../../components/dashboard/KPICards";
import { AnalyticsSection } from "../../components/dashboard/AnalyticsSection";
import { OperationalInsights } from "../../components/dashboard/OperationalInsights";
import { Button } from "../../components/ui/Button";
import en from "../../locales/en.json";
import { useNavigate } from "react-router-dom";
import {
  useStoreProfile,
  useStoreOperations,
} from "../../hooks/useStoreProfile";
import { formatDateTime } from "../../utils/date";
import { VerificationBadge } from "../../components/store-profile/VerificationBadge";

export const OverviewPage: React.FC = () => {
  const Navigate = useNavigate();
  const { data: profile } = useStoreProfile();
  const { data: operations } = useStoreOperations();

  // Get today's business hours
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayHours = operations?.businessHours.find((bh: any) => bh.day === today);
  const hoursText = todayHours?.enabled
    ? `${todayHours.openingTime} - ${todayHours.closingTime}`
    : "Closed Today";

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in duration-500">
      {/* Store Info Header [NEW] */}
      <div className="bg-card border border-border rounded-xl shadow-sm mb-2 overflow-hidden">
        {/* Store Banner */}
        {profile?.bannerUrl && (
          <div className="w-full h-32 md:h-48 bg-muted relative">
            <img
              src={profile.bannerUrl}
              alt="Store Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        {/* Profile Info */}
        <div className="p-6 flex flex-col md:flex-row md:items-center gap-6 relative">
          <div
            className={`w-20 h-20 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center overflow-hidden shrink-0 relative z-10 ${profile?.bannerUrl ? "-mt-12 md:-mt-16 border-4 border-card" : ""}`}
          >
            {profile?.logoUrl ? (
              <img
                src={profile.logoUrl}
                alt="Store Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <StoreIcon
                size={32}
                className="text-muted-foreground opacity-50"
              />
            )}
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-h2 font-bold text-card-foreground tracking-tight">
                {profile?.storeName || en.dashboard.storeInfo.name}
              </h2>
              <VerificationBadge status={profile?.verificationStatus} />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-description text-muted-foreground">
              <div
                className={`flex items-center gap-1.5 font-medium ${operations?.storeStatus ? "text-status-delivered" : "text-muted-foreground"}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${operations?.storeStatus ? "bg-status-delivered animate-pulse" : "bg-muted-foreground"}`}
                />
                {operations?.storeStatus
                  ? en.storeProfile.operations.status.open
                  : en.storeProfile.operations.status.closed}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                {hoursText}
              </div>
              <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
              <span className="hidden md:block">
                {en.storeProfile.overview.lastUpdated}:{" "}
                {profile
                  ? formatDateTime(profile.lastUpdated)
                  : en.dashboard.storeInfo.lastUpdatedValue}
              </span>
            </div>
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
          <button
            onClick={() => Navigate("/dashboard/banners")}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-description font-medium text-foreground hover:bg-white/[0.02] transition-colors shadow-sm"
          >
            <ImageIcon size={16} className="text-muted-foreground" />
            {en.dashboard.header.buttons.createBanner}
          </button>

          <Link to="/dashboard/products">
            <Button className="gap-2 w-full sm:w-40">
              <Plus size={16} />
              {en.dashboard.header.buttons.addProduct}
            </Button>
          </Link>
        </div>
      </div>

      <KPICards />
      <AnalyticsSection />
      <OperationalInsights />
    </div>
  );
};
