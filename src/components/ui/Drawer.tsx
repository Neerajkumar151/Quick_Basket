
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import FocusTrap from 'focus-trap-react';
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <FocusTrap focusTrapOptions={{ initialFocus: false, onDeactivate: onClose }}>
        <div 
          className="relative w-full max-w-md h-full bg-card shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 id="drawer-title" className="text-h3 font-bold text-foreground">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {children}
          </div>
        </div>
      </FocusTrap>
    </div>
  );
};
