import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Settings, ShieldCheck, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

import { PageHeader } from "../../components/ui/PageHeader";
import { CardSkeleton } from "../../components/ui/LoadingSkeletons";
import { PaymentAccountForm } from "../../components/payments/PaymentAccountForm";
import { RazorpayConnect } from "../../components/payments/RazorpayConnect";
import { paymentSetupService } from "../../services/paymentSetupService";
import { VerificationDetailsCard } from "../../components/payments/VerificationDetailsCard";
import { PaymentSetupConfig, PaymentSetupFormValues } from "../../types/paymentSetup";

export const PaymentAccountSetupPage = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<PaymentSetupConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await paymentSetupService.getConfig();
        setConfig(data);
      } catch (error) {
        toast.error("Failed to load payment configuration");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSaveDetails = async (data: PaymentSetupFormValues) => {
    setIsSubmitting(true);
    try {
      const updatedConfig = await paymentSetupService.saveConfig(data);
      setConfig(updatedConfig);
      toast.success(t("paymentSetup.messages.successSave"));
    } catch (error) {
      toast.error(t("paymentSetup.messages.errorSave"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectRazorpay = async () => {
    try {
      const updatedConfig = await paymentSetupService.connectRazorpay();

      // We simulate Razorpay returning a Merchant ID upon connection
      updatedConfig.merchantId = `ACC_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

      setConfig(updatedConfig);
      toast.success(t("paymentSetup.messages.successConnect"));
    } catch (error) {
      toast.error(t("paymentSetup.messages.errorConnect"));
    }
  };

  const handleDisconnectRazorpay = async () => {
    try {
      const updatedConfig = await paymentSetupService.disconnectRazorpay();
      setConfig(updatedConfig);
      toast.success(t("paymentSetup.messages.successDisconnect"));
    } catch (error) {
      toast.error(t("paymentSetup.messages.errorDisconnect"));
    }
  };

  const handleCheckStatus = async () => {
    try {
      const updatedConfig = await paymentSetupService.checkVerificationStatus();
      setConfig(updatedConfig);
      toast.success(t("paymentSetup.messages.successCheck"));
    } catch (error) {
      toast.error(t("paymentSetup.messages.errorCheck"));
    }
  };

  const handleRetryVerification = async () => {
    try {
      const updatedConfig = await paymentSetupService.retryVerification();
      setConfig(updatedConfig);
      toast.success(t("paymentSetup.messages.successRetry"));
    } catch (error) {
      toast.error(t("paymentSetup.messages.errorCheck"));
    }
  };

  const handleToggleOnlinePayments = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;

    // Validate that we have business details and a verified connection
    const hasBusinessDetails = config?.businessName && config?.bankAccount?.accountNumber;
    const isVerified = config?.verificationStatus === "Verified";

    if (enabled && (!hasBusinessDetails || !isVerified)) {
      toast.error(t("paymentSetup.onlinePayments.errorUnconfigured"));
      return;
    }

    try {
      const updatedConfig = await paymentSetupService.toggleOnlinePayments(enabled);
      setConfig(updatedConfig);
      toast.success(enabled ? t("paymentSetup.messages.successEnable") : t("paymentSetup.messages.successDisable"));
    } catch (error) {
      toast.error(t("paymentSetup.messages.errorEnable"));
    }
  };

  if (isLoading || !config) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("paymentSetup.title")} description={t("paymentSetup.subtitle")} />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const isFormFilled = !!(config.businessName && config.bankAccount?.accountNumber);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <PageHeader
        title={t("paymentSetup.title")}
        description={t("paymentSetup.subtitle")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <PaymentAccountForm
              initialData={{
                businessName: config.businessName,
                merchantId: config.merchantId,
                accountName: config.bankAccount.accountName,
                accountNumber: config.bankAccount.accountNumber,
                ifscCode: config.bankAccount.ifscCode,
                panNumber: config.merchantIdentification.panNumber,
                gstNumber: config.merchantIdentification.gstNumber,
              }}
              onSubmit={handleSaveDetails}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Razorpay Connect Section */}
          <RazorpayConnect
            integrationStatus={config.integrationStatus}
            merchantId={config.merchantId}
            onConnect={handleConnectRazorpay}
            onDisconnect={handleDisconnectRazorpay}
            disabled={!isFormFilled} // Disable connect button if basic form isn't saved yet
          />
        </div>

        {/* Right Column: Status & Toggles */}
        <div className="flex flex-col gap-6">
          {/* Verification Status Card */}
          <VerificationDetailsCard
            config={config}
            onCheckStatus={handleCheckStatus}
            onRetry={handleRetryVerification}
          />

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-h4 font-bold text-foreground mb-4 flex items-center gap-2">
              <Settings size={20} className="text-primary" />
              Settings
            </h3>

            <div className="space-y-4">
              {/* Toggle Online Payments */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center pt-1">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={config.isOnlinePaymentEnabled}
                      onChange={handleToggleOnlinePayments}
                      disabled={config.verificationStatus !== "Verified"}
                    />
                    <div className={`w-10 h-5 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[""] after:absolute after:top-[6px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${config.verificationStatus === "Verified" ? 'peer-checked:bg-success cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}></div>
                  </div>
                  <div>
                    <span className="text-body font-bold text-foreground block">
                      {t("paymentSetup.onlinePayments.title")}
                    </span>
                    <span className="text-caption text-muted-foreground block mt-0.5">
                      {t("paymentSetup.onlinePayments.description")}
                    </span>
                  </div>
                </label>

                {config.verificationStatus !== "Verified" && (
                  <div className="mt-3 flex items-start gap-2 text-warning text-caption bg-warning/10 px-3 py-2 rounded-lg border border-warning/20">
                    <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{t("paymentSetup.onlinePayments.errorUnconfigured")}</span>
                  </div>
                )}

                {config.verificationStatus === "Verified" && config.isOnlinePaymentEnabled && (
                  <div className="mt-3 flex items-start gap-2 text-success text-caption bg-success/10 px-3 py-2 rounded-lg border border-success/20">
                    <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" />
                    <span>Your store is currently accepting live online payments securely via Razorpay.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
