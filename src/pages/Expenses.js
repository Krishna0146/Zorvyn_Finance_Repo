import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingDown, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useExpenses, useExpenseLimits } from '../hooks/useFinanceData';
import { formatCurrency, formatDate, calculateTotal } from '../utils/helpers';
import storageService from '../services/storageService';

const EXPENSE_CATEGORIES = ['Food', 'Utilities', 'Transport', 'Health', 'Shopping', 'Entertainment', 'Other'];

const ExpensesPage = () => {
  const { expenses, addExpense, deleteExpense } = useExpenses();
  const { limits } = useExpenseLimits();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  const currentUser = storageService.getCurrentUser();

  // Check for limit violations
  useEffect(() => {
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    Object.entries(categoryTotals).forEach(([category, total]) => {
      if (limits[category] && total > limits[category]) {
        toast.error(`${category} limit exceeded!`, {
          description: `You've spent ${formatCurrency(total)} of ${formatCurrency(limits[category])}`
        });
      }
    });
  }, [expenses, limits]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      ...formData,
      amount: parseFloat(formData.amount),
      userId: currentUser.id
    };
    
    // Check limit before adding
    const categoryTotal = expenses
      .filter(exp => exp.category === formData.category)
      .reduce((sum, exp) => sum + exp.amount, 0) + newExpense.amount;
    
    if (limits[formData.category] && categoryTotal > limits[formData.category]) {
      toast.warning('Warning: This will exceed your category limit!', {
        description: `Total will be ${formatCurrency(categoryTotal)} of ${formatCurrency(limits[formData.category])}`
      });
    }
    
    addExpense(newExpense);
    setFormData({ name: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
    setIsDialogOpen(false);
  };

  const totalExpenses = calculateTotal(expenses);

  // Calculate category totals and percentages
  const categoryData = EXPENSE_CATEGORIES.map(category => {
    const total = expenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);
    const limit = limits[category] || 0;
    const percentage = limit > 0 ? (total / limit) * 100 : 0;
    return { category, total, limit, percentage };
  }).filter(item => item.total > 0 || item.limit > 0);

  return (
    <div className="space-y-6" data-testid="expenses-page">
      <PageHeader
        title="Expenses"
        description="Track and manage your expenses"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="add-expense-btn">
                <Plus className="w-4 h-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="expense-dialog">
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="expense-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    data-testid="expense-amount-input"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger data-testid="expense-category-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    data-testid="expense-date-input"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="expense-submit-btn">Add Expense</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Total Expenses Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total Expenses</p>
            <p className="text-3xl sm:text-4xl font-bold text-red-600 dark:text-red-400 mt-2 number">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      {/* Category Limits */}
      {categoryData.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Category Spending</h3>
          <div className="space-y-4">
            {categoryData.map(({ category, total, limit, percentage }) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{category}</span>
                    {percentage > 100 && (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <span className="text-sm number">
                    <span className={percentage > 100 ? 'text-destructive font-semibold' : ''}>
                      {formatCurrency(total)}
                    </span>
                    {limit > 0 && (
                      <span className="text-muted-foreground"> / {formatCurrency(limit)}</span>
                    )}
                  </span>
                </div>
                {limit > 0 && (
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                    indicatorClassName={percentage > 100 ? 'bg-destructive' : 'bg-primary'}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 text-sm font-semibold">Name</th>
                <th className="text-left p-4 text-sm font-semibold">Category</th>
                <th className="text-left p-4 text-sm font-semibold">Date</th>
                <th className="text-right p-4 text-sm font-semibold">Amount</th>
                <th className="text-right p-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-muted-foreground">
                    No expenses yet. Add one to get started!
                  </td>
                </tr>
              ) : (
                expenses.map((item) => (
                  <tr key={item.id} className="border-t border-border hover:bg-accent transition-colors duration-200">
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 bg-destructive/10 text-destructive rounded text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(item.date)}</td>
                    <td className="p-4 text-right font-semibold text-red-600 dark:text-red-400 number">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteExpense(item.id)}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors duration-200"
                        data-testid={`delete-expense-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;