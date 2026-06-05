import React from 'react';
import { Drawer } from './Drawer';
import { Button } from './Button';

interface EntityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
}

export const EntityDrawer: React.FC<EntityDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting = false
}) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col h-full">
        <div className="flex-1">
          {children}
        </div>
        
        {(onSubmit || onCancel) && (
          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                {cancelLabel}
              </Button>
            )}
            {onSubmit && (
              <Button type="button" variant="primary" onClick={onSubmit} disabled={isSubmitting}>
                {isSubmitting ? "..." : submitLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
};
