import React from "react";
import { StepTracker } from "./StepTracker";
import { Header } from "./Header";
import { Footer } from "./Footer";
interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex justify-center py-12 px-6 lg:px-12 xl:px-24 w-full">
        <div className="w-full lg:w-[300px] shrink-0 sticky top-8">
          <StepTracker />
        </div>
        <div className="w-full max-w-[85%]">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
