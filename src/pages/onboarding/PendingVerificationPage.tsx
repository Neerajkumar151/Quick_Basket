import React from "react";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { Hourglass } from "lucide-react";
import VerificationImage from "../../assets/verification.png";
import en from "../../locales/en.json";

export const PendingVerificationPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-lg flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <img 
            src={VerificationImage} 
            alt={en.onboarding.pending.title} 
            className="w-48 h-48 object-contain mb-6 drop-shadow-2xl"
          />
          <h1 className="text-2xl font-bold text-card-foreground mb-3">
            {en.onboarding.pending.title}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            {en.onboarding.pending.description}
          </p>
          <div className="w-full mt-2 p-6 bg-card border border-border/50 rounded-xl flex flex-col items-center gap-5 shadow-inner">
            
            {/* Glowing Hourglass Icon Container */}
            <div className="w-16 h-16 bg-slate-800 border-2 border-slate-700/80 rounded-2xl flex items-center justify-center animate-sun-glow">
              <Hourglass className="text-warning w-8 h-8" strokeWidth={2.5} />
            </div>

            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-warning uppercase tracking-wider mb-1">
                {en.onboarding.pending.statusLabel}
              </span>
              <span className="text-base font-medium text-foreground">
                {en.onboarding.pending.statusValue}
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
