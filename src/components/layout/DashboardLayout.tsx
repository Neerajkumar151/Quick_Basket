import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Package, Grid, Tag as Tags, Image as ImageIcon, Box, 
  ShoppingBag, Users, CreditCard, BarChart2, Store as StoreIcon, 
  Settings, HelpCircle, LogOut, ChevronDown, ChevronRight, AlertCircle, Clock
} from "lucide-react";
import en from "../../locales/en.json";
import { Header } from "./Header";

const NAVIGATION = [
  {
    group: en.sidebar.groups.overview,
    items: [
      { id: 'dashboard', name: en.sidebar.items.dashboard, path: '/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    group: en.sidebar.groups.catalog,
    items: [
      { id: 'products', name: en.sidebar.items.products, path: '/dashboard/products', icon: Package },
      { id: 'categories', name: en.sidebar.items.categories, path: '/dashboard/categories', icon: Grid },
      { id: 'tags', name: en.sidebar.items.tags, path: '/dashboard/tags', icon: Tags },
      { id: 'banners', name: en.sidebar.items.banners, path: '/dashboard/banners', icon: ImageIcon },
    ]
  },
  {
    group: en.sidebar.groups.inventory,
    items: [
      { id: 'stock', name: en.sidebar.items.inventory, path: '/dashboard/inventory', icon: Box },
      { id: 'low-stock', name: en.sidebar.items.lowStock, path: '/dashboard/inventory/low', icon: AlertCircle },
      { id: 'history', name: en.sidebar.items.history, path: '/dashboard/inventory/history', icon: Clock }
    ]
  },
  {
    group: en.sidebar.groups.sales,
    items: [
      { id: 'orders', name: en.sidebar.items.orders, path: '/dashboard/orders', icon: ShoppingBag },
      { id: 'customers', name: en.sidebar.items.customers, path: '/dashboard/customers', icon: Users },
      { id: 'payments', name: en.sidebar.items.payments, path: '/dashboard/payments', icon: CreditCard }
    ]
  },
  {
    group: en.sidebar.groups.analytics,
    items: [
      { id: 'reports', name: en.sidebar.items.reports, path: '/dashboard/reports', icon: BarChart2 }
    ]
  },
  {
    group: en.sidebar.groups.storeManagement,
    items: [
      { id: 'profile', name: en.sidebar.items.storeProfile, path: '/dashboard/profile', icon: StoreIcon },
      { id: 'settings', name: en.sidebar.items.storeSettings, path: '/dashboard/settings', icon: Settings }
    ]
  }
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  // State to track expanded groups by title. Initially all open.
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    NAVIGATION.reduce((acc, group) => ({ ...acc, [group.group]: true }), {})
  );

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background font-sans text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className="w-[260px] flex-shrink-0 flex flex-col bg-slate-900 border-r border-border transition-all duration-300 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar flex flex-col gap-2">
            
            {NAVIGATION.map((group) => {
              const isExpanded = expandedGroups[group.group];
              return (
                <div key={group.group} className="mb-2">
                  <button 
                    onClick={() => toggleGroup(group.group)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <span>{group.group}</span>
                    {isExpanded ? (
                      <ChevronDown size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <ChevronRight size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-1 flex flex-col gap-1">
                      {group.items.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                              isActive 
                                ? "bg-primary/10 text-primary shadow-[inset_2px_0_0_0_hsl(var(--primary))]" 
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            }`}
                          >
                            <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
              >
                <HelpCircle size={18} className="text-muted-foreground" />
                {en.sidebar.footer.help}
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-error hover:bg-error/10 transition-colors"
              >
                <LogOut size={18} />
                {en.sidebar.footer.logout}
              </Link>
            </div>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
