import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

const getOnboardingSteps = (t: TFunction) => [
  { title: t("onboarding.steps.0.title" as any) as string, description: t("onboarding.steps.0.description" as any) as string, id: 1, path: "/onboarding/basic-info" },
  { title: t("onboarding.steps.1.title" as any) as string, description: t("onboarding.steps.1.description" as any) as string, id: 2, path: "/onboarding/location" },
  { title: t("onboarding.steps.2.title" as any) as string, description: t("onboarding.steps.2.description" as any) as string, id: 3, path: "/onboarding/identity" },
];

export const StepTracker: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const onboardingSteps = getOnboardingSteps(t);
  
  const currentIndex = onboardingSteps.findIndex(s => s.path === location.pathname);
  const currentStepNum = currentIndex !== -1 ? currentIndex + 1 : 1;

  return (
    <div className="flex flex-row lg:flex-col justify-between lg:justify-start mb-6 lg:mb-0 relative">
      {onboardingSteps.map((step, index) => {
        const isActive = step.path === location.pathname;
        const isCompleted = step.id < currentStepNum;
        const isLast = index === onboardingSteps.length - 1;

        return (
          <div key={step.id} className="relative flex flex-col lg:flex-row items-center lg:items-start gap-3 lg:gap-6 lg:pb-12 lg:last:pb-0 flex-1 lg:flex-none">
            {/* Desktop Connecting Line */}
            {!isLast && (
              <div
                className={cn(
                  "hidden lg:block absolute left-[23px] top-12 bottom-0 w-[2px] -ml-px",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}

            {/* Mobile Connecting Line */}
            {!isLast && (
              <div
                className={cn(
                  "lg:hidden absolute top-[23px] left-[50%] right-[-50%] h-[2px] -mt-px z-0",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}

            {/* Step Indicator */}
            <div className="flex flex-col items-center relative z-10 bg-transparent">
              <button
                onClick={() => navigate(step.path)}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base transition-all duration-300 shadow-sm border-2 cursor-pointer hover:ring-4 hover:ring-primary/50",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : isCompleted
                    ? "bg-card text-foreground border-border"
                    : "bg-muted/30 text-muted-foreground border-transparent backdrop-blur-md"
                )}
              >
                {isCompleted && !isActive ? <Check size={20} className="text-primary" /> : step.id}
              </button>
            </div>

            {/* Text Content */}
            <button
              onClick={() => navigate(step.path)}
              className="flex flex-col pt-2 lg:pt-3 text-center lg:text-left cursor-pointer group items-center lg:items-start relative z-10"
            >
              <span
                className={cn(
                  "text-body font-bold leading-none transition-colors group-hover:text-auth-text",
                  isActive ? "text-auth-text" : "text-auth-text/70"
                )}
              >
                {step.title}
              </span>
              <span
                className={cn(
                  "hidden lg:block text-caption transition-colors mt-1.5 font-medium",
                  isActive || isCompleted ? "text-auth-text/80" : "text-auth-text/50"
                )}
              >
                {step.description}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
