import React from "react";
import { Image as ImageIcon, Store as StoreIcon, Clock } from "lucide-react";
import { StoreProfile, StoreOperations } from "../../types/storeProfile";
import { VerificationBadge } from "./VerificationBadge";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../utils/date";

interface StoreInfoHeaderProps {
  profile?: StoreProfile;
  operations?: StoreOperations;
  actionButton?: React.ReactNode;
  isLoading?: boolean;
}

export const StoreInfoHeader: React.FC<StoreInfoHeaderProps> = ({
  profile,
  operations,
  actionButton,
  isLoading,
}) => {
  const { t } = useTranslation();

  if (isLoading || !profile || !operations) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-sm mb-6 overflow-hidden h-64 animate-pulse">
        <div className="w-full h-32 md:h-48 bg-muted" />
        <div className="p-6 pt-0 flex gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted border-4 border-card -mt-10 md:-mt-12" />
          <div className="flex flex-col gap-2 pt-2 flex-1">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  // Get today's business hours
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayHours = operations.businessHours.find((bh) => bh.day === today);
  const hoursText = todayHours?.enabled
    ? `${todayHours.openingTime} - ${todayHours.closingTime}`
    : t("storeProfile.operations.status.closed", "Closed Today");

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Store Banner */}
      <div className="w-full h-32 md:h-48 bg-muted relative">
        {profile.bannerUrl ? (
          <img src={profile.bannerUrl} alt="Store Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
            <ImageIcon size={32} className="mb-2" />
            <span className="text-description">{t("storeProfile.banner.empty", "No Banner")}</span>
          </div>
        )}
        {profile.bannerUrl && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />}
      </div>

      {/* Profile Info */}
      <div className="p-6 pt-0 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 relative">
        <div className="flex items-end gap-4 w-full">
          {/* Logo */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-card border-4 border-card shadow-sm flex items-center justify-center overflow-hidden shrink-0 relative z-10 -mt-10 md:-mt-12">
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt="Store Logo" className="w-full h-full object-cover bg-muted" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <StoreIcon size={32} className="text-muted-foreground opacity-50" />
              </div>
            )}
          </div>
          
          {/* Store Name & Details */}
          <div className="flex flex-col gap-1 pb-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-h1 font-bold text-foreground tracking-tight">{profile.storeName}</h2>
              <VerificationBadge status={profile.verificationStatus} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-description text-muted-foreground">
              <div className={`flex items-center gap-1.5 font-medium ${operations.storeStatus ? "text-status-delivered" : "text-muted-foreground"}`}>
                <span className={`w-2 h-2 rounded-full ${operations.storeStatus ? "bg-status-delivered animate-pulse" : "bg-muted-foreground"}`} />
                {operations.storeStatus ? t("storeProfile.operations.status.open") : t("storeProfile.operations.status.closed")}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                {hoursText}
              </div>
              <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
              <span className="hidden md:block">
                {t("storeProfile.overview.lastUpdated")}: {formatDateTime(profile.lastUpdated)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Button (e.g., Edit) */}
        {actionButton && (
          <div className="shrink-0 flex items-center gap-2 md:mb-1">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
};
