import React from "react";
import { BadgeCheck, Clock, XCircle } from "lucide-react";
import { StoreProfile } from "../../types/storeProfile";
import en from "../../locales/en.json";

interface VerificationBadgeProps {
  status?: StoreProfile["verificationStatus"];
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  status = "pending",
  className = ""
}) => {
  const getConfig = () => {
    switch (status) {
      case "verified":
        return {
          colors: "bg-status-delivered/10 text-status-delivered border-status-delivered/20",
          icon: <BadgeCheck size={14} />,
          text: en.storeProfile.badges.verified
        };
      case "pending":
        return {
          colors: "bg-status-pending/10 text-status-pending border-status-pending/20",
          icon: <Clock size={14} />,
          text: en.storeProfile.badges.pending
        };
      case "rejected":
        return {
          colors: "bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20",
          icon: <XCircle size={14} />,
          text: en.storeProfile.badges.rejected
        };
      default:
        return {
          colors: "bg-muted text-muted-foreground border-border",
          icon: <Clock size={14} />,
          text: en.storeProfile.badges.pending
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-md text-caption font-semibold uppercase tracking-wider w-fit ${config.colors} ${className}`}>
      {config.icon}
      {config.text}
    </div>
  );
};
