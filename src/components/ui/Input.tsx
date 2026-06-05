import React from "react";
import { cn } from "./Button";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, required, prefixElement, suffixElement, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-description font-medium text-foreground">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground border-r border-border pr-3">
              {prefixElement}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-description text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-description file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
              prefixElement && "pl-16",
              suffixElement && "pr-10",
              error && "border-error focus-visible:ring-error",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffixElement && (
            <div className="absolute right-3 flex items-center text-muted-foreground">
              {suffixElement}
            </div>
          )}
        </div>
        {error && <p className="text-caption text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
