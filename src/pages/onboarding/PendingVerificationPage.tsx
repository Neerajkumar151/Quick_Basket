import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { Hourglass, RefreshCw } from "lucide-react";
import VerificationImage from "../../assets/verification.png";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { apiClient } from "../../utils/api-client";
import { ENDPOINTS } from "../../constants/endpoints";
import toast from "react-hot-toast";

export const PendingVerificationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await apiClient.get(ENDPOINTS.ONBOARDING.ME, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.data?.onboarding?.status === "APPROVED") {
        toast.success(t("onboarding.pending.approved", "Your store has been approved! Please log in."));
        navigate("/login");
      } else {
        toast(t("onboarding.pending.stillPending", "Your application is still under review."), { icon: "ℹ️" });
      }
    } catch (error) {
      toast.error(t("onboarding.pending.refreshError", "Failed to refresh status."));
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-lg flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <img 
            src={VerificationImage} 
            alt={t("onboarding.pending.title")} 
            className="w-48 h-48 object-contain mb-6 drop-shadow-2xl"
          />
          <h1 className="text-h2 font-bold text-card-foreground mb-3">
            {t("onboarding.pending.title")}
          </h1>
          <p className="text-muted-foreground text-description leading-relaxed mb-6">
            {t("onboarding.pending.description")}
          </p>
          <div className="w-full mt-2 p-6 bg-card border border-border/50 rounded-xl flex flex-col items-center gap-5 shadow-inner">
            
            {/* Glowing Hourglass Icon Container */}
            <div className="w-16 h-16 bg-input border-2 border-border rounded-2xl flex items-center justify-center animate-sun-glow">
              <Hourglass className="text-warning w-8 h-8" strokeWidth={2.5} />
            </div>

            <div className="flex flex-col items-center">
              <span className="text-description font-semibold text-warning uppercase tracking-wider mb-1">
                {t("onboarding.pending.statusLabel")}
              </span>
              <span className="text-body font-medium text-foreground">
                {t("onboarding.pending.statusValue")}
              </span>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              className="mt-2 w-full"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t("onboarding.pending.refreshButton", "Refresh Status")}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
