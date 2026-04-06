import React, { useState } from 'react';
import { Plus, Trash2, LineChart as LineChartIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageHeader from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInvestments } from '../hooks/useFinanceData';
import { formatCurrency, formatDate, calculateInvestmentPL } from '../utils/helpers';
import storageService from '../services/storageService';
import { cn } from '@/lib/utils';

const INVESTMENT_TYPES = ['Stock', 'Mutual Fund', 'SIP', 'Bond', 'Other'];

const InvestmentsPage = () => {
  const { investments, addInvestment, deleteInvestment } = useInvestments();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Stock',
    quantity: '',
    purchasePrice: '',
    currentPrice: '',
    date: new Date().toISOString().split('T')[0]
  });

  const currentUser = storageService.getCurrentUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    addInvestment({
      ...formData,
      quantity: parseFloat(formData.quantity),
      purchasePrice: parseFloat(formData.purchasePrice),
      currentPrice: parseFloat(formData.currentPrice),
      userId: currentUser.id
    });
    setFormData({ name: '', type: 'Stock', quantity: '', purchasePrice: '', currentPrice: '', date: new Date().toISOString().split('T')[0] });
    setIsDialogOpen(false);
  };

  // Calculate portfolio metrics
  const portfolioMetrics = investments.reduce(
    (acc, inv) => {
      const { pl, currentValue, purchaseValue } = calculateInvestmentPL(inv);
      return {
        totalCurrent: acc.totalCurrent + currentValue,
        totalInvested: acc.totalInvested + purchaseValue,
        totalPL: acc.totalPL + pl
      };
    },
    { totalCurrent: 0, totalInvested: 0, totalPL: 0 }
  );

  const totalPLPercentage = portfolioMetrics.totalInvested > 0
    ? (portfolioMetrics.totalPL / portfolioMetrics.totalInvested) * 100
    : 0;

  // Mock portfolio value trend
  const trendData = [
    { month: 'Jul', value: portfolioMetrics.totalInvested * 0.85 },
    { month: 'Aug', value: portfolioMetrics.totalInvested * 0.92 },
    { month: 'Sep', value: portfolioMetrics.totalInvested * 0.88 },
    { month: 'Oct', value: portfolioMetrics.totalInvested * 0.95 },
    { month: 'Nov', value: portfolioMetrics.totalInvested * 1.02 },
    { month: 'Dec', value: portfolioMetrics.totalCurrent }
  ];

  return (
    <div className="space-y-6" data-testid="investments-page">
      <PageHeader
        title="Investments"
        description="Track your investment portfolio"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="add-investment-btn">
                <Plus className="w-4 h-4" />
                Add Investment
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="investment-dialog">
              <DialogHeader>
                <DialogTitle>Add Investment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Investment Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="investment-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger data-testid="investment-type-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INVESTMENT_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity/Units</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    data-testid="investment-quantity-input"
                  />
                </div>
                <div>
                  <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    required
                    data-testid="investment-purchase-input"
                  />
                </div>
                <div>
                  <Label htmlFor="currentPrice">Current Price (₹)</Label>
                  <Input
                    id="currentPrice"
                    type="number"
                    step="0.01"
                    value={formData.currentPrice}
                    onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                    required
                    data-testid="investment-current-input"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Purchase Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    data-testid="investment-date-input"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="investment-submit-btn">Add Investment</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Portfolio Value</p>
          <p className="text-3xl sm:text-4xl font-bold text-secondary mt-2 number">
            {formatCurrency(portfolioMetrics.totalCurrent)}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total Invested</p>
          <p className="text-3xl sm:text-4xl font-bold mt-2 number">
            {formatCurrency(portfolioMetrics.totalInvested)}
          </p>
        </div>

        <div className={cn(
          "border rounded-lg p-6",
          portfolioMetrics.totalPL >= 0
            ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500'
            : 'bg-red-50 dark:bg-red-900/10 border-red-500'
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total P&L</p>
              <p className={cn(
                "text-3xl sm:text-4xl font-bold mt-2 number",
                portfolioMetrics.totalPL >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              )}>
                {formatCurrency(Math.abs(portfolioMetrics.totalPL))}
              </p>
              <p className={cn(
                "text-sm font-medium mt-1",
                portfolioMetrics.totalPL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              )}>
                {totalPLPercentage >= 0 ? '+' : ''}{totalPLPercentage.toFixed(2)}%
              </p>
            </div>
            <div className={cn(
              "p-4 rounded-lg",
              portfolioMetrics.totalPL >= 0
                ? 'bg-emerald-100 dark:bg-emerald-900/20'
                : 'bg-red-100 dark:bg-red-900/20'
            )}>
              {portfolioMetrics.totalPL >= 0 ? (
                <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Trend Chart */}
      {investments.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Portfolio Value Trend</h3>
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
              <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Value" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Investments List */}
      <div className="grid grid-cols-1 gap-4">
        {investments.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
            No investments yet. Add one to get started!
          </div>
        ) : (
          investments.map((investment) => {
            const { pl, plPercentage, currentValue, purchaseValue } = calculateInvestmentPL(investment);
            const isProfit = pl >= 0;

            return (
              <div
                key={investment.id}
                className="bg-card border border-border rounded-lg p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{investment.name}</h3>
                    <span className="inline-block mt-1 px-2 py-1 bg-secondary/10 text-secondary rounded text-xs font-medium">
                      {investment.type}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteInvestment(investment.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors duration-200"
                    data-testid={`delete-investment-${investment.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="text-lg font-semibold number">{investment.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Purchase Value</p>
                    <p className="text-lg font-semibold number">{formatCurrency(purchaseValue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Current Value</p>
                    <p className="text-lg font-semibold number">{formatCurrency(currentValue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">P&L</p>
                    <p className={cn(
                      "text-lg font-semibold number",
                      isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    )}>
                      {isProfit ? '+' : ''}{formatCurrency(pl)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">P&L %</p>
                    <p className={cn(
                      "text-lg font-semibold",
                      isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    )}>
                      {isProfit ? '+' : ''}{plPercentage.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">Purchase Date: {formatDate(investment.date)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InvestmentsPage;