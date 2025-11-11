'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let initialTheme: Theme = 'light';

    try {
      // Load theme from localStorage
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        initialTheme = savedTheme;
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        initialTheme = prefersDark ? 'dark' : 'light';
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      // Fallback to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark ? 'dark' : 'light';
    }

    // Apply initial theme immediately
    const root = document.documentElement;
    console.log('Applying initial theme:', initialTheme);
    root.classList.remove('light', 'dark');
    if (initialTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
    console.log('Initial HTML classes:', root.className);

    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Apply theme to document
    const root = document.documentElement;
    console.log('Applying theme:', theme);
    root.classList.remove('light', 'dark');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
    console.log('HTML classes:', root.className);
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    console.log('Toggling theme from:', theme);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('Setting new theme:', newTheme);
    
    // Immediately update the DOM
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    console.log('Applied classes to HTML:', root.className);
    
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}