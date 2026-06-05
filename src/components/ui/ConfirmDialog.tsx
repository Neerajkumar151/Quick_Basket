import React from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={onCancel} />
      <div className="relative bg-card rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center gap-4">
          <h3 className="text-h3 font-bold text-foreground">{title}</h3>
          <p className="text-description text-muted-foreground">{description}</p>
          <div className="flex items-center gap-3 w-full mt-4">
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button 
              variant="primary" 
              className={`flex-1 ${isDestructive ? 'bg-error hover:bg-error/90 border-error' : ''}`} 
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
