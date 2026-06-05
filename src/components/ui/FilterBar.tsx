import React from 'react';

export const FilterBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full bg-card p-4 rounded-xl border border-border">
      {children}
    </div>
  );
};
