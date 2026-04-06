import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const Header = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors duration-200"
          data-testid="mobile-menu-btn"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo for mobile */}
        <div className="lg:hidden">
          <h1 className="text-lg font-bold text-primary">FinanceHub</h1>
        </div>

        {/* Spacer for desktop */}
        <div className="hidden lg:block" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:-translate-y-0.5"
          data-testid="theme-toggle-btn"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;