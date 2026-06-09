import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { OnboardingLayout } from "../../components/layout/OnboardingLayout";
import { BusinessIdentityForm } from "../../components/forms/BusinessIdentityForm";

export const BusinessIdentityPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleFinalSubmit = (data: any) => {
    console.log("Final Registration Data:", data);
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
