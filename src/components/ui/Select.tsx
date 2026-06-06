import React from "react";
import { cn } from "./Button";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, required, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-description font-medium text-foreground">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            className={cn(
              "appearance-none flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-description text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
              error && "border-error focus-visible:ring-error",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-3 pointer-events-none text-muted-foreground">
            <ChevronDown size={16} />
          </div>
        </div>
        {error && <p className="text-caption text-error mt-1">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
