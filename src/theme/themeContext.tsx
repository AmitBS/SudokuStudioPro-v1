import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccentColor, ThemeMode } from '../types/sudoku';

export interface AccentThemeDef {
  id: AccentColor;
  label: string;
  swatchHex: string;
  lightText: string;
  darkText: string;
  lightPrimary: string;
  darkPrimary: string;
  lightOnPrimary: string;
  darkOnPrimary: string;
  lightContainer: string;
  darkContainer: string;
  lightOnContainer: string;
  darkOnContainer: string;
  lightBorder: string;
  darkBorder: string;
}

export interface Material3Tokens {
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceContainer: string;
  surfaceContainerLow: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  outline: string;
  outlineVariant: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  // Sudoku Board specific tokens
  cellGiven: string;
  cellUser: string;
  cellNote: string;
  cellSelectedBg: string;
  cellSelectedRing: string;
  cellMatchBg: string;
  cellUnitBg: string;
  cellErrorBg: string;
  cellErrorText: string;
  gridBorderMajor: string;
  gridBorderMinor: string;
}

export const ACCENT_PALETTES: Record<AccentColor, AccentThemeDef> = {
  indigo: {
    id: 'indigo',
    label: 'Royal Indigo',
    swatchHex: '#3b82f6',
    lightText: '#1d4ed8', // 7.2:1 contrast on white
    darkText: '#93c5fd', // 8.5:1 contrast on dark surface
    lightPrimary: '#2563eb',
    darkPrimary: '#60a5fa',
    lightOnPrimary: '#ffffff',
    darkOnPrimary: '#090d16',
    lightContainer: '#eff6ff',
    darkContainer: 'rgba(59, 130, 246, 0.2)',
    lightOnContainer: '#1e40af',
    darkOnContainer: '#bfdbfe',
    lightBorder: '#3b82f6',
    darkBorder: '#60a5fa',
  },
  emerald: {
    id: 'emerald',
    label: 'Emerald Mint',
    swatchHex: '#10b981',
    lightText: '#047857', // 5.5:1 contrast on white
    darkText: '#6ee7b7', // 8.8:1 contrast on dark surface
    lightPrimary: '#047857',
    darkPrimary: '#34d399',
    lightOnPrimary: '#ffffff',
    darkOnPrimary: '#062817',
    lightContainer: '#ecfdf5',
    darkContainer: 'rgba(16, 185, 129, 0.2)',
    lightOnContainer: '#065f46',
    darkOnContainer: '#a7f3d0',
    lightBorder: '#047857',
    darkBorder: '#34d399',
  },
  amber: {
    id: 'amber',
    label: 'Sunset Amber',
    swatchHex: '#f59e0b',
    lightText: '#92400e', // 7.1:1 contrast on white
    darkText: '#fcd34d', // 9.9:1 contrast on dark surface
    lightPrimary: '#b45309',
    darkPrimary: '#fbbf24',
    lightOnPrimary: '#ffffff',
    darkOnPrimary: '#381c02',
    lightContainer: '#fffbeb',
    darkContainer: 'rgba(245, 158, 11, 0.2)',
    lightOnContainer: '#78350f',
    darkOnContainer: '#fde68a',
    lightBorder: '#b45309',
    darkBorder: '#fbbf24',
  },
  rose: {
    id: 'rose',
    label: 'Coral Rose',
    swatchHex: '#f43f5e',
    lightText: '#be123c', // 5.8:1 contrast on white
    darkText: '#fda4af', // 7.5:1 contrast on dark surface
    lightPrimary: '#e11d48',
    darkPrimary: '#fb7185',
    lightOnPrimary: '#ffffff',
    darkOnPrimary: '#370614',
    lightContainer: '#fff1f2',
    darkContainer: 'rgba(244, 63, 94, 0.2)',
    lightOnContainer: '#9f1239',
    darkOnContainer: '#fecdd3',
    lightBorder: '#e11d48',
    darkBorder: '#fb7185',
  },
  violet: {
    id: 'violet',
    label: 'Mystic Violet',
    swatchHex: '#8b5cf6',
    lightText: '#6d28d9', // 7.1:1 contrast on white
    darkText: '#c4b5fd', // 8.1:1 contrast on dark surface
    lightPrimary: '#7c3aed',
    darkPrimary: '#a78bfa',
    lightOnPrimary: '#ffffff',
    darkOnPrimary: '#200c43',
    lightContainer: '#f5f3ff',
    darkContainer: 'rgba(139, 92, 246, 0.2)',
    lightOnContainer: '#5b21b6',
    darkOnContainer: '#ddd6fe',
    lightBorder: '#7c3aed',
    darkBorder: '#a78bfa',
  },
  cyan: {
    id: 'cyan',
    label: 'Ocean Cyan',
    swatchHex: '#06b6d4',
    lightText: '#0e7490', // 5.4:1 contrast on white
    darkText: '#67e8f9', // 9.4:1 contrast on dark surface
    lightPrimary: '#0e7490',
    darkPrimary: '#22d3ee',
    lightOnPrimary: '#ffffff',
    darkOnPrimary: '#04222f',
    lightContainer: '#ecfeff',
    darkContainer: 'rgba(6, 182, 212, 0.2)',
    lightOnContainer: '#155e75',
    darkOnContainer: '#a5f3fc',
    lightBorder: '#0e7490',
    darkBorder: '#22d3ee',
  },
};

export function getMaterial3Tokens(isDark: boolean, accent: AccentColor): Material3Tokens {
  const pal = ACCENT_PALETTES[accent] || ACCENT_PALETTES.indigo;

  if (isDark) {
    return {
      background: '#090d16',
      onBackground: '#f8fafc',
      surface: '#111827',
      onSurface: '#f8fafc',
      surfaceVariant: '#1f2937',
      onSurfaceVariant: '#cbd5e1',
      surfaceContainer: '#161e2e',
      surfaceContainerLow: '#111827',
      surfaceContainerHigh: '#1f2937',
      surfaceContainerHighest: '#374151',
      primary: pal.darkPrimary,
      onPrimary: pal.darkOnPrimary,
      primaryContainer: pal.darkContainer,
      onPrimaryContainer: pal.darkOnContainer,
      secondary: '#94a3b8',
      onSecondary: '#0f172a',
      secondaryContainer: '#1e293b',
      onSecondaryContainer: '#e2e8f0',
      tertiary: '#cbd5e1',
      onTertiary: '#0f172a',
      outline: '#64748b',
      outlineVariant: '#334155',
      error: '#f87171',
      onError: '#450a0a',
      errorContainer: 'rgba(239, 68, 68, 0.2)',
      onErrorContainer: '#fecaca',
      cellGiven: '#f8fafc',
      cellUser: pal.darkText,
      cellNote: '#cbd5e1',
      cellSelectedBg: pal.darkContainer,
      cellSelectedRing: pal.darkPrimary,
      cellMatchBg: '#334155',
      cellUnitBg: 'rgba(30, 41, 59, 0.5)',
      cellErrorBg: 'rgba(239, 68, 68, 0.25)',
      cellErrorText: '#f87171',
      gridBorderMajor: '#f8fafc',
      gridBorderMinor: '#334155',
    };
  } else {
    return {
      background: '#f8fafc',
      onBackground: '#0f172a',
      surface: '#ffffff',
      onSurface: '#0f172a',
      surfaceVariant: '#f1f5f9',
      onSurfaceVariant: '#475569',
      surfaceContainer: '#ffffff',
      surfaceContainerLow: '#f8fafc',
      surfaceContainerHigh: '#f1f5f9',
      surfaceContainerHighest: '#e2e8f0',
      primary: pal.lightPrimary,
      onPrimary: pal.lightOnPrimary,
      primaryContainer: pal.lightContainer,
      onPrimaryContainer: pal.lightOnContainer,
      secondary: '#475569',
      onSecondary: '#ffffff',
      secondaryContainer: '#f1f5f9',
      onSecondaryContainer: '#1e293b',
      tertiary: '#334155',
      onTertiary: '#ffffff',
      outline: '#94a3b8',
      outlineVariant: '#e2e8f0',
      error: '#dc2626',
      onError: '#ffffff',
      errorContainer: '#fee2e2',
      onErrorContainer: '#991b1b',
      cellGiven: '#090d16',
      cellUser: pal.lightText,
      cellNote: '#475569',
      cellSelectedBg: pal.lightContainer,
      cellSelectedRing: pal.lightPrimary,
      cellMatchBg: '#e2e8f0',
      cellUnitBg: 'rgba(241, 245, 249, 0.8)',
      cellErrorBg: 'rgba(239, 68, 68, 0.15)',
      cellErrorText: '#dc2626',
      gridBorderMajor: '#0f172a',
      gridBorderMinor: '#cbd5e1',
    };
  }
}

// Injects Material 3 CSS variables into document.documentElement
export function injectMaterial3Variables(tokens: Material3Tokens) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.style.setProperty('--md-sys-color-background', tokens.background);
  root.style.setProperty('--md-sys-color-on-background', tokens.onBackground);
  root.style.setProperty('--md-sys-color-surface', tokens.surface);
  root.style.setProperty('--md-sys-color-on-surface', tokens.onSurface);
  root.style.setProperty('--md-sys-color-surface-variant', tokens.surfaceVariant);
  root.style.setProperty('--md-sys-color-on-surface-variant', tokens.onSurfaceVariant);
  root.style.setProperty('--md-sys-color-surface-container', tokens.surfaceContainer);
  root.style.setProperty('--md-sys-color-surface-container-low', tokens.surfaceContainerLow);
  root.style.setProperty('--md-sys-color-surface-container-high', tokens.surfaceContainerHigh);
  root.style.setProperty('--md-sys-color-surface-container-highest', tokens.surfaceContainerHighest);
  root.style.setProperty('--md-sys-color-primary', tokens.primary);
  root.style.setProperty('--md-sys-color-on-primary', tokens.onPrimary);
  root.style.setProperty('--md-sys-color-primary-container', tokens.primaryContainer);
  root.style.setProperty('--md-sys-color-on-primary-container', tokens.onPrimaryContainer);
  root.style.setProperty('--md-sys-color-secondary', tokens.secondary);
  root.style.setProperty('--md-sys-color-on-secondary', tokens.onSecondary);
  root.style.setProperty('--md-sys-color-secondary-container', tokens.secondaryContainer);
  root.style.setProperty('--md-sys-color-on-secondary-container', tokens.onSecondaryContainer);
  root.style.setProperty('--md-sys-color-tertiary', tokens.tertiary);
  root.style.setProperty('--md-sys-color-on-tertiary', tokens.onTertiary);
  root.style.setProperty('--md-sys-color-outline', tokens.outline);
  root.style.setProperty('--md-sys-color-outline-variant', tokens.outlineVariant);
  root.style.setProperty('--md-sys-color-error', tokens.error);
  root.style.setProperty('--md-sys-color-on-error', tokens.onError);
  root.style.setProperty('--md-sys-color-error-container', tokens.errorContainer);
  root.style.setProperty('--md-sys-color-on-error-container', tokens.onErrorContainer);
  root.style.setProperty('--md-sys-color-cell-given', tokens.cellGiven);
  root.style.setProperty('--md-sys-color-cell-user', tokens.cellUser);
  root.style.setProperty('--md-sys-color-cell-note', tokens.cellNote);
  root.style.setProperty('--md-sys-color-cell-selected-bg', tokens.cellSelectedBg);
  root.style.setProperty('--md-sys-color-cell-selected-ring', tokens.cellSelectedRing);
  root.style.setProperty('--md-sys-color-cell-match-bg', tokens.cellMatchBg);
  root.style.setProperty('--md-sys-color-cell-unit-bg', tokens.cellUnitBg);
  root.style.setProperty('--md-sys-color-cell-error-bg', tokens.cellErrorBg);
  root.style.setProperty('--md-sys-color-cell-error-text', tokens.cellErrorText);
  root.style.setProperty('--md-sys-color-grid-border-major', tokens.gridBorderMajor);
  root.style.setProperty('--md-sys-color-grid-border-minor', tokens.gridBorderMinor);
}

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  accentColor: AccentColor;
  setAccentColor: (accent: AccentColor) => void;
  accentDef: AccentThemeDef;
  tokens: Material3Tokens;
  // Helper getters for active colors
  activePrimary: string;
  activeOnPrimary: string;
  activeAccentText: string;
  activeContainer: string;
  activeBorder: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('sudoku_theme_mode');
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    } catch {
      // localStorage may fail
    }
    return 'system';
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem('sudoku_accent_color');
      if (saved && saved in ACCENT_PALETTES) return saved as AccentColor;
    } catch {
      // localStorage may fail
    }
    return 'indigo';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const isDark = themeMode === 'system' ? systemIsDark : themeMode === 'dark';
  const tokens = getMaterial3Tokens(isDark, accentColor);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    // Inject all Material 3 CSS variables
    injectMaterial3Variables(tokens);
  }, [isDark, tokens]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('sudoku_theme_mode', mode);
    } catch {
      // Ignore
    }
  };

  const setAccentColor = (accent: AccentColor) => {
    setAccentColorState(accent);
    try {
      localStorage.setItem('sudoku_accent_color', accent);
    } catch {
      // Ignore
    }
  };

  const accentDef = ACCENT_PALETTES[accentColor] || ACCENT_PALETTES.indigo;

  const activePrimary = tokens.primary;
  const activeOnPrimary = tokens.onPrimary;
  const activeAccentText = tokens.cellUser;
  const activeContainer = tokens.primaryContainer;
  const activeBorder = isDark ? accentDef.darkBorder : accentDef.lightBorder;

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        isDark,
        accentColor,
        setAccentColor,
        accentDef,
        tokens,
        activePrimary,
        activeOnPrimary,
        activeAccentText,
        activeContainer,
        activeBorder,
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
