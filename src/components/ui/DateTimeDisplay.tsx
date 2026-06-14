import React from 'react';
import { formatDateTime, formatShortDate, formatFullDate } from '../../utils/date';

interface DateTimeDisplayProps {
  date: string | Date | number;
  format?: 'short' | 'full' | 'datetime';
  className?: string;
}

export const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({ 
  date, 
  format = 'datetime',
  className = ''
}) => {
  if (!date) return <span className={className}>-</span>;

  let formattedDate = '';
  
  switch (format) {
    case 'short':
      formattedDate = formatShortDate(date);
      break;
    case 'full':
      formattedDate = formatFullDate(date);
      break;
    case 'datetime':
    default:
      formattedDate = formatDateTime(date);
      break;
  }

  return (
    <span className={className} title={new Date(date).toString()}>
      {formattedDate}
    </span>
  );
};
