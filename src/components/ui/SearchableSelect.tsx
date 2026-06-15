import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { SearchInput } from './SearchInput';

export interface Option {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
  emptyMessage?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  disabled = false,
  error,
  label,
  required = false,
  className,
  emptyMessage = 'No options found'
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));
  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={wrapperRef}>
      {label && (
        <label className="text-description font-medium text-foreground">
          {label} {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className={cn("relative", className)}>
        <div 
          className={cn(
            "flex min-h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-description text-foreground cursor-pointer items-center justify-between",
            error && "border-error focus-visible:ring-error",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={selectedOption ? "truncate max-w-[80%]" : "text-muted-foreground truncate"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown size={16} className="text-muted-foreground shrink-0" />
        </div>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden flex flex-col">
            <div className="p-2 border-b border-border bg-card">
              <SearchInput 
                placeholder={searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
              {filtered.length === 0 ? (
                <div className="p-2 text-center text-description text-muted-foreground">{emptyMessage}</div>
              ) : (
                filtered.map(o => (
                  <div 
                    key={o.value}
                    className={cn(
                      "px-3 py-2 text-description rounded-sm cursor-pointer hover:bg-primary/10 transition-colors",
                      value === o.value && "bg-primary/20 text-primary font-medium"
                    )}
                    onClick={() => {
                      onChange(o.value);
                      setIsOpen(false);
                      setSearch("");
                    }}
                  >
                    {o.label}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-caption text-error mt-1">{error}</p>}
    </div>
  );
};
