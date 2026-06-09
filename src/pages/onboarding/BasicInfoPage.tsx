import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { OnboardingLayout } from "../../components/layout/OnboardingLayout";
import { BasicInfoForm } from "../../components/forms/BasicInfoForm";

export const BasicInfoPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
