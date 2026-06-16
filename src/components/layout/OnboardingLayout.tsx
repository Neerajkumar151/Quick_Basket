import React from "react";
import { StepTracker } from "./StepTracker";
import { Header } from "./Header";
interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen lg:h-screen flex flex-col font-sans relative lg:overflow-hidden">
      {/* Full-screen Video Background */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/bgvideo.mp4" type="video/mp4" />
        </video>
        {/* Overlay - reference gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundImage: "var(--auth-overlay-gradient)" }}
        />
      </div>

      {/* Top Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col lg:flex-row gap-8 lg:gap-16 py-8 lg:py-16 px-6 lg:px-16 xl:px-32 w-full max-w-[1800px] mx-auto z-10 lg:min-h-0 items-start">
        <div className="w-full lg:w-[400px] shrink-0 z-20 mt-4">
          <StepTracker />
        </div>
        <div className="flex-1 w-full flex justify-center lg:h-full overflow-y-auto hide-scrollbar items-start lg:pb-16">
          <div
            className="w-full lg:max-w-[95%] xl:max-w-[90%] rounded-3xl border p-4 sm:p-6 shadow-2xl backdrop-blur-xl"
            style={{
              backgroundColor: "var(--auth-card-bg)",
              borderColor: "var(--auth-card-border)",
              boxShadow: `0 20px 40px var(--auth-card-shadow)`,
            }}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
