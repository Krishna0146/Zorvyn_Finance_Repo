import { useState, useEffect } from 'react';
import storageService from '../services/storageService';

export const useTheme = () => {
  const [theme, setThemeState] = useState(storageService.getTheme());

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    storageService.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme, setTheme: setThemeState };
};

export default useTheme;