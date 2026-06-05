import React from 'react';
import { cn } from './Button';

export type BadgeStatus = 'Active' | 'Inactive' | 'Pending' | 'Delivered' | 'Cancelled' | string;

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  let colorClass = "bg-input text-muted-foreground border-border";

  switch (status.toLowerCase()) {
    case 'active':
    case 'delivered':
    case 'success':
      colorClass = "bg-success/10 text-success border-success/20";
      break;
    case 'inactive':
    case 'cancelled':
    case 'error':
      colorClass = "bg-error/10 text-error border-error/20";
      break;
    case 'pending':
    case 'warning':
      colorClass = "bg-warning/10 text-warning border-warning/20";
      break;
  }

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium border", colorClass, className)}>
      {status}
    </span>
  );
};
