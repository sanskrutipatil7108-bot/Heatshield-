import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';
export type TempUnit = 'C' | 'F';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  unit: TempUnit;
  setUnit: (u: TempUnit) => void;
  alertThreshold: number;
  setAlertThreshold: (threshold: number) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  formatTemp: (celsius: number) => string;
  convertTemp: (celsius: number) => number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('heatshield_theme') as ThemeMode;
    if (saved === 'dark' || saved === 'light' || saved === 'high-contrast') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [unit, setUnitState] = useState<TempUnit>(() => {
    const saved = localStorage.getItem('heatshield_temp_unit');
    return saved === 'F' ? 'F' : 'C';
  });

  const [alertThreshold, setAlertThresholdState] = useState<number>(() => {
    const saved = localStorage.getItem('heatshield_alert_threshold');
    return saved ? parseInt(saved, 10) : 75;
  });

  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('heatshield_notifications');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'high-contrast');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'high-contrast') {
      root.classList.add('dark', 'high-contrast');
    }

    localStorage.setItem('heatshield_theme', theme);
  }, [theme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'high-contrast';
      return 'light';
    });
  };

  const setUnit = (u: TempUnit) => {
    setUnitState(u);
    localStorage.setItem('heatshield_temp_unit', u);
  };

  const setAlertThreshold = (threshold: number) => {
    setAlertThresholdState(threshold);
    localStorage.setItem('heatshield_alert_threshold', threshold.toString());
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    localStorage.setItem('heatshield_notifications', enabled.toString());
  };

  const convertTemp = (celsius: number): number => {
    if (unit === 'F') {
      return Math.round(((celsius * 9) / 5 + 32) * 10) / 10;
    }
    return Math.round(celsius * 10) / 10;
  };

  const formatTemp = (celsius: number): string => {
    const val = convertTemp(celsius);
    return `${val}°${unit}`;
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        unit,
        setUnit,
        alertThreshold,
        setAlertThreshold,
        notificationsEnabled,
        setNotificationsEnabled,
        formatTemp,
        convertTemp,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
