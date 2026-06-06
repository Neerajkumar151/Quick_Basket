import React, { useState, useRef, useEffect } from "react";
import { cn } from "./Button";
import { ChevronDown, Check } from "lucide-react";

export interface MultiSelectProps {
  label?: string;
  error?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  error,
  required,
  options,
  value,
  onChange,
  placeholder = "Select options...",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label)
    .join(", ");

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={containerRef}>
      {label && (
        <label className="text-description font-medium text-foreground">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-between h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-description text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            error ? "border-error focus-visible:ring-error" : "",
            value.length === 0 ? "text-muted-foreground" : "text-foreground",
            className
          )}
        >
          <span className="truncate pr-4">{value.length > 0 ? selectedLabels : placeholder}</span>
          <ChevronDown size={16} className="text-muted-foreground shrink-0" />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="p-3 text-description text-muted-foreground">No options available</div>
            ) : (
              options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => toggleOption(opt.value)}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted text-description transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                    value.includes(opt.value) ? "bg-primary border-primary text-primary-foreground" : "border-border"
                  )}>
                    {value.includes(opt.value) && <Check size={12} />}
                  </div>
                  <span className="text-foreground truncate">{opt.label}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {error && <p className="text-caption text-error mt-1">{error}</p>}
    </div>
  );
};
