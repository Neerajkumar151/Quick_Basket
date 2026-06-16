import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { OnboardingLayout } from "../../components/layout/OnboardingLayout";
import { BusinessIdentityForm } from "../../components/forms/BusinessIdentityForm";

import { useEffect } from "react";
import { storage } from "../../utils/storage";

export const BusinessIdentityPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Route guard: Redirect to basic info if no token is found
  useEffect(() => {
    if (!storage.get("accessToken")) {
      navigate("/onboarding/basic-info");
    }
  }, [navigate]);

  const handleFinalSubmit = (_data: any) => {
    // Final Registration Logic
    toast.success(t("onboarding.business.success", "Store onboarding complete! Verification in progress."), {
      duration: 5000,
      icon: "🎉",
    });
    
    navigate("/onboarding/pending");
  };

  const handlePrevious = () => {
    navigate("/onboarding/location");
  };

  return (
    <OnboardingLayout>
      <BusinessIdentityForm onSubmit={handleFinalSubmit} onPrevious={handlePrevious} />
    </OnboardingLayout>
  );
};
