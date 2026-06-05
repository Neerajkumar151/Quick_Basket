/**
 * Formats a given Date object or date string into a standard short date format.
 * Example: "12 May"
 */
export const formatShortDate = (date: Date | string | number): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short' 
  });
};

/**
 * Formats a given Date object or date string into a full date format.
 * Example: "May 12, 2026"
 */
export const formatFullDate = (date: Date | string | number): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString('en-IN', { 
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
