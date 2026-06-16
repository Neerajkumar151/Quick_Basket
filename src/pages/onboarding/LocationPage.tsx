import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { OnboardingLayout } from "../../components/layout/OnboardingLayout";
import { LocationForm } from "../../components/forms/LocationForm";

import { useEffect } from "react";
import { storage } from "../../utils/storage";

export const LocationPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Route guard: Redirect to basic info if no token is found
  useEffect(() => {
    if (!storage.get("accessToken")) {
      navigate("/onboarding/basic-info");
    }
  }, [navigate]);

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
