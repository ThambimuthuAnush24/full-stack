/**
 * Format a date string to a human-readable format
 * @param {string} dateString - Date string in ISO format
 * @param {object} options - Format options for Intl.DateTimeFormat
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Calculate percentage of one value relative to another
 * @param {number} value - The value to calculate percentage for
 * @param {number} total - The total value (100%)
 * @returns {number} Percentage value
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Generate a random color
 * @returns {string} Random HSL color
 */
export const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
};

/**
 * Group an array of objects by a specific property
 * @param {Array} array - Array to group
 * @param {string} key - Property to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Extract a subset of properties from an object
 * @param {Object} obj - Source object
 * @param {Array} keys - Array of keys to pick
 * @returns {Object} New object with only the specified keys
 */
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

/**
 * Get start and end dates for common time periods
 * @param {string} period - Time period ('today', 'thisWeek', 'thisMonth', 'lastMonth', 'thisYear')
 * @returns {Object} Object with startDate and endDate
 */
export const getDateRangeForPeriod = (period) => {
  const today = new Date();
  let startDate, endDate;

  switch (period) {
    case 'today':
      startDate = new Date(today);
      endDate = new Date(today);
      break;
    case 'thisWeek':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
      endDate = new Date(today);
      break;
    case 'thisMonth':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today);
      break;
    case 'lastMonth':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case 'thisYear':
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today);
      break;
    default:
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today);
  }

  return { startDate, endDate };
};