const STORAGE_KEYS = {
  INCOME: 'finance_income',
  EXPENSES: 'finance_expenses',
  EXPENSE_LIMITS: 'finance_expense_limits',
  EMIS: 'finance_emis',
  FEES: 'finance_fees',
  SAVINGS: 'finance_savings',
  INVESTMENTS: 'finance_investments',
  TRIPS: 'finance_trips',
  USERS: 'finance_users',
  CURRENT_USER: 'finance_current_user',
  THEME: 'finance_theme'
};

const storageService = {
  // Generic get/set
  get(key) {
    try {
      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  },

  set(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  },

  // Income
  getIncome() {
    return this.get(STORAGE_KEYS.INCOME) || [];
  },
  setIncome(income) {
    this.set(STORAGE_KEYS.INCOME, income);
  },

  // Expenses
  getExpenses() {
    return this.get(STORAGE_KEYS.EXPENSES) || [];
  },
  setExpenses(expenses) {
    this.set(STORAGE_KEYS.EXPENSES, expenses);
  },

  // Expense Limits
  getExpenseLimits() {
    return this.get(STORAGE_KEYS.EXPENSE_LIMITS) || {};
  },
  setExpenseLimits(limits) {
    this.set(STORAGE_KEYS.EXPENSE_LIMITS, limits);
  },

  // EMIs
  getEMIs() {
    return this.get(STORAGE_KEYS.EMIS) || [];
  },
  setEMIs(emis) {
    this.set(STORAGE_KEYS.EMIS, emis);
  },

  // Fees
  getFees() {
    return this.get(STORAGE_KEYS.FEES) || [];
  },
  setFees(fees) {
    this.set(STORAGE_KEYS.FEES, fees);
  },

  // Savings
  getSavings() {
    return this.get(STORAGE_KEYS.SAVINGS) || [];
  },
  setSavings(savings) {
    this.set(STORAGE_KEYS.SAVINGS, savings);
  },

  // Investments
  getInvestments() {
    return this.get(STORAGE_KEYS.INVESTMENTS) || [];
  },
  setInvestments(investments) {
    this.set(STORAGE_KEYS.INVESTMENTS, investments);
  },

  // Trips
  getTrips() {
    return this.get(STORAGE_KEYS.TRIPS) || [];
  },
  setTrips(trips) {
    this.set(STORAGE_KEYS.TRIPS, trips);
  },

  // Users
  getUsers() {
    return this.get(STORAGE_KEYS.USERS) || [];
  },
  setUsers(users) {
    this.set(STORAGE_KEYS.USERS, users);
  },

  // Current User
  getCurrentUser() {
    return this.get(STORAGE_KEYS.CURRENT_USER) || { id: 'admin', role: 'admin', name: 'Parent' };
  },
  setCurrentUser(user) {
    this.set(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Theme
  getTheme() {
    return this.get(STORAGE_KEYS.THEME) || 'light';
  },
  setTheme(theme) {
    this.set(STORAGE_KEYS.THEME, theme);
  },

  // Clear all
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      sessionStorage.removeItem(key);
    });
  }
};

export default storageService;