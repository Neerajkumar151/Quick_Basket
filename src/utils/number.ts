/**
 * Formats a number with standard commas (e.g., 1000 -> 1,000)
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Formats a number into a currency string.
 * Example: 1000 -> "$1,000.00"
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0, // Typical for INR in most UI
  }).format(amount);
};
