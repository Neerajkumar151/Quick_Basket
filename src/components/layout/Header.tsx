import React from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell, LayoutDashboard } from "lucide-react";
import en from "../../locales/en.json";

export const Header: React.FC = () => {
  const { pathname } = useLocation();
  const isLoggedIn = pathname.startsWith('/dashboard');

  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-6 bg-background shrink-0 z-30 relative">
      <div className="flex items-center gap-3 mr-8">
        <img src="/logo.png" alt={`${en.layout.brand} Logo`} className="h-8 w-auto object-contain" />
        <span className="font-bold text-lg text-foreground tracking-tight hidden sm:block">
          {en.layout.brand} <span className="font-medium text-muted-foreground ml-1 text-sm">{en.layout.portal}</span>
        </span>
      </div>

      {isLoggedIn && (
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center">
            <div className="relative w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder={en.layout.searchPlaceholder}
                className="w-full h-9 pl-10 pr-4 rounded-md border border-border bg-input/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>
          <button className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors group shadow-sm">
            <Bell size={20} className="group-hover:text-primary transition-colors" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border border-background"></span>
          </button>
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            {en.layout.help}
          </span>
          <div className="h-8 w-px bg-border mx-2"></div>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{en.layout.adminName}</span>
              <span className="text-xs text-muted-foreground leading-tight">{en.layout.adminRole}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
