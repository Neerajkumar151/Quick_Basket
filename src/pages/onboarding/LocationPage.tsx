import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { OnboardingLayout } from "../../components/layout/OnboardingLayout";
import { LocationForm } from "../../components/forms/LocationForm";

export const LocationPage = () => {
  const navigate = useNavigate();

  const handleSaveAndContinue = () => {
    toast.success("Location details saved securely.", { icon: "💾" });
    navigate("/onboarding/identity");
  };

  const handlePrevious = () => {
    navigate("/onboarding/basic-info");
  };

  return (
    <OnboardingLayout>
      <LocationForm onNext={handleSaveAndContinue} onPrevious={handlePrevious} />
    </OnboardingLayout>
  );
};
