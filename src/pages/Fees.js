import React, { useState } from 'react';
import { Plus, Trash2, GraduationCap, AlertCircle, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFees } from '../hooks/useFinanceData';
import { formatCurrency, formatDate, isOverdue } from '../utils/helpers';
import storageService from '../services/storageService';
import { cn } from '@/lib/utils';

const FEE_TYPES = ['School Fee', 'Tuition Classes', 'Sports Classes', 'Annual Maintenance', 'Exam Fee', 'Other'];

const FeesPage = () => {
  const { fees, addFee, updateFee, deleteFee } = useFees();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'School Fee',
    amount: '',
    dueDate: '',
    status: 'pending'
  });

  const currentUser = storageService.getCurrentUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    addFee({
      ...formData,
      amount: parseFloat(formData.amount),
      userId: currentUser.id
    });
    setFormData({ type: 'School Fee', amount: '', dueDate: '', status: 'pending' });
    setIsDialogOpen(false);
  };

  const toggleStatus = (fee) => {
    updateFee(fee.id, { ...fee, status: fee.status === 'paid' ? 'pending' : 'paid' });
  };

  const pendingFees = fees.filter(f => f.status === 'pending');
  const paidFees = fees.filter(f => f.status === 'paid');
  const overdueFees = pendingFees.filter(f => isOverdue(f.dueDate));
  const totalPending = pendingFees.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6" data-testid="fees-page">
      <PageHeader
        title="Fees"
        description="Manage school fees, tuition, and other payments"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="add-fee-btn">
                <Plus className="w-4 h-4" />
                Add Fee
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="fee-dialog">
              <DialogHeader>
                <DialogTitle>Add Fee</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Fee Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger data-testid="fee-type-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FEE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    data-testid="fee-amount-input"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                    data-testid="fee-due-input"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="fee-submit-btn">Add Fee</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total Pending</p>
              <p className="text-3xl sm:text-4xl font-bold text-amber-600 dark:text-amber-400 mt-2 number">
                {formatCurrency(totalPending)}
              </p>
            </div>
            <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
              <GraduationCap className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Pending Fees</p>
          <p className="text-3xl sm:text-4xl font-bold mt-2">{pendingFees.length}</p>
        </div>

        {overdueFees.length > 0 && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-destructive font-medium uppercase tracking-wide">Overdue</p>
                <p className="text-3xl sm:text-4xl font-bold text-destructive mt-2">{overdueFees.length}</p>
              </div>
              <div className="p-4 bg-destructive/20 rounded-lg">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fees List */}
      <div className="grid grid-cols-1 gap-4">
        {fees.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
            No fees yet. Add one to get started!
          </div>
        ) : (
          fees.map((fee) => {
            const overdue = fee.status === 'pending' && isOverdue(fee.dueDate);
            return (
              <div
                key={fee.id}
                className={cn(
                  "bg-card border rounded-lg p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
                  overdue ? 'border-destructive bg-destructive/5' : 'border-border',
                  fee.status === 'paid' && 'opacity-60'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{fee.type}</h3>
                      {fee.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Paid
                        </span>
                      ) : overdue ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive rounded text-xs font-medium">
                          <AlertCircle className="w-3 h-3" />
                          Overdue
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded text-xs font-medium">
                          Pending
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-2xl font-semibold number">{formatCurrency(fee.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Due Date</p>
                        <p className={cn("text-lg font-medium", overdue && 'text-destructive')}>
                          {formatDate(fee.dueDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStatus(fee)}
                      className={cn(
                        "px-3 py-2 rounded text-sm font-medium transition-colors duration-200",
                        fee.status === 'paid'
                          ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-200'
                          : 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200'
                      )}
                      data-testid={`toggle-fee-${fee.id}`}
                    >
                      {fee.status === 'paid' ? 'Mark Pending' : 'Mark Paid'}
                    </button>
                    <button
                      onClick={() => deleteFee(fee.id)}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors duration-200"
                      data-testid={`delete-fee-${fee.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default FeesPage;