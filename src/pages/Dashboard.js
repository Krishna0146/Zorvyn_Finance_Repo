import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Wallet, 
  LineChart as LineChartIcon,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import storageService from '../services/storageService';
import { formatCurrency, calculateTotal, calculateInvestmentPL, filterByDateRange } from '../utils/helpers';

const Dashboard = () => {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    setIncome(storageService.getIncome());
    setExpenses(storageService.getExpenses());
    setSavings(storageService.getSavings());
    setInvestments(storageService.getInvestments());
  }, []);

  // Calculate totals
  const thisMonthIncome = filterByDateRange(income, 'month');
  const thisMonthExpenses = filterByDateRange(expenses, 'month');
  
  const totalIncome = calculateTotal(thisMonthIncome);
  const totalExpenses = calculateTotal(thisMonthExpenses);
  const totalSaved = calculateTotal(savings, 'savedAmount');
  
  const investmentValue = investments.reduce((sum, inv) => {
    const { currentValue } = calculateInvestmentPL(inv);
    return sum + currentValue;
  }, 0);

  const totalBalance = totalIncome - totalExpenses + totalSaved + investmentValue;

  // Expenses by category
  const expensesByCategory = thisMonthExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const expenseCategoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value
  }));

  // Income by category
  const incomeByCategory = thisMonthIncome.reduce((acc, inc) => {
    acc[inc.category] = (acc[inc.category] || 0) + inc.amount;
    return acc;
  }, {});

  const incomeCategoryData = Object.entries(incomeByCategory).map(([name, value]) => ({
    name,
    value
  }));

  // Income vs Expenses trend (mock monthly data)
  const trendData = [
    { month: 'Jul', income: 95000, expenses: 52000 },
    { month: 'Aug', income: 88000, expenses: 48000 },
    { month: 'Sep', income: 92000, expenses: 54000 },
    { month: 'Oct', income: 105000, expenses: 51000 },
    { month: 'Nov', income: 98000, expenses: 56000 },
    { month: 'Dec', income: totalIncome, expenses: totalExpenses }
  ];

  // Highest and lowest
  const highestExpense = thisMonthExpenses.reduce((max, exp) => exp.amount > max.amount ? exp : max, thisMonthExpenses[0] || { amount: 0, category: 'N/A' });
  const lowestExpense = thisMonthExpenses.reduce((min, exp) => exp.amount < min.amount ? exp : min, thisMonthExpenses[0] || { amount: 0, category: 'N/A' });
  const highestIncome = thisMonthIncome.reduce((max, inc) => inc.amount > max.amount ? inc : max, thisMonthIncome[0] || { amount: 0, category: 'N/A' });

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      <PageHeader
        title="Dashboard"
        description="Your financial overview at a glance"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          icon={Wallet}
          valueClassName="text-primary"
          data-testid="total-balance-card"
        />
        <StatCard
          title="Income (This Month)"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          valueClassName="text-emerald-600 dark:text-emerald-400"
          data-testid="income-card"
        />
        <StatCard
          title="Expenses (This Month)"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          valueClassName="text-red-600 dark:text-red-400"
          data-testid="expenses-card"
        />
        <StatCard
          title="Total Savings"
          value={formatCurrency(totalSaved)}
          icon={PiggyBank}
          valueClassName="text-secondary"
          data-testid="savings-card"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Income vs Expenses Trend */}
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expenses by Category */}
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseCategoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Bar dataKey="value" fill="hsl(var(--chart-3))" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income Distribution */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Income Sources Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={incomeCategoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="hsl(var(--chart-1))"
              dataKey="value"
            >
              {incomeCategoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
              formatter={(value) => formatCurrency(value)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <ArrowUpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-semibold text-sm">Highest Expense</h4>
          </div>
          <p className="text-xl font-bold number">{formatCurrency(highestExpense?.amount || 0)}</p>
          <p className="text-xs text-muted-foreground mt-1">on {highestExpense?.category || 'N/A'}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <ArrowDownCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-sm">Lowest Expense</h4>
          </div>
          <p className="text-xl font-bold number">{formatCurrency(lowestExpense?.amount || 0)}</p>
          <p className="text-xs text-muted-foreground mt-1">on {lowestExpense?.category || 'N/A'}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <LineChartIcon className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-sm">Highest Income Source</h4>
          </div>
          <p className="text-xl font-bold number">{formatCurrency(highestIncome?.amount || 0)}</p>
          <p className="text-xs text-muted-foreground mt-1">from {highestIncome?.category || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;