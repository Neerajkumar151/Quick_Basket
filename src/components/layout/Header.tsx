import React from "react";
import { useLocation } from "react-router-dom";
import { Sun, Moon, Menu, Store as StoreIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../providers/ThemeProvider";
import { useStoreProfile } from "../../hooks/useStoreProfile";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { pathname } = useLocation();
  const isLoggedIn = pathname.startsWith("/dashboard");
  const { theme, setTheme } = useTheme();
  const { data: profile } = useStoreProfile();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isAuthRoute =
    pathname.startsWith("/login") ||
    (pathname.startsWith("/onboarding") && pathname !== "/onboarding/pending");

  return (
    <header
      className={`flex h-16 items-center justify-between px-6 shrink-0 z-30 relative ${
        isAuthRoute
          ? "bg-transparent border-transparent"
          : "border-b border-border bg-background"
      }`}
    >
      <div className="flex items-center gap-3 mr-8">
        {isLoggedIn && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 -ml-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Menu size={24} />
          </button>
        )}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img
            src="/logo.png"
            alt={`${t("layout.brand")} Logo`}
            className="h-8 w-auto object-contain"
          />
          <span
            className={`font-bold text-h3 tracking-tight hidden sm:block ${isAuthRoute ? "text-white" : "text-foreground"}`}
          >
            {t("layout.brand")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {!isAuthRoute && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors group shadow-sm"
          >
            {theme === "dark" ? (
              <Sun
                size={20}
                className="group-hover:text-primary transition-colors"
              />
            ) : (
              <Moon
                size={20}
                className="group-hover:text-primary transition-colors"
              />
            )}
          </button>
        )}

        {isLoggedIn && (
          <>
            {/* <button className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors group shadow-sm">
              <Bell
                size={20}
                className="group-hover:text-primary transition-colors"
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border border-background"></span>
            </button> */}
            <span
              onClick={() => navigate("/dashboard/help")}
              className="text-description font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              {t("layout.help")}
            </span>
            <div className="h-8 w-px bg-border mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-description font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {profile?.storeName || t("layout.adminName")}
                </span>
                <span className="text-caption text-error font-medium leading-tight">
                  {t("layout.adminRole")}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                {profile?.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt="Store Logo"
                    className="w-full h-full object-cover bg-card"
                  />
                ) : (
                  <StoreIcon
                    size={16}
                    className="text-muted-foreground opacity-50"
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
