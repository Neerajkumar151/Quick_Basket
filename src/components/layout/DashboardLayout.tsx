import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Grid,
  Tag as Tags,
  Image as ImageIcon,
  Box,
  ShoppingBag,
  Users,
  CreditCard,
  BarChart2,
  Store as StoreIcon,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Clock,
  Network,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Header } from "./Header";

const getNavigation = (t: TFunction) => [
  {
    group: t("sidebar.groups.overview"),
    items: [
      {
        id: "dashboard",
        name: t("sidebar.items.dashboard"),
        path: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: t("sidebar.groups.catalog"),
    items: [
      {
        id: "products",
        name: t("sidebar.items.products"),
        path: "/dashboard/products",
        icon: Package,
      },
      {
        id: "categories",
        name: t("sidebar.items.categories"),
        path: "/dashboard/categories",
        icon: Grid,
      },
      {
        id: "subCategories",
        name: t("sidebar.items.subCategories"),
        path: "/dashboard/sub-categories",
        icon: Network,
      },
      {
        id: "tags",
        name: t("sidebar.items.tags"),
        path: "/dashboard/tags",
        icon: Tags,
      },
      {
        id: "banners",
        name: t("sidebar.items.banners"),
        path: "/dashboard/banners",
        icon: ImageIcon,
      },
    ],
  },
  {
    group: t("sidebar.groups.inventory"),
    items: [
      {
        id: "stock",
        name: t("sidebar.items.inventory"),
        path: "/dashboard/inventory",
        icon: Box,
      },
      {
        id: "history",
        name: t("sidebar.items.history"),
        path: "/dashboard/inventory/history",
        icon: Clock,
      },
    ],
  },
  {
    group: t("sidebar.groups.sales"),
    items: [
      {
        id: "orders",
        name: t("sidebar.items.orders"),
        path: "/dashboard/orders",
        icon: ShoppingBag,
      },
      {
        id: "customers",
        name: t("sidebar.items.customers"),
        path: "/dashboard/customers",
        icon: Users,
      },
      {
        id: "payments",
        name: t("sidebar.items.payments"),
        path: "/dashboard/payments",
        icon: CreditCard,
      },
    ],
  },
  {
    group: t("sidebar.groups.analytics"),
    items: [
      {
        id: "reports",
        name: t("sidebar.items.reports"),
        path: "/dashboard/reports",
        icon: BarChart2,
      },
    ],
  },
  {
    group: t("sidebar.groups.storeManagement"),
    items: [
      {
        id: "profile",
        name: t("sidebar.items.storeProfile"),
        path: "/dashboard/store-profile",
        icon: StoreIcon,
      },
    ],
  },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = useMemo(() => getNavigation(t), [t]);
  
  // State to track expanded groups by title. Initially all open.
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    navigation.reduce((acc, group) => ({ ...acc, [group.group]: true }), {}),
  );

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background font-sans text-foreground">
      <Header onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay for Mobile */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
        )}
        
        {/* Sidebar */}
        <aside className={`absolute lg:static inset-y-0 left-0 w-[300px] flex-shrink-0 flex flex-col bg-card border-r border-border transition-transform duration-300 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.05)] ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar flex flex-col gap-2">
            {navigation.map((group: any) => {
              const isExpanded = expandedGroups[group.group];
              return (
                <div key={group.group} className="mb-2">
                  <button
                    onClick={() => toggleGroup(group.group)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-caption font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <span>{group.group}</span>
                    {isExpanded ? (
                      <ChevronDown
                        size={14}
                        className="opacity-50 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <ChevronRight
                        size={14}
                        className="opacity-50 group-hover:opacity-100 transition-opacity"
                      />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-1 flex flex-col gap-1">
                      {group.items.map((item: any) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-description font-medium transition-all ${
                              isActive
                                ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                                : "text-muted-foreground hover:bg-input/50 hover:text-foreground"
                            }`}
                          >
                            <Icon
                              size={18}
                              className={
                                isActive
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground"
                              }
                            />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="mt-auto pt-4 border-t border-border flex flex-col gap-1">
              <Link
                to="/dashboard/help"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-description font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
              >
                <HelpCircle size={18} className="text-muted-foreground" />
                {t("sidebar.footer.help")}
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-description font-medium text-error hover:bg-error/10 transition-colors"
              >
                <LogOut size={18} />
                {t("sidebar.footer.logout")}
              </Link>
            </div>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};
