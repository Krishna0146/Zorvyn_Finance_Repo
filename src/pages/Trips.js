import React, { useState } from 'react';
import { Plus, Trash2, Plane, Users as UsersIcon, User } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTrips } from '../hooks/useFinanceData';
import { formatCurrency, formatDate } from '../utils/helpers';
import storageService from '../services/storageService';
import { cn } from '@/lib/utils';

const TripsPage = () => {
  const { trips, addTrip, deleteTrip, addTripExpense } = useTrips();
  const [isTripDialogOpen, setIsTripDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripFormData, setTripFormData] = useState({
    name: '',
    type: 'Individual',
    startDate: '',
    endDate: ''
  });
  const [expenseFormData, setExpenseFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    paidBy: 'Self'
  });

  const currentUser = storageService.getCurrentUser();

  const handleTripSubmit = (e) => {
    e.preventDefault();
    addTrip({
      ...tripFormData,
      userId: currentUser.id
    });
    setTripFormData({ name: '', type: 'Individual', startDate: '', endDate: '' });
    setIsTripDialogOpen(false);
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    addTripExpense(selectedTrip.id, {
      ...expenseFormData,
      amount: parseFloat(expenseFormData.amount)
    });
    setExpenseFormData({ description: '', amount: '', category: 'Food', paidBy: 'Self' });
    setIsExpenseDialogOpen(false);
  };

  return (
    <div className="space-y-6" data-testid="trips-page">
      <PageHeader
        title="Trips"
        description="Track your travel expenses"
        action={
          <Dialog open={isTripDialogOpen} onOpenChange={setIsTripDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="add-trip-btn">
                <Plus className="w-4 h-4" />
                Add Trip
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="trip-dialog">
              <DialogHeader>
                <DialogTitle>Add Trip</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleTripSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Trip Name</Label>
                  <Input
                    id="name"
                    value={tripFormData.name}
                    onChange={(e) => setTripFormData({ ...tripFormData, name: e.target.value })}
                    required
                    data-testid="trip-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={tripFormData.type} onValueChange={(value) => setTripFormData({ ...tripFormData, type: value })}>
                    <SelectTrigger data-testid="trip-type-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={tripFormData.startDate}
                    onChange={(e) => setTripFormData({ ...tripFormData, startDate: e.target.value })}
                    required
                    data-testid="trip-start-input"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={tripFormData.endDate}
                    onChange={(e) => setTripFormData({ ...tripFormData, endDate: e.target.value })}
                    required
                    data-testid="trip-end-input"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="trip-submit-btn">Add Trip</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Trips List */}
      <div className="grid grid-cols-1 gap-6">
        {trips.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
            No trips yet. Add one to get started!
          </div>
        ) : (
          trips.map((trip) => {
            const totalExpense = trip.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

            return (
              <div
                key={trip.id}
                className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg"
              >
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/20 rounded-lg">
                        <Plane className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{trip.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-card rounded text-xs font-medium">
                            {trip.type === 'Individual' ? <User className="w-3 h-3" /> : <UsersIcon className="w-3 h-3" />}
                            {trip.type}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedTrip(trip);
                          setIsExpenseDialogOpen(true);
                        }}
                        data-testid={`add-trip-expense-${trip.id}`}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Expense
                      </Button>
                      <button
                        onClick={() => deleteTrip(trip.id)}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors duration-200"
                        data-testid={`delete-trip-${trip.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Expense</span>
                      <span className="text-3xl font-bold text-secondary number">{formatCurrency(totalExpense)}</span>
                    </div>
                  </div>
                </div>

                {/* Expenses */}
                {trip.expenses && trip.expenses.length > 0 && (
                  <div className="p-6">
                    <h4 className="font-semibold mb-4">Expenses</h4>
                    <div className="space-y-3">
                      {trip.expenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{expense.category}</span>
                              <span className="text-xs">•</span>
                              <span className="text-xs text-muted-foreground">Paid by: {expense.paidBy}</span>
                            </div>
                          </div>
                          <span className="text-lg font-semibold number">{formatCurrency(expense.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent data-testid="trip-expense-dialog">
          <DialogHeader>
            <DialogTitle>Add Trip Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={expenseFormData.description}
                onChange={(e) => setExpenseFormData({ ...expenseFormData, description: e.target.value })}
                required
                data-testid="trip-expense-desc-input"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={expenseFormData.amount}
                onChange={(e) => setExpenseFormData({ ...expenseFormData, amount: e.target.value })}
                required
                data-testid="trip-expense-amount-input"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={expenseFormData.category} onValueChange={(value) => setExpenseFormData({ ...expenseFormData, category: value })}>
                <SelectTrigger data-testid="trip-expense-category-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Accommodation">Accommodation</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paidBy">Paid By</Label>
              <Input
                id="paidBy"
                value={expenseFormData.paidBy}
                onChange={(e) => setExpenseFormData({ ...expenseFormData, paidBy: e.target.value })}
                required
                data-testid="trip-expense-paidby-input"
              />
            </div>
            <Button type="submit" className="w-full" data-testid="trip-expense-submit-btn">Add Expense</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TripsPage;