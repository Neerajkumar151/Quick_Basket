import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../ui/Button";
import { Check } from "lucide-react";
import en from "../../locales/en.json";

const ONBOARDING_STEPS = [
  { ...en.onboarding.steps[0], id: 1, path: "/onboarding/basic-info" },
  { ...en.onboarding.steps[1], id: 2, path: "/onboarding/location" },
  { ...en.onboarding.steps[2], id: 3, path: "/onboarding/identity" },
];

export const StepTracker: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentIndex = ONBOARDING_STEPS.findIndex(s => s.path === location.pathname);
  const currentStepNum = currentIndex !== -1 ? currentIndex + 1 : 1;

  return (
    <div className="flex flex-col">
      {ONBOARDING_STEPS.map((step, index) => {
        const isActive = step.path === location.pathname;
        const isCompleted = step.id < currentStepNum;
        const isLast = index === ONBOARDING_STEPS.length - 1;

        return (
          <div key={step.id} className="relative flex items-start gap-4 pb-10 last:pb-0">
            {/* Connecting Line */}
            {!isLast && (
              <div
                className={cn(
                  "absolute left-[19px] top-10 bottom-0 w-px -ml-px",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}

            {/* Step Indicator */}
            <div className="flex flex-col items-center relative z-10">
              <button
                onClick={() => navigate(step.path)}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm border cursor-pointer hover:ring-2 hover:ring-primary/50",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : isCompleted
                    ? "bg-card text-foreground border-border"
                    : "bg-muted/30 text-muted-foreground border-transparent"
                )}
              >
                {isCompleted && !isActive ? <Check size={18} className="text-primary" /> : step.id}
              </button>
            </div>

            {/* Text Content */}
            <button
              onClick={() => navigate(step.path)}
              className="flex flex-col pt-2 text-left cursor-pointer group"
            >
              <span
                className={cn(
                  "text-base font-semibold leading-none transition-colors group-hover:text-primary/80",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
              <span
                className={cn(
                  "text-xs transition-colors mt-1.5",
                  isActive || isCompleted ? "text-muted-foreground" : "text-muted-foreground/50"
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
