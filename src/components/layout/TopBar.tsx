import React from 'react';
import { Screen } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { Settings, Sun, Moon, ShieldCheck, BarChart2 } from 'lucide-react';

interface TopBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onOpenContrastAudit: () => void;
  onOpenInstallApp?: () => void;
  hasActiveGame: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentScreen,
  onNavigate,
  onOpenContrastAudit,
  hasActiveGame,
}) => {
  const { isDark, setThemeMode, themeMode, activePrimary, activeOnPrimary } = useTheme();

  const toggleTheme = () => {
    if (themeMode === 'system') {
      setThemeMode(isDark ? 'light' : 'dark');
    } else if (themeMode === 'light') {
      setThemeMode('dark');
    } else {
      setThemeMode('light');
    }
  };

  const navItems: { screen: Screen; label: string; visible?: boolean }[] = [
    { screen: 'home', label: 'Home' },
    { screen: 'game', label: 'Current Game', visible: hasActiveGame },
    { screen: 'daily', label: 'Daily' },
    { screen: 'capture', label: 'Capture' },
    { screen: 'history', label: 'Saved & History' },
    { screen: 'stats', label: 'Statistics' },
  ];

  return (
    <header
      className="sticky top-0 z-30 w-full border-b backdrop-blur-md transition-colors"
      style={{
        backgroundColor: 'var(--md-sys-color-surface)',
        borderColor: 'var(--md-sys-color-outline-variant)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Zone 1: Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <img
            src="/pwa-192x192.png"
            alt="Sudoku Studio Pro"
            className="w-8 h-8 rounded-lg shadow-xs object-cover transition-transform group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <span
            className="font-extrabold text-base tracking-tight transition-colors"
            style={{ color: 'var(--md-sys-color-on-surface)' }}
          >
            Sudoku Studio Pro
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.filter(item => item.visible !== false).map(item => {
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => onNavigate(item.screen)}
                style={{
                  backgroundColor: isActive
                    ? 'var(--md-sys-color-surface-container-high)'
                    : 'transparent',
                  color: isActive
                    ? 'var(--md-sys-color-on-surface)'
                    : 'var(--md-sys-color-on-surface-variant)',
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors hover:opacity-85"
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Contrast Auditor Trigger */}
          <button
            type="button"
            onClick={onOpenContrastAudit}
            title="WCAG 2.2 AA Contrast Auditor"
            aria-label="WCAG 2.2 AA Contrast Auditor"
            className="p-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ color: 'var(--md-sys-color-on-surface)' }}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </button>

          {/* Theme Quick Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={`Toggle Theme (Current: ${themeMode})`}
            aria-label={`Toggle Theme (Current: ${themeMode})`}
            className="p-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ color: 'var(--md-sys-color-on-surface)' }}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Stats Button (mobile) */}
          <button
            type="button"
            onClick={() => onNavigate('stats')}
            title="Statistics"
            aria-label="Statistics"
            className="md:hidden p-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ color: 'var(--md-sys-color-on-surface)' }}
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Settings Icon */}
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            title="Settings"
            aria-label="Settings"
            style={{
              backgroundColor: currentScreen === 'settings'
                ? 'var(--md-sys-color-surface-container-high)'
                : 'transparent',
              color: 'var(--md-sys-color-on-surface)',
            }}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
