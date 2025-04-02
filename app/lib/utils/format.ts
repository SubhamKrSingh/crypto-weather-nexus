/**
 * Utility functions for formatting values
 */

/**
 * Format a number as currency
 * @param value The number to format
 * @param locale The locale to use (defaults to 'en-US')
 * @param currency The currency code to use (defaults to 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number | string | undefined,
  locale: string = 'en-US',
  currency: string = 'USD'
): string => {
  if (value === undefined || value === null) {
    return '$0.00';
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '$0.00';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
};

/**
 * Format a number as a percentage
 * @param value The number to format
 * @param locale The locale to use (defaults to 'en-US')
 * @returns Formatted percentage string with a + sign for positive values
 */
export const formatPercentage = (
  value: number | string | undefined,
  locale: string = 'en-US'
): string => {
  if (value === undefined || value === null) {
    return '0.00%';
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '0.00%';
  }

  const prefix = numValue > 0 ? '+' : '';
  
  // Determine if value is already a percentage or decimal
  // Values closer to 0 (between -1 and 1, excluding 0) are likely decimals (like 0.05 for 5%)
  // Values outside that range are likely already percentages (like 5 for 5%)
  let valueToUse = numValue;
  
  if (Math.abs(numValue) > 0 && Math.abs(numValue) < 1) {
    // Value is a decimal representing a percentage (e.g., 0.05 for 5%)
    valueToUse = numValue * 100;
  }
  
  return prefix + valueToUse.toFixed(2) + '%';
};

/**
 * Format a large number with appropriate suffix (K, M, B, T)
 * @param value The number to format
 * @returns Formatted number with suffix
 */
export const formatCompactNumber = (value: number | string | undefined): string => {
  if (value === undefined || value === null) {
    return '0';
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '0';
  }

  if (numValue >= 1e12) return `${(numValue / 1e12).toFixed(2)}T`;
  if (numValue >= 1e9) return `${(numValue / 1e9).toFixed(2)}B`;
  if (numValue >= 1e6) return `${(numValue / 1e6).toFixed(2)}M`;
  if (numValue >= 1e3) return `${(numValue / 1e3).toFixed(2)}K`;
  return numValue.toFixed(2);
}; 