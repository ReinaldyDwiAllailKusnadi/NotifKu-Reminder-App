import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { storageService } from '../services/storageService';

export interface ThemeColors {
  dark: boolean;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  accent: string;
  border: string;
  success: string;
  danger: string;
  warning: string;
}

export const lightTheme: ThemeColors = {
  dark: false,
  background: '#F8FAFC', // Slate 50
  card: '#FFFFFF',
  text: '#0F172A', // Slate 900
  textSecondary: '#64748B', // Slate 500
  primary: '#4F46E5', // Indigo 600
  accent: '#EC4899', // Pink 500
  border: '#E2E8F0', // Slate 200
  success: '#10B981', // Emerald 500
  danger: '#EF4444', // Red 500
  warning: '#F59E0B', // Amber 500
};

export const darkTheme: ThemeColors = {
  dark: true,
  background: '#0F172A', // Slate 900
  card: '#1E293B', // Slate 800
  text: '#F8FAFC', // Slate 50
  textSecondary: '#94A3B8', // Slate 400
  primary: '#6366F1', // Indigo 500
  accent: '#F472B6', // Pink 400
  border: '#334155', // Slate 700
  success: '#34D399', // Emerald 400
  danger: '#F87171', // Red 400
  warning: '#FBBF24', // Amber 400
};

interface ThemeContextType {
  isDark: boolean;
  theme: ThemeColors;
  toggleTheme: () => void;
  isLoadingTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(systemColorScheme === 'dark');
  const [isLoadingTheme, setIsLoadingTheme] = useState<boolean>(true);

  // Load theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await storageService.getThemePreference();
        if (storedTheme) {
          setIsDark(storedTheme === 'dark');
        } else {
          setIsDark(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoadingTheme(false);
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  const toggleTheme = async () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);
    await storageService.setThemePreference(newDarkState ? 'dark' : 'light');
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme, isLoadingTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
