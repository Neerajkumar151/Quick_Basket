import React from "react";

export interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  className?: string;
}

export const DetailRow: React.FC<DetailRowProps> = ({ label, value, valueClassName = "text-body font-medium text-foreground", className = "" }) => {
  return (
    <div className={className}>
      <p className="text-caption text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      {typeof value === 'string' || typeof value === 'number' ? (
        <p className={valueClassName}>{value}</p>
      ) : (
        value
      )}
    </div>
  );
};
