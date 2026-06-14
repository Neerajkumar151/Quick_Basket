import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { OnboardingLayout } from "../../components/layout/OnboardingLayout";
import { BasicInfoForm } from "../../components/forms/BasicInfoForm";
import { useEffect } from "react";
import { storage } from "../../utils/storage";

export const BasicInfoPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Developer Bypass: If we have an access token, skip registration step
  useEffect(() => {
    const token = storage.get("accessToken");
    if (token) {
      navigate("/onboarding/location");
    }
  }, [navigate]);

  const handleNext = () => {
    toast.success(t("onboarding.basic.success", "Basic info saved securely."), { icon: "💾" });
    navigate("/onboarding/location");
  };

  return (
    <OnboardingLayout>
      <BasicInfoForm onNext={handleNext} />
    </OnboardingLayout>
  );
};
