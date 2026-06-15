import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeStatus = 'Active' | 'Inactive' | 'Pending' | 'Delivered' | 'Cancelled' | string;

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  let colorClass = "bg-input text-muted-foreground border-border";
  
  // Safe lowercasing and trimming
  const rawStatus = status ? String(status).toLowerCase().trim() : '';

  switch (rawStatus) {
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
    case 'verification_failed':
    case 'disconnected':
      colorClass = "bg-error/10 text-error border-error/20";
      break;
    case 'pending':
    case 'pending_payment':
    case 'warning':
    case 'new':
    case 'refunded':
    case 'partially_refunded':
    case 'pending_verification':
      colorClass = "bg-warning/10 text-warning border-warning/20";
      break;
    case 'processing':
    case 'accepted':
      colorClass = "bg-status-blue/10 text-status-blue border-status-blue/20";
      break;
    case 'placed':
      colorClass = "bg-status-purple/10 text-status-purple border-status-purple/20";
      break;
    case 'out_for_delivery':
      colorClass = "bg-status-cyan/10 text-status-cyan border-status-cyan/20";
      break;
    case 'not_connected':
      colorClass = "bg-muted text-muted-foreground border-border";
      break;
  }

  const displayStatus = status
    ? String(status)
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    : '';

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium border", colorClass, className)}>
      {displayStatus}
    </span>
  );
};
