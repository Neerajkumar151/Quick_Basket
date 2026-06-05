import React from 'react';
import { Search } from 'lucide-react';
import { Input, InputProps } from './Input';

export const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder = "Search...", ...props }, ref) => {
    return (
      <Input
        ref={ref}
        placeholder={placeholder}
        prefixElement={<Search size={16} />}
        {...props}
      />
    );
  }
);
SearchInput.displayName = 'SearchInput';
