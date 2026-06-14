import React from 'react';
import { cn } from '../../utils/cn';

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
    case 'paid':
    case 'captured':
    case 'verified':
      colorClass = "bg-success/10 text-success border-success/20";
      break;
    case 'inactive':
    case 'cancelled':
    case 'error':
    case 'failed':
    case 'verification failed':
    case 'disconnected':
      colorClass = "bg-error/10 text-error border-error/20";
      break;
    case 'pending':
    case 'warning':
    case 'new':
    case 'refunded':
    case 'partially refunded':
    case 'pending verification':
      colorClass = "bg-warning/10 text-warning border-warning/20";
      break;
    case 'accepted':
      colorClass = "bg-primary/10 text-primary border-primary/20";
      break;
    case 'out for delivery':
      colorClass = "bg-status-purple/10 text-status-purple border-status-purple/20";
      break;
    case 'not connected':
      colorClass = "bg-muted text-muted-foreground border-border";
      break;
  }

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium border", colorClass, className)}>
      {status}
    </span>
  );
};
