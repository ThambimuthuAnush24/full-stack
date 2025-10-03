/**
 * Utility function to get an appropriate emoji based on category text
 * @param {string} categoryText - The category text to match against
 * @param {string} type - 'income' or 'expense' to determine context
 * @returns {string} - An appropriate emoji
 */
export const getCategoryEmoji = (categoryText, type = 'income') => {
  if (!categoryText) return type === 'income' ? '💰' : '💳';
  
  const text = categoryText.toLowerCase().trim();
  
  // Income category emoji mapping
  if (type === 'income') {
    if (text.includes('salary') || text.includes('wage') || text.includes('pay')) return '💰';
    if (text.includes('freelance') || text.includes('contract')) return '💻';
    if (text.includes('invest') || text.includes('stock') || text.includes('dividend')) return '📈';
    if (text.includes('gift') || text.includes('present')) return '🎁';
    if (text.includes('refund') || text.includes('return') || text.includes('cashback')) return '↩️';
    if (text.includes('bonus')) return '🏆';
    if (text.includes('rent') || text.includes('lease')) return '🏢';
    if (text.includes('sell') || text.includes('sale')) return '💸';
    if (text.includes('interest')) return '🏦';
    if (text.includes('business')) return '💼';
    return '💲'; // Default for income
  } 
  // Expense category emoji mapping
  else {
    if (text.includes('rent') || text.includes('house') || text.includes('mortgage') || text.includes('home')) return '🏠';
    if (text.includes('food') || text.includes('grocery') || text.includes('restaurant') || text.includes('meal')) return '🍔';
    if (text.includes('car') || text.includes('gas') || text.includes('fuel') || text.includes('transport')) return '🚗';
    if (text.includes('movie') || text.includes('entertainment') || text.includes('game')) return '🎬';
    if (text.includes('shop') || text.includes('cloth') || text.includes('mall')) return '🛍️';
    if (text.includes('bill') || text.includes('utility') || text.includes('electric') || text.includes('water')) return '💡';
    if (text.includes('health') || text.includes('doctor') || text.includes('medical') || text.includes('hospital')) return '🏥';
    if (text.includes('edu') || text.includes('school') || text.includes('book') || text.includes('course')) return '📚';
    if (text.includes('tech') || text.includes('phone') || text.includes('computer')) return '📱';
    if (text.includes('insur')) return '🔒';
    if (text.includes('tax')) return '📝';
    return '💳'; // Default for expense
  }
};