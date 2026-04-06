import React, { useState } from 'react';
import { Plus, Trash2, PiggyBank, Target } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useSavings } from '../hooks/useFinanceData';
import { formatCurrency, formatDate } from '../utils/helpers';
import storageService from '../services/storageService';
import { cn } from '@/lib/utils';

const SavingsPage = () => {
  const { savings, addSaving, deleteSaving } = useSavings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    goalName: '',
    targetAmount: '',
    savedAmount: '',
    deadline: ''
  });

  const currentUser = storageService.getCurrentUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    addSaving({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      savedAmount: parseFloat(formData.savedAmount),
      userId: currentUser.id
    });
    setFormData({ goalName: '', targetAmount: '', savedAmount: '', deadline: '' });
    setIsDialogOpen(false);
  };

  const totalSaved = savings.reduce((sum, s) => sum + s.savedAmount, 0);
  const totalTarget = savings.reduce((sum, s) => sum + s.targetAmount, 0);

  return (
    <div className="space-y-6" data-testid="savings-page">
      <PageHeader
        title="Savings"
        description="Track your savings goals"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="add-saving-btn">
                <Plus className="w-4 h-4" />
                Add Savings Goal
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="saving-dialog">
              <DialogHeader>
                <DialogTitle>Add Savings Goal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="goalName">Goal Name</Label>
                  <Input
                    id="goalName"
                    value={formData.goalName}
                    onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
                    required
                    data-testid="saving-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    required
                    data-testid="saving-target-input"
                  />
                </div>
                <div>
                  <Label htmlFor="savedAmount">Saved Amount (₹)</Label>
                  <Input
                    id="savedAmount"
                    type="number"
                    value={formData.savedAmount}
                    onChange={(e) => setFormData({ ...formData, savedAmount: e.target.value })}
                    required
                    data-testid="saving-saved-input"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                    data-testid="saving-deadline-input"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="saving-submit-btn">Add Savings Goal</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total Saved</p>
              <p className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 number">
                {formatCurrency(totalSaved)}
              </p>
            </div>
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
              <PiggyBank className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total Target</p>
              <p className="text-3xl sm:text-4xl font-bold text-secondary mt-2 number">
                {formatCurrency(totalTarget)}
              </p>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg">
              <Target className="w-8 h-8 text-secondary" />
            </div>
          </div>
        </div>
      </div>

      {/* Savings Goals */}
      <div className="grid grid-cols-1 gap-4">
        {savings.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
            No savings goals yet. Add one to get started!
          </div>
        ) : (
          savings.map((saving) => {
            const percentage = (saving.savedAmount / saving.targetAmount) * 100;
            const isCompleted = percentage >= 100;
            return (
              <div
                key={saving.id}
                className={cn(
                  "bg-card border rounded-lg p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
                  isCompleted ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-border'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{saving.goalName}</h3>
                    {isCompleted && (
                      <span className="inline-block mt-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded text-xs font-medium">
                        Goal Reached!
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteSaving(saving.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors duration-200"
                    data-testid={`delete-saving-${saving.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-2xl font-bold number">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>

                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-3"
                    indicatorClassName={isCompleted ? 'bg-emerald-500' : 'bg-primary'}
                  />

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Saved</p>
                      <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 number">
                        {formatCurrency(saving.savedAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Target</p>
                      <p className="text-lg font-semibold number">{formatCurrency(saving.targetAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="text-lg font-medium">{formatDate(saving.deadline)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavingsPage;