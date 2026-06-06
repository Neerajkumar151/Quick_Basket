import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false, className }) => {
  const [openItemIds, setOpenItemIds] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItemIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className={clsx("flex flex-col gap-3", className)}>
      {items.map((item: any) => {
        const isOpen = openItemIds.has(item.id);
        return (
          <div 
            key={item.id} 
            className="bg-card border border-border rounded-xl overflow-hidden shadow-sm transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left bg-transparent hover:bg-muted/30 transition-colors focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="text-body font-semibold text-foreground pr-4">
                {item.title}
              </span>
              <ChevronDown 
                size={20} 
                className={clsx(
                  "text-muted-foreground shrink-0 transition-transform duration-300", 
                  isOpen && "rotate-180 text-primary"
                )} 
              />
            </button>
            <div 
              className={clsx(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="p-4 md:p-5 pt-0 text-description text-muted-foreground leading-relaxed">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
