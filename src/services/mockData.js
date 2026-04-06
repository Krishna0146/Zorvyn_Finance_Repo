const generateId = () => Math.random().toString(36).substr(2, 9);

export const mockIncome = [
  { id: generateId(), name: 'Monthly Salary', amount: 75000, category: 'Salary', date: '2026-01-01', userId: 'admin' },
  { id: generateId(), name: 'Freelance Project', amount: 15000, category: 'Freelance', date: '2026-01-10', userId: 'admin' },
  { id: generateId(), name: 'Dividends', amount: 3500, category: 'Investment', date: '2026-01-15', userId: 'admin' },
  { id: generateId(), name: 'Rental Income', amount: 12000, category: 'Rent', date: '2026-01-05', userId: 'admin' },
  { id: generateId(), name: 'Bonus', amount: 25000, category: 'Salary', date: '2025-12-28', userId: 'admin' }
];

export const mockExpenses = [
  { id: generateId(), name: 'Groceries', amount: 8500, category: 'Food', date: '2026-01-03', userId: 'admin' },
  { id: generateId(), name: 'Electricity Bill', amount: 2200, category: 'Utilities', date: '2026-01-05', userId: 'admin' },
  { id: generateId(), name: 'Restaurant Dinner', amount: 3200, category: 'Food', date: '2026-01-08', userId: 'admin' },
  { id: generateId(), name: 'Fuel', amount: 4500, category: 'Transport', date: '2026-01-12', userId: 'admin' },
  { id: generateId(), name: 'Medical Checkup', amount: 1500, category: 'Health', date: '2026-01-14', userId: 'admin' },
  { id: generateId(), name: 'Clothing Shopping', amount: 5600, category: 'Shopping', date: '2026-01-16', userId: 'admin' },
  { id: generateId(), name: 'Internet Bill', amount: 899, category: 'Utilities', date: '2026-01-02', userId: 'admin' }
];

export const mockExpenseLimits = {
  Food: 15000,
  Utilities: 5000,
  Transport: 8000,
  Health: 10000,
  Shopping: 10000,
  Entertainment: 7000
};

export const mockEMIs = [
  {
    id: generateId(),
    name: 'Home Loan',
    totalAmount: 3500000,
    interestRate: 8.5,
    tenure: 240,
    emiAmount: 29850,
    startDate: '2023-06-01',
    nextDueDate: '2026-02-01',
    userId: 'admin'
  },
  {
    id: generateId(),
    name: 'Car Loan',
    totalAmount: 850000,
    interestRate: 9.2,
    tenure: 60,
    emiAmount: 17680,
    startDate: '2024-03-01',
    nextDueDate: '2026-02-01',
    userId: 'admin'
  },
  {
    id: generateId(),
    name: 'Personal Loan',
    totalAmount: 200000,
    interestRate: 11.5,
    tenure: 36,
    emiAmount: 6620,
    startDate: '2025-09-01',
    nextDueDate: '2026-02-01',
    userId: 'admin'
  }
];

export const mockFees = [
  { id: generateId(), type: 'School Fee', amount: 15000, dueDate: '2026-02-05', status: 'pending', userId: 'admin' },
  { id: generateId(), type: 'Tuition Classes', amount: 4500, dueDate: '2026-02-01', status: 'pending', userId: 'admin' },
  { id: generateId(), type: 'Swimming Classes', amount: 2000, dueDate: '2026-01-25', status: 'paid', userId: 'admin' },
  { id: generateId(), type: 'Annual Maintenance', amount: 8000, dueDate: '2026-01-31', status: 'pending', userId: 'admin' }
];

export const mockSavings = [
  {
    id: generateId(),
    goalName: 'Emergency Fund',
    targetAmount: 500000,
    savedAmount: 325000,
    deadline: '2026-12-31',
    userId: 'admin'
  },
  {
    id: generateId(),
    goalName: 'Vacation to Goa',
    targetAmount: 80000,
    savedAmount: 45000,
    deadline: '2026-06-30',
    userId: 'admin'
  },
  {
    id: generateId(),
    goalName: 'New Laptop',
    targetAmount: 120000,
    savedAmount: 95000,
    deadline: '2026-03-31',
    userId: 'admin'
  },
  {
    id: generateId(),
    goalName: "Child's Education",
    targetAmount: 1000000,
    savedAmount: 280000,
    deadline: '2028-12-31',
    userId: 'admin'
  }
];

export const mockInvestments = [
  {
    id: generateId(),
    name: 'Reliance Industries',
    type: 'Stock',
    quantity: 50,
    purchasePrice: 2450,
    currentPrice: 2680,
    date: '2025-08-15',
    userId: 'admin'
  },
  {
    id: generateId(),
    name: 'HDFC Top 100 Fund',
    type: 'Mutual Fund',
    quantity: 850,
    purchasePrice: 680,
    currentPrice: 725,
    date: '2025-05-10',
    userId: 'admin'
  },
  {
    id: generateId(),
    name: 'SBI Bluechip SIP',
    type: 'SIP',
    quantity: 1200,
    purchasePrice: 45,
    currentPrice: 52,
    date: '2024-01-01',
    userId: 'admin'
  },
  {
    id: generateId(),
    name: 'Infosys',
    type: 'Stock',
    quantity: 35,
    purchasePrice: 1520,
    currentPrice: 1485,
    date: '2025-11-20',
    userId: 'admin'
  }
];

export const mockTrips = [
  {
    id: generateId(),
    name: 'Manali Trip',
    type: 'Group',
    startDate: '2026-01-10',
    endDate: '2026-01-15',
    expenses: [
      { id: generateId(), description: 'Hotel Booking', amount: 15000, category: 'Accommodation', paidBy: 'Rahul' },
      { id: generateId(), description: 'Car Rental', amount: 8000, category: 'Transport', paidBy: 'Priya' },
      { id: generateId(), description: 'Food & Drinks', amount: 6500, category: 'Food', paidBy: 'Rahul' },
      { id: generateId(), description: 'Activities', amount: 4500, category: 'Entertainment', paidBy: 'Amit' }
    ],
    userId: 'admin'
  },
  {
    id: generateId(),
    name: 'Jaipur Weekend',
    type: 'Individual',
    startDate: '2025-12-20',
    endDate: '2025-12-22',
    expenses: [
      { id: generateId(), description: 'Flight Tickets', amount: 8500, category: 'Transport', paidBy: 'Self' },
      { id: generateId(), description: 'Hotel', amount: 5000, category: 'Accommodation', paidBy: 'Self' },
      { id: generateId(), description: 'Shopping', amount: 3200, category: 'Shopping', paidBy: 'Self' }
    ],
    userId: 'admin'
  }
];

export const mockUsers = [
  {
    id: 'admin',
    name: 'Parent',
    role: 'admin',
    email: 'parent@example.com'
  },
  {
    id: 'child1',
    name: 'Aarav',
    role: 'user',
    email: 'aarav@example.com',
    limits: { Food: 3000, Shopping: 2000, Entertainment: 1500 }
  },
  {
    id: 'child2',
    name: 'Diya',
    role: 'user',
    email: 'diya@example.com',
    limits: { Food: 2500, Shopping: 1500, Entertainment: 1000 }
  }
];

export const initializeMockData = () => {
  const storageService = require('./storageService').default;
  
  if (!storageService.getIncome().length) {
    storageService.setIncome(mockIncome);
  }
  if (!storageService.getExpenses().length) {
    storageService.setExpenses(mockExpenses);
  }
  if (!Object.keys(storageService.getExpenseLimits()).length) {
    storageService.setExpenseLimits(mockExpenseLimits);
  }
  if (!storageService.getEMIs().length) {
    storageService.setEMIs(mockEMIs);
  }
  if (!storageService.getFees().length) {
    storageService.setFees(mockFees);
  }
  if (!storageService.getSavings().length) {
    storageService.setSavings(mockSavings);
  }
  if (!storageService.getInvestments().length) {
    storageService.setInvestments(mockInvestments);
  }
  if (!storageService.getTrips().length) {
    storageService.setTrips(mockTrips);
  }
  if (!storageService.getUsers().length) {
    storageService.setUsers(mockUsers);
  }
};