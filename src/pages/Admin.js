import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, User } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '../utils/helpers';
import storageService from '../services/storageService';
import { cn } from '@/lib/utils';

const AdminPage = () => {
  const [currentUser, setCurrentUser] = useState(storageService.getCurrentUser());
  const [users, setUsers] = useState(storageService.getUsers());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      limits: {
        Food: 3000,
        Shopping: 2000,
        Entertainment: 1500
      }
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    storageService.setUsers(updatedUsers);
    setFormData({ name: '', email: '', role: 'user' });
    setIsDialogOpen(false);
  };

  const switchToUser = (user) => {
    storageService.setCurrentUser(user);
    setCurrentUser(user);
  };

  const toggleRole = () => {
    const newRole = currentUser.role === 'admin' ? 'user' : 'admin';
    const adminUser = users.find(u => u.role === 'admin');
    const updatedUser = { ...currentUser, role: newRole };
    
    if (newRole === 'admin' && adminUser) {
      switchToUser(adminUser);
    } else {
      storageService.setCurrentUser(updatedUser);
      setCurrentUser(updatedUser);
    }
  };

  // Calculate user stats (mock data for child users)
  const getUserStats = (user) => {
    if (user.role === 'admin') {
      return { income: 105500, expenses: 26397, savings: 325000 };
    }
    return { income: 2000, expenses: 1500, savings: 5000 };
  };

  return (
    <div className="space-y-6" data-testid="admin-page">
      <PageHeader
        title="Admin Control"
        description="Manage users and permissions"
        action={
          <div className="flex gap-2">
            <Button
              onClick={toggleRole}
              variant="outline"
              className="gap-2"
              data-testid="toggle-role-btn"
            >
              {currentUser.role === 'admin' ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
              {currentUser.role === 'admin' ? 'Switch to User' : 'Switch to Admin'}
            </Button>
            {currentUser.role === 'admin' && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" data-testid="add-user-btn">
                    <UserPlus className="w-4 h-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="user-dialog">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        data-testid="user-name-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        data-testid="user-email-input"
                      />
                    </div>
                    <Button type="submit" className="w-full" data-testid="user-submit-btn">Add User</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        }
      />

      {/* Current User Card */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/20 rounded-full">
            {currentUser.role === 'admin' ? (
              <Shield className="w-8 h-8 text-primary" />
            ) : (
              <User className="w-8 h-8 text-primary" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{currentUser.name}</h3>
            <p className="text-sm text-muted-foreground">{currentUser.email || 'No email'}</p>
            <span className={cn(
              "inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold",
              currentUser.role === 'admin'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            )}>
              {currentUser.role === 'admin' ? 'Admin' : 'User'}
            </span>
          </div>
        </div>
      </div>

      {/* Users List (Admin Only) */}
      {currentUser.role === 'admin' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Managed Users</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => {
              const stats = getUserStats(user);
              return (
                <div
                  key={user.id}
                  className="bg-card border border-border rounded-lg p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-muted rounded-full">
                        {user.role === 'admin' ? (
                          <Shield className="w-6 h-6" />
                        ) : (
                          <User className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{user.name}</h4>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      user.role === 'admin'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary/10 text-secondary'
                    )}>
                      {user.role}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Income</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 number">
                        {formatCurrency(stats.income)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expenses</span>
                      <span className="font-semibold text-red-600 dark:text-red-400 number">
                        {formatCurrency(stats.expenses)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Savings</span>
                      <span className="font-semibold number">{formatCurrency(stats.savings)}</span>
                    </div>
                  </div>

                  {user.limits && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Spending Limits</p>
                      <div className="space-y-1">
                        {Object.entries(user.limits).map(([category, limit]) => (
                          <div key={category} className="flex justify-between text-xs">
                            <span>{category}</span>
                            <span className="number">{formatCurrency(limit)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.id !== currentUser.id && (
                    <Button
                      onClick={() => switchToUser(user)}
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      data-testid={`switch-to-${user.id}`}
                    >
                      Switch to this user
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* User View (Non-Admin) */}
      {currentUser.role === 'user' && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Your Limits</h3>
          {currentUser.limits ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(currentUser.limits).map(([category, limit]) => (
                <div key={category} className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{category}</p>
                  <p className="text-2xl font-bold mt-1 number">{formatCurrency(limit)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No limits set for your account.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;