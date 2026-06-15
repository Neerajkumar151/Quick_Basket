import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, required, children, value, onChange, disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement | null>(null);

    // Merge refs
    const setRefs = (element: HTMLSelectElement) => {
      selectRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    // Internal state
    const [internalValue, setInternalValue] = useState(value || props.defaultValue || "");

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const options: { value: string; label: React.ReactNode }[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === 'option') {
        const element = child as any;
        options.push({
          value: element.props.value !== undefined ? element.props.value : element.props.children?.toString() || "",
          label: element.props.children,
        });
      } else if (React.isValidElement(child) && child.type === React.Fragment) {
        const element = child as any;
        React.Children.forEach(element.props.children, (subChild) => {
          if (React.isValidElement(subChild)) {
            const subElement = subChild as any;
            options.push({
              value: subElement.props.value !== undefined ? subElement.props.value : subElement.props.children?.toString() || "",
              label: subElement.props.children,
            });
          }
        });
      } else if (Array.isArray(child)) {
        child.forEach((c: any) => {
          if (React.isValidElement(c) && c.type === 'option') {
            const element = c as any;
            options.push({
              value: element.props.value !== undefined ? element.props.value : element.props.children?.toString() || "",
              label: element.props.children,
            });
          }
        });
      }
    });

    const selectedOption = options.find((o) => String(o.value) === String(internalValue));

    const handleSelect = (val: string) => {
      setInternalValue(val);
      setIsOpen(false);
      
      if (onChange) {
        onChange({
          target: { value: val, name: props.name },
          currentTarget: { value: val, name: props.name }
        } as any);
      }
    };

    return (
      <div className="flex flex-col gap-1.5 w-full" ref={wrapperRef}>
        {label && (
          <label className="text-description font-medium text-foreground">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <div
            className={cn(
              "flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-description text-foreground cursor-pointer items-center justify-between transition-colors",
              isOpen && "ring-1 ring-primary border-primary",
              error && "border-error focus-visible:ring-error",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!disabled) setIsOpen(!isOpen);
              }
            }}
          >
            <span className="truncate pr-4">
              {selectedOption ? selectedOption.label : t("common.select", 'Select...')}
            </span>
            <ChevronDown size={16} className="text-muted-foreground shrink-0" />
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden flex flex-col py-1 max-h-60 overflow-y-auto custom-scrollbar">
              {options.length === 0 ? (
                <div className="px-3 py-2 text-description text-muted-foreground">{t("common.noOptions", "No options")}</div>
              ) : (
                options.map((o, idx) => (
                  <div
                    key={`${o.value}-${idx}`}
                    className={cn(
                      "px-3 py-2 text-description cursor-pointer transition-colors",
                      "hover:bg-primary/10 hover:text-primary",
                      String(internalValue) === String(o.value) ? "bg-primary/10 text-primary font-medium" : "text-foreground"
                    )}
                    onClick={() => handleSelect(o.value)}
                  >
                    {o.label}
                  </div>
                ))
              )}
            </div>
          )}
          
          <select
            ref={setRefs}
            value={internalValue}
            onChange={onChange}
            className="hidden"
            disabled={disabled}
            {...props}
          >
            {children}
          </select>
        </div>
        {error && <p className="text-caption text-error mt-1">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
