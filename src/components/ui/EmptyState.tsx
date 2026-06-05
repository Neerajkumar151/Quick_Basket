import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-card/50">
      <div className="w-16 h-16 rounded-full bg-input flex items-center justify-center mb-4 text-muted-foreground">
        <Icon size={32} />
      </div>
      <h3 className="text-h3 font-bold text-foreground mb-2">{title}</h3>
      {description && <p className="text-description text-muted-foreground max-w-sm mb-6">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
