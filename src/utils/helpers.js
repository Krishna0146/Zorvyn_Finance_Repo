export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const calculateTotal = (items, field = 'amount') => {
  return items.reduce((sum, item) => sum + (item[field] || 0), 0);
};

export const calculateInvestmentPL = (investment) => {
  const purchaseValue = investment.quantity * investment.purchasePrice;
  const currentValue = investment.quantity * investment.currentPrice;
  const pl = currentValue - purchaseValue;
  const plPercentage = (pl / purchaseValue) * 100;
  return { pl, plPercentage, currentValue, purchaseValue };
};

export const isOverdue = (dateString) => {
  return new Date(dateString) < new Date();
};

export const filterByDateRange = (items, range, dateField = 'date') => {
  const now = new Date();
  let startDate;

  switch (range) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case '7days':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      return items;
  }

  return items.filter(item => new Date(item[dateField]) >= startDate);
};

export const filterByCategory = (items, category) => {
  if (!category || category === 'all') return items;
  return items.filter(item => item.category === category);
};

export const searchItems = (items, searchTerm, fields = ['name', 'description']) => {
  if (!searchTerm) return items;
  const term = searchTerm.toLowerCase();
  return items.filter(item =>
    fields.some(field => item[field]?.toLowerCase().includes(term))
  );
};

export const sortItems = (items, sortBy, order = 'desc') => {
  return [...items].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'date' || sortBy === 'dueDate' || sortBy === 'deadline') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });
};