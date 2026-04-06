import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  GraduationCap, 
  PiggyBank, 
  LineChart, 
  Plane, 
  Users, 
  Settings,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/income', icon: TrendingUp, label: 'Income' },
  { path: '/expenses', icon: TrendingDown, label: 'Expenses' },
  { path: '/emis', icon: CreditCard, label: 'EMIs & Loans' },
  { path: '/fees', icon: GraduationCap, label: 'Fees' },
  { path: '/savings', icon: PiggyBank, label: 'Savings' },
  { path: '/investments', icon: LineChart, label: 'Investments' },
  { path: '/trips', icon: Plane, label: 'Trips' },
  { path: '/admin', icon: Users, label: 'Admin' },
  { path: '/settings', icon: Settings, label: 'Settings' }
];

const Sidebar = ({ isOpen, onClose, currentUser }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-card border-r border-border z-50 transition-transform duration-200 ease-in-out",
          "w-64 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        data-testid="sidebar"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">Zorvyn Finance</h2>
            <p className="text-xs text-muted-foreground mt-1">{currentUser?.name || 'User'}</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors duration-200"
            data-testid="sidebar-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      "hover:bg-accent hover:-translate-y-0.5",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground"
                    )
                  }
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Role: <span className="font-semibold text-foreground">{currentUser?.role === 'admin' ? 'Admin' : 'User'}</span>
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;