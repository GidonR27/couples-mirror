import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';

export type ThemeColor = 'blue' | 'green' | 'orange' | 'violet' | 'gold' | 'default';

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  themeColors: Record<ThemeColor, string[]>;
}

const THEME_COLORS: Record<ThemeColor, string[]> = {
  default: ['#000000', '#1a1a1a', '#000000'],
  blue: ['#001f3f', '#003366', '#001f3f'], // Truth - Deep Blue
  green: ['#0f2f1a', '#1a4025', '#0f2f1a'], // Flourishing - Green/Gold hints
  orange: ['#331a00', '#4d2600', '#331a00'], // Feedback - Warm/Orange
  violet: ['#1a0f2f', '#2d1a4d', '#1a0f2f'], // Distributed - Violet
  gold: ['#2b2200', '#403300', '#2b2200'], // Temporal - Gold/Sepia
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeColor>('default');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeColors: THEME_COLORS }}>
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

