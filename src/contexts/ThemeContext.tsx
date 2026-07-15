import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark';
type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Get system theme preference
function getSystemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // Default to dark
}

// Resolve theme based on preference
function resolveTheme(preference: ThemePreference): Theme {
  if (preference === 'system') {
    return getSystemTheme();
  }
  return preference;
}

// Persist theme preference
function persistThemePreference(preference: ThemePreference) {
  localStorage.setItem('walaspro_theme', preference);
}

// Get persisted theme preference
function getPersistedThemePreference(): ThemePreference {
  const stored = localStorage.getItem('walaspro_theme');
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system'; // Default
}

// Apply theme to document
function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}

// Theme Provider Component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(getPersistedThemePreference);
  const [theme, setTheme] = useState<Theme>(() => resolveTheme(getPersistedThemePreference()));

  // Initialize theme on mount
  useEffect(() => {
    const resolved = resolveTheme(themePreference);
    setTheme(resolved);
    applyTheme(resolved);
  }, [themePreference]);

  // Listen for system theme changes
  useEffect(() => {
    if (themePreference !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      applyTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themePreference]);

  const setThemePreference = useCallback((preference: ThemePreference) => {
    setThemePreferenceState(preference);
    persistThemePreference(preference);

    const resolved = resolveTheme(preference);
    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setThemePreference(newTheme);
  }, [theme, setThemePreference]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themePreference,
        setThemePreference,
        toggleTheme,
        isDark: theme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Custom Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback for outside provider
    return {
      theme: 'dark' as Theme,
      themePreference: 'system' as ThemePreference,
      setThemePreference: () => {},
      toggleTheme: () => {},
      isDark: true,
    };
  }
  return context;
}

// Theme Toggle Button Component
interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ThemeToggle({
  className = '',
  size = 'md',
  showLabel = false
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center gap-2 rounded-xl transition
        bg-slate-700/50 hover:bg-slate-600
        text-slate-300 hover:text-white
        ${sizeClasses[size]} ${className}
      `}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className={iconSizes[size]} />
      ) : (
        <Moon className={iconSizes[size]} />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}

// Theme Selector Dropdown Component
interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className = '' }: ThemeSelectorProps) {
  const { themePreference, setThemePreference } = useTheme();

  const options = [
    { value: 'light' as ThemePreference, label: 'Light', icon: Sun },
    { value: 'dark' as ThemePreference, label: 'Dark', icon: Moon },
    { value: 'system' as ThemePreference, label: 'System', icon: Monitor },
  ];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setThemePreference(value)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition
            ${themePreference === value
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600 hover:text-white'
            }
          `}
          title={`${label} Mode`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

// Light Theme CSS Variables (for Tailwind config)
export const lightThemeColors = {
  background: '255 255 255',
  foreground: '15 23 42',
  primary: '16 185 129',
  primaryForeground: '255 255 255',
  secondary: '71 85 105',
  secondaryForeground: '255 255 255',
  muted: '241 245 249',
  mutedForeground: '100 116 139',
  accent: '16 185 129',
  accentForeground: '255 255 255',
  destructive: '239 68 68',
  destructiveForeground: '255 255 255',
  border: '226 232 240',
  input: '226 232 240',
  ring: '16 185 129',
  card: '255 255 255',
  cardForeground: '15 23 42',
  popover: '255 255 255',
  popoverForeground: '15 23 42',
};

// Dark Theme CSS Variables (default - already applied)
export const darkThemeColors = {
  background: '15 23 42',
  foreground: '248 250 252',
  primary: '16 185 129',
  primaryForeground: '255 255 255',
  secondary: '71 85 105',
  secondaryForeground: '255 255 255',
  muted: '30 41 59',
  mutedForeground: '148 163 184',
  accent: '16 185 129',
  accentForeground: '255 255 255',
  destructive: '239 68 68',
  destructiveForeground: '255 255 255',
  border: '51 65 85',
  input: '51 65 85',
  ring: '16 185 129',
  card: '30 41 59',
  cardForeground: '248 250 252',
  popover: '30 41 59',
  popoverForeground: '248 250 252',
};

// CSS to be injected for theming
export const themeStyles = `
  /* Light mode overrides */
  .light {
    --background: ${lightThemeColors.background};
    --foreground: ${lightThemeColors.foreground};
    --primary: ${lightThemeColors.primary};
    --primary-foreground: ${lightThemeColors.primaryForeground};
    --secondary: ${lightThemeColors.secondary};
    --secondary-foreground: ${lightThemeColors.secondaryForeground};
    --muted: ${lightThemeColors.muted};
    --muted-foreground: ${lightThemeColors.mutedForeground};
    --accent: ${lightThemeColors.accent};
    --accent-foreground: ${lightThemeColors.accentForeground};
    --destructive: ${lightThemeColors.destructive};
    --destructive-foreground: ${lightThemeColors.destructiveForeground};
    --border: ${lightThemeColors.border};
    --input: ${lightThemeColors.input};
    --ring: ${lightThemeColors.ring};
    --card: ${lightThemeColors.card};
    --card-foreground: ${lightThemeColors.cardForeground};
    --popover: ${lightThemeColors.popover};
    --popover-foreground: ${lightThemeColors.popoverForeground};
  }

  /* Dark mode (default) */
  .dark {
    --background: ${darkThemeColors.background};
    --foreground: ${darkThemeColors.foreground};
    --primary: ${darkThemeColors.primary};
    --primary-foreground: ${darkThemeColors.primaryForeground};
    --secondary: ${darkThemeColors.secondary};
    --secondary-foreground: ${darkThemeColors.secondaryForeground};
    --muted: ${darkThemeColors.muted};
    --muted-foreground: ${darkThemeColors.mutedForeground};
    --accent: ${darkThemeColors.accent};
    --accent-foreground: ${darkThemeColors.accentForeground};
    --destructive: ${darkThemeColors.destructive};
    --destructive-foreground: ${darkThemeColors.destructiveForeground};
    --border: ${darkThemeColors.border};
    --input: ${darkThemeColors.input};
    --ring: ${darkThemeColors.ring};
    --card: ${darkThemeColors.card};
    --card-foreground: ${darkThemeColors.cardForeground};
    --popover: ${darkThemeColors.popover};
    --popover-foreground: ${darkThemeColors.popoverForeground};
  }
`;
