import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input, InputProps } from './Input';
import { useDebounce } from '../../hooks/useDebounce';

export interface SearchInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  debounceMs?: number;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = "Search...", value = "", onChange, debounceMs = 400, ...props }, ref) => {
    const [localValue, setLocalValue] = useState(value);
    
    // Sync external value changes (e.g. clearing search)
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const debouncedValue = useDebounce(localValue, debounceMs);
    const onChangeRef = useRef(onChange);

    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
      if (debouncedValue !== value && onChangeRef.current) {
        // Dispatch synthetic event to maintain compatibility with existing consumers
        onChangeRef.current({
          target: { value: debouncedValue }
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }, [debouncedValue, value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value);
    };

    return (
      <Input
        ref={ref}
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        prefixElement={<Search size={16} />}
        {...props}
      />
    );
  }
);
SearchInput.displayName = 'SearchInput';
