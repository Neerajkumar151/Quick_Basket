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
    <div className="min-h-screen flex flex-col font-sans relative">
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
      <main className="flex-1 relative flex justify-center py-12 px-6 lg:px-12 xl:px-24 w-full z-10 pb-24">
        <div className="w-full lg:w-[300px] shrink-0 sticky top-8">
          <StepTracker />
        </div>
        <div
          className="w-full max-w-[85%] rounded-2xl border p-8 shadow-xl backdrop-blur-lg"
          style={{
            backgroundColor: "var(--auth-card-bg)",
            borderColor: "var(--auth-card-border)",
            boxShadow: `0 20px 40px var(--auth-card-shadow)`,
          }}
        >
          {children}
        </div>
      </main>

    </div>
  );
};
