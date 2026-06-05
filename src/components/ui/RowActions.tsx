import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal } from 'lucide-react';
import { cn } from './Button';

export interface RowAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

export const RowActions: React.FC<{ actions: RowAction[] }> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    // Also close on scroll to prevent detached menus
    const handleScroll = () => setIsOpen(false);
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isOpen) {
      const rect = e.currentTarget.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <button 
        onClick={handleToggle}
        className="p-2 rounded-lg hover:bg-input text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-card"
      >
        <MoreHorizontal size={18} />
      </button>
      
      {isOpen && createPortal(
        <div 
          ref={menuRef}
          style={{ top: `${coords.top + 4}px`, right: `${coords.right}px` }}
          className="fixed w-48 p-1.5 rounded-xl shadow-xl shadow-black/5 bg-card/95 backdrop-blur-md border border-border z-[9999] animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex flex-col gap-0.5" role="menu" aria-orientation="vertical">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-description font-medium flex items-center gap-2 transition-all duration-200",
                  action.destructive 
                    ? "text-error hover:bg-error/10" 
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                )}
                role="menuitem"
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
