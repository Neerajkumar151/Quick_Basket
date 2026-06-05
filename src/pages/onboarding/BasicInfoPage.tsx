import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { OnboardingLayout } from "../../components/layout/OnboardingLayout";
import { BasicInfoForm } from "../../components/forms/BasicInfoForm";

export const BasicInfoPage = () => {
  const navigate = useNavigate();

  const handleSaveAndContinue = () => {
    toast.success("Basic info saved securely.", { icon: "💾" });
    navigate("/onboarding/location");
  };

  return (
    <OnboardingLayout>
      <BasicInfoForm onNext={handleSaveAndContinue} />
    </OnboardingLayout>
  );
};
