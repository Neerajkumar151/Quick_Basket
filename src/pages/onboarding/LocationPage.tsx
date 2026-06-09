import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { OnboardingLayout } from "../../components/layout/OnboardingLayout";
import { LocationForm } from "../../components/forms/LocationForm";

export const LocationPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNext = () => {
    toast.success(t("onboarding.location.success", "Location details saved securely."), { icon: "💾" });
    navigate("/onboarding/identity");
  };

  const handlePrevious = () => {
    navigate("/onboarding/basic-info");
  };

  return (
    <OnboardingLayout>
      <LocationForm onNext={handleNext} onPrevious={handlePrevious} />
    </OnboardingLayout>
  );
};
