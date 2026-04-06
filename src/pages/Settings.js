import React, { useState, useEffect } from 'react';
import { Moon, Sun, Settings as SettingsIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useTheme from '../hooks/useTheme';
import storageService from '../services/storageService';
import { formatCurrency } from '../utils/helpers';

const EXPENSE_CATEGORIES = ['Food', 'Utilities', 'Transport', 'Health', 'Shopping', 'Entertainment'];

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [limits, setLimits] = useState({});

  useEffect(() => {
    setLimits(storageService.getExpenseLimits());
  }, []);

  const handleLimitChange = (category, value) => {
    const newLimits = { ...limits, [category]: parseFloat(value) || 0 };
    setLimits(newLimits);
    storageService.setExpenseLimits(newLimits);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      storageService.clearAll();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6" data-testid="settings-page">
      <PageHeader
        title="Settings"
        description="Manage your preferences"
      />

      {/* Theme Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Appearance</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Theme</p>
            <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
          </div>
          <Button
            onClick={toggleTheme}
            variant="outline"
            className="gap-2"
            data-testid="settings-theme-toggle"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4" />
                Dark Mode
              </>
            ) : (
              <>
                <Sun className="w-4 h-4" />
                Light Mode
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Expense Limits */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Expense Limits</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Set monthly spending limits for each category. You'll be notified when you exceed these limits.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXPENSE_CATEGORIES.map((category) => (
            <div key={category}>
              <Label htmlFor={category}>{category}</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">₹</span>
                <Input
                  id={category}
                  type="number"
                  value={limits[category] || ''}
                  onChange={(e) => handleLimitChange(category, e.target.value)}
                  placeholder="0"
                  data-testid={`limit-${category.toLowerCase()}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Data Management</h3>
        <p className="text-sm text-muted-foreground mb-4">
          All your data is stored locally in your browser's session storage. Clearing your browser data will remove all records.
        </p>
        <Button
          onClick={clearAllData}
          variant="destructive"
          data-testid="clear-data-btn"
        >
          Clear All Data
        </Button>
      </div>

      {/* About */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">About</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Storage:</strong> Session Storage (Frontend Only)</p>
          <p><strong>Features:</strong> Income, Expenses, EMIs, Fees, Savings, Investments, Trips, Admin Control</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;