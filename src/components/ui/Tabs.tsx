import React, { useState } from "react";

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTabId, className = "" }) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const activeTab = tabs.find((t: any) => t.id === activeTabId);

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* Tab List */}
      <div className="flex items-center gap-2 border-b border-border mb-6 overflow-x-auto custom-scrollbar pb-px">
        {tabs.map((tab: any) => {
          const isActive = activeTabId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-3 text-description font-medium whitespace-nowrap transition-colors outline-none focus-visible:bg-muted rounded-t-md ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              {tab.icon && (
                <span className={isActive ? "text-primary" : "text-muted-foreground"}>
                  {tab.icon}
                </span>
              )}
              {tab.label}
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="relative w-full">
        {activeTab && (
          <div
            key={activeTab.id}
            role="tabpanel"
            id={`panel-${activeTab.id}`}
            aria-labelledby={`tab-${activeTab.id}`}
            className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {activeTab.content}
          </div>
        )}
      </div>
    </div>
  );
};
