import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    accent: string;
  };
  fonts: {
    regular: string;
    medium: string;
    bold: string;
    sizes: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      xxl: number;
      xxxl: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  accessibility: {
    minTouchTarget: number;
    highContrast: boolean;
    fontSizeScale: number;
  };
}

const lightTheme: Theme = {
  colors: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    error: '#dc2626',
    success: '#16a34a',
    warning: '#d97706',
    accent: '#f59e0b',
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  accessibility: {
    minTouchTarget: 48,
    highContrast: false,
    fontSizeScale: 1.0,
  },
};

const highContrastTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#000000',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#cccccc',
    border: '#666666',
    primary: '#60a5fa',
    secondary: '#a78bfa',
  },
  accessibility: {
    ...lightTheme.accessibility,
    highContrast: true,
  },
};

interface ThemeContextType {
  theme: Theme;
  isHighContrast: boolean;
  fontSizeScale: number;
  toggleHighContrast: () => void;
  setFontSizeScale: (scale: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemColorScheme = useColorScheme();
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState(1.0);

  const theme: Theme = {
    ...(isHighContrast ? highContrastTheme : lightTheme),
    fonts: {
      ...lightTheme.fonts,
      sizes: Object.fromEntries(
        Object.entries(lightTheme.fonts.sizes).map(([key, value]) => [
          key,
          value * fontSizeScale,
        ])
      ) as Theme['fonts']['sizes'],
    },
    accessibility: {
      ...lightTheme.accessibility,
      highContrast: isHighContrast,
      fontSizeScale,
    },
  };

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isHighContrast,
        fontSizeScale,
        toggleHighContrast,
        setFontSizeScale,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
