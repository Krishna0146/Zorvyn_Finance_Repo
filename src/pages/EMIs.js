import React, { useState } from 'react';
import { Plus, Trash2, CreditCard, AlertCircle, Search, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEMIs } from '../hooks/useFinanceData';
import { formatCurrency, formatDate, isOverdue } from '../utils/helpers';
import storageService from '../services/storageService';
import { cn } from '@/lib/utils';

const EMIsPage = () => {
  const { emis, addEMI, deleteEMI } = useEMIs();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    interestRate: '',
    tenure: '',
    emiAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    nextDueDate: ''
  });

  // Search & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const currentUser = storageService.getCurrentUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    addEMI({
      ...formData,
      totalAmount: parseFloat(formData.totalAmount),
      interestRate: parseFloat(formData.interestRate),
      tenure: parseInt(formData.tenure),
      emiAmount: parseFloat(formData.emiAmount),
      userId: currentUser.id
    });
    setFormData({
      name: '',
      totalAmount: '',
      interestRate: '',
      tenure: '',
      emiAmount: '',
      startDate: new Date().toISOString().split('T')[0],
      nextDueDate: ''
    });
    setIsDialogOpen(false);
  };

  const totalEMI = emis.reduce((sum, emi) => sum + emi.emiAmount, 0);
  const overdueEMIs = emis.filter(emi => isOverdue(emi.nextDueDate));

  // Search + Sort
  const filteredAndSortedEMIs = emis
    .filter(emi => emi.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      let valA, valB;
      if (sortBy === 'name') { valA = a.name.toLowerCase(); valB = b.name.toLowerCase(); }
      else if (sortBy === 'emiAmount') { valA = a.emiAmount; valB = b.emiAmount; }
      else if (sortBy === 'totalAmount') { valA = a.totalAmount; valB = b.totalAmount; }
      else if (sortBy === 'nextDueDate') { valA = a.nextDueDate; valB = b.nextDueDate; }
      else if (sortBy === 'interestRate') { valA = a.interestRate; valB = b.interestRate; }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const toggleSortOrder = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  return (
    <div className="space-y-6" data-testid="emis-page">
      <PageHeader
        title="EMIs & Loans"
        description="Manage your loans and monthly EMIs"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="add-emi-btn">
                <Plus className="w-4 h-4" />
                Add EMI/Loan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="emi-dialog">
              <DialogHeader>
                <DialogTitle>Add EMI/Loan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Loan Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="emi-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="totalAmount">Total Amount (₹)</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    required
                    data-testid="emi-total-input"
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    required
                    data-testid="emi-interest-input"
                  />
                </div>
                <div>
                  <Label htmlFor="tenure">Tenure (months)</Label>
                  <Input
                    id="tenure"
                    type="number"
                    value={formData.tenure}
                    onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                    required
                    data-testid="emi-tenure-input"
                  />
                </div>
                <div>
                  <Label htmlFor="emiAmount">EMI Amount (₹)</Label>
                  <Input
                    id="emiAmount"
                    type="number"
                    value={formData.emiAmount}
                    onChange={(e) => setFormData({ ...formData, emiAmount: e.target.value })}
                    required
                    data-testid="emi-amount-input"
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    data-testid="emi-start-input"
                  />
                </div>
                <div>
                  <Label htmlFor="nextDueDate">Next Due Date</Label>
                  <Input
                    id="nextDueDate"
                    type="date"
                    value={formData.nextDueDate}
                    onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                    required
                    data-testid="emi-due-input"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="emi-submit-btn">Add EMI/Loan</Button>
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
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total Monthly EMI</p>
              <p className="text-3xl sm:text-4xl font-bold text-secondary mt-2 number">
                {formatCurrency(totalEMI)}
              </p>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg">
              <CreditCard className="w-8 h-8 text-secondary" />
            </div>
          </div>
        </div>

        {overdueEMIs.length > 0 && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-destructive font-medium uppercase tracking-wide">Overdue EMIs</p>
                <p className="text-3xl sm:text-4xl font-bold text-destructive mt-2">
                  {overdueEMIs.length}
                </p>
              </div>
              <div className="p-4 bg-destructive/20 rounded-lg">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search & Sort */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by loan name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="emi-search-input"
            />
          </div>
          <div className="flex gap-2">
            <div className="min-w-[180px]">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger data-testid="emi-sort-select">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="emiAmount">EMI Amount</SelectItem>
                  <SelectItem value="totalAmount">Total Amount</SelectItem>
                  <SelectItem value="interestRate">Interest Rate</SelectItem>
                  <SelectItem value="nextDueDate">Next Due Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSortOrder}
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              data-testid="emi-sort-order-btn"
            >
              <ArrowUpDown className={cn("w-4 h-4 transition-transform", sortOrder === 'desc' && 'rotate-180')} />
            </Button>
          </div>
        </div>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-3">
            {filteredAndSortedEMIs.length} result{filteredAndSortedEMIs.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
        )}
      </div>

      {/* EMIs List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAndSortedEMIs.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
            {searchQuery ? `No EMIs found matching "${searchQuery}".` : 'No EMIs or loans yet. Add one to get started!'}
          </div>
        ) : (
          filteredAndSortedEMIs.map((emi) => {
            const overdue = isOverdue(emi.nextDueDate);
            return (
              <div
                key={emi.id}
                className={cn(
                  "bg-card border rounded-lg p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
                  overdue ? 'border-destructive bg-destructive/5' : 'border-border'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{emi.name}</h3>
                    {overdue && (
                      <div className="flex items-center gap-2 mt-1">
                        <AlertCircle className="w-4 h-4 text-destructive" />
                        <span className="text-sm text-destructive font-medium">Overdue</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteEMI(emi.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors duration-200"
                    data-testid={`delete-emi-${emi.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-lg font-semibold number">{formatCurrency(emi.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Interest Rate</p>
                    <p className="text-lg font-semibold number">{emi.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tenure</p>
                    <p className="text-lg font-semibold">{emi.tenure} months</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">EMI Amount</p>
                    <p className="text-lg font-semibold text-secondary number">{formatCurrency(emi.emiAmount)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="text-sm font-medium">{formatDate(emi.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Next Due Date</p>
                    <p className={cn("text-sm font-medium", overdue && 'text-destructive')}>
                      {formatDate(emi.nextDueDate)}
                    </p>
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

export default EMIsPage;