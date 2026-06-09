import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer: React.FC = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/onboarding');

  return (
    <footer className={`py-6 px-6 mt-auto z-30 relative ${isAuthRoute ? 'bg-transparent border-transparent text-white/80' : 'border-t border-border bg-background'}`}>
      <div className={`flex justify-between items-center text-caption ${isAuthRoute ? 'text-white/60' : 'text-muted-foreground'}`}>
        <div className="flex gap-4">
          <a href="#" className={`transition-colors ${isAuthRoute ? 'hover:text-white' : 'hover:text-foreground'}`}>{t("layout.privacy")}</a>
          <a href="#" className={`transition-colors ${isAuthRoute ? 'hover:text-white' : 'hover:text-foreground'}`}>{t("layout.terms")}</a>
        </div>
        <span>{t("layout.copyright")}</span>
      </div>
    </footer>
  );
};
