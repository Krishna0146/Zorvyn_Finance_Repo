import React, { useState } from 'react';
import { Plus, Trash2, Edit2, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import PageHeader from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIncome } from '../hooks/useFinanceData';
import { formatCurrency, formatDate, calculateTotal } from '../utils/helpers';
import storageService from '../services/storageService';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Rent', 'Other'];
const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const IncomePage = () => {
  const { income, addIncome, deleteIncome } = useIncome();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Salary',
    date: new Date().toISOString().split('T')[0]
  });

  const currentUser = storageService.getCurrentUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    addIncome({
      ...formData,
      amount: parseFloat(formData.amount),
      userId: currentUser.id
    });
    setFormData({ name: '', amount: '', category: 'Salary', date: new Date().toISOString().split('T')[0] });
    setIsDialogOpen(false);
  };

  const totalIncome = calculateTotal(income);

  // Group by category for chart
  const incomeByCategory = income.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const chartData = Object.entries(incomeByCategory).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6" data-testid="income-page">
      <PageHeader
        title="Income"
        description="Manage your income sources"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="add-income-btn">
                <Plus className="w-4 h-4" />
                Add Income
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="income-dialog">
              <DialogHeader>
                <DialogTitle>Add Income</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="income-name-input"
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
                    data-testid="income-amount-input"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger data-testid="income-category-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INCOME_CATEGORIES.map(cat => (
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
                    data-testid="income-date-input"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="income-submit-btn">Add Income</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Total Income Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total Income</p>
            <p className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 number">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
            <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Income by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="hsl(var(--chart-1))"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
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
      )}

      {/* Income List */}
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
              {income.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-muted-foreground">
                    No income records yet. Add one to get started!
                  </td>
                </tr>
              ) : (
                income.map((item) => (
                  <tr key={item.id} className="border-t border-border hover:bg-accent transition-colors duration-200">
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(item.date)}</td>
                    <td className="p-4 text-right font-semibold text-emerald-600 dark:text-emerald-400 number">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteIncome(item.id)}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors duration-200"
                        data-testid={`delete-income-${item.id}`}
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

export default IncomePage;