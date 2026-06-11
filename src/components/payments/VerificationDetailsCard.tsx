import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, RefreshCw, XCircle } from "lucide-react";
import { PaymentSetupConfig } from "../../types/paymentSetup";
import { Button } from "../ui/Button";

interface VerificationDetailsCardProps {
  config: PaymentSetupConfig;
  onCheckStatus: () => Promise<void>;
  onRetry: () => Promise<void>;
}

export const VerificationDetailsCard: React.FC<VerificationDetailsCardProps> = ({
  config,
  onCheckStatus,
  onRetry
}) => {
  const { t } = useTranslation();
  const [isChecking, setIsChecking] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      await onCheckStatus();
    } finally {
      setIsChecking(false);
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const status = config.verificationStatus;
  const isVerified = status === "Verified";
  const isFailed = status === "Verification Failed";
  const isPending = status === "Pending Verification" || status === "Under Review";
  const hasRequirements = config.pendingRequirements && config.pendingRequirements.length > 0;

  if (status === "Not Started") {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-h4 font-bold text-foreground mb-4 flex items-center gap-2">
          <ShieldCheck size={20} className="text-muted-foreground" />
          {t("paymentSetup.verification.title")}
        </h3>
        <p className="text-description text-muted-foreground">
          Connect your Razorpay account to start the verification process.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-h4 font-bold text-foreground flex items-center gap-2">
            <ShieldCheck size={20} className={isVerified ? "text-success" : isFailed ? "text-error" : "text-warning"} />
            {t("paymentSetup.verification.title")}
          </h3>
          {config.merchantId && (
            <p className="text-caption text-muted-foreground mt-1 font-mono">
              ID: {config.merchantId}
            </p>
          )}
        </div>
        <span className={`px-2.5 py-1 rounded-full text-caption font-semibold ${
          isVerified ? "bg-success/10 text-success" : 
          isFailed ? "bg-error/10 text-error" : 
          "bg-warning/10 text-warning"
        }`}>
          {t(`paymentSetup.status.${status}`)}
        </span>
      </div>

      {isPending && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-warning bg-warning/10 p-4 rounded-lg border border-warning/20">
            <Clock size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{t(`paymentSetup.status.${status}`)}</p>
              <p className="text-caption mt-1">Your account is currently being reviewed. This usually takes 2-3 business days.</p>
            </div>
          </div>

          {hasRequirements && (
            <div className="mt-4">
              <h4 className="text-body font-bold text-foreground mb-2">{t("paymentSetup.verification.requirements")}</h4>
              <ul className="space-y-2">
                {config.pendingRequirements!.map((req, index) => (
                  <li key={index} className="flex items-center gap-2 text-description text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={handleCheckStatus} 
            disabled={isChecking}
            className="w-full mt-2"
          >
            {isChecking ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                {t("paymentSetup.verification.checking")}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <RefreshCw size={16} />
                {t("paymentSetup.verification.checkStatus")}
              </span>
            )}
          </Button>
        </div>
      )}

      {isFailed && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-error bg-error/10 p-4 rounded-lg border border-error/20">
            <XCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{t("paymentSetup.verification.remarks")}</p>
              <p className="text-caption mt-1">{config.verificationRemarks}</p>
            </div>
          </div>

          <Button 
            onClick={handleRetry} 
            disabled={isRetrying}
            className="w-full bg-error hover:bg-error/90 text-white"
          >
            {isRetrying ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t("paymentSetup.verification.retryVerification")
            )}
          </Button>
        </div>
      )}

      {isVerified && config.gatewayDetails && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-success bg-success/10 p-4 rounded-lg border border-success/20 mb-4">
            <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Verification Complete</p>
              <p className="text-caption mt-1">Your account is fully verified and ready to accept payments.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <span className="text-caption text-muted-foreground block">{t("paymentSetup.verification.merchantId")}</span>
              <span className="text-body font-mono font-medium text-foreground">{config.merchantId}</span>
            </div>
            <div className="space-y-1">
              <span className="text-caption text-muted-foreground block">{t("paymentSetup.verification.accountStatus")}</span>
              <span className="text-body font-medium text-success flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success" />
                {config.gatewayDetails.merchantAccountStatus}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-caption text-muted-foreground block">{t("paymentSetup.verification.kycStatus")}</span>
              <span className="text-body font-medium text-success flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success" />
                {config.gatewayDetails.kycStatus}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-caption text-muted-foreground block">{t("paymentSetup.verification.gatewayStatus")}</span>
              <span className="text-body font-medium text-success flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success" />
                {config.gatewayDetails.gatewayActivationStatus}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
