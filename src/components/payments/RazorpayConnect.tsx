import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CreditCard, CheckCircle2, AlertCircle, RefreshCw, XCircle } from "lucide-react";
import { Button } from "../ui/Button";

interface RazorpayConnectProps {
  integrationStatus: string;
  merchantId?: string;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  disabled?: boolean;
}

export const RazorpayConnect: React.FC<RazorpayConnectProps> = ({
  integrationStatus,
  merchantId,
  onConnect,
  onDisconnect,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect();
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await onDisconnect();
    } finally {
      setIsDisconnecting(false);
    }
  };

  const isConnected = integrationStatus !== "Not Connected" && integrationStatus !== "Disconnected";
  const isDisconnected = integrationStatus === "Disconnected";

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl flex-shrink-0 ${isConnected ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
            <CreditCard size={32} />
          </div>
          <div>
            <h3 className="text-h4 font-bold text-foreground flex items-center gap-2">
              {t("paymentSetup.razorpay.title")}
              {isConnected && <CheckCircle2 size={18} className="text-success" />}
            </h3>
            <p className="text-description text-muted-foreground mt-1 max-w-md">
              {t("paymentSetup.razorpay.description")}
            </p>
            {isConnected && merchantId && (
              <div className="mt-2 inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-md text-caption font-mono text-foreground border border-border">
                <span className="text-muted-foreground">{t("paymentSetup.razorpay.merchantId")}</span>
                {merchantId}
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3 items-center">
          {isConnected ? (
            <>
              <div className="flex items-center gap-2 text-success font-semibold bg-success/10 px-4 py-2 rounded-lg border border-success/20 w-full md:w-auto justify-center">
                <CheckCircle2 size={20} />
                {t("paymentSetup.razorpay.connected")}
              </div>
              <Button
                variant="outline"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="w-full md:w-auto border-error text-error hover:bg-error/10 hover:text-error gap-2"
              >
                {isDisconnecting ? (
                  <span className="w-4 h-4 border-2 border-error/30 border-t-error rounded-full animate-spin" />
                ) : (
                  <XCircle size={18} />
                )}
                {t("paymentSetup.razorpay.disconnect")}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={isConnecting || disabled}
              className="w-full md:w-auto bg-[#0A2540] hover:bg-[#113255] text-white shadow-md transition-all gap-2"
            >
              {isConnecting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("paymentSetup.razorpay.connecting")}
                </>
              ) : (
                <>
                  {isDisconnected ? <RefreshCw size={18} /> : <CreditCard size={18} />}
                  {isDisconnected ? t("paymentSetup.razorpay.reconnect") : t("paymentSetup.razorpay.connect")}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      {disabled && !isConnected && (
        <div className="mt-4 flex items-center gap-2 text-warning text-caption bg-warning/10 px-3 py-2 rounded-lg border border-warning/20">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>Please complete and save your Business Details above before connecting.</span>
        </div>
      )}
    </div>
  );
};
