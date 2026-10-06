import React from 'react';
import { GameSettings, HintsMode, MistakesMode, Screen, ThemeMode } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { MaterialSwitch } from '../common/MaterialSwitch';
import { SegmentedControl } from '../common/SegmentedControl';
import { AccentSwatchPicker } from '../common/AccentSwatchPicker';
import { ArrowLeft, Monitor, Sun, Moon, Volume2, ShieldCheck, Gamepad2, Palette, Smartphone, Download } from 'lucide-react';

interface SettingsScreenProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onNavigate: (screen: Screen) => void;
  onOpenContrastAudit: () => void;
  onOpenInstallApp?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onNavigate,
  onOpenContrastAudit,
  onOpenInstallApp,
}) => {
  const { themeMode, setThemeMode, accentColor, setAccentColor } = useTheme();

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    onUpdateSettings({ themeMode: mode });
  };

  const handleAccentChange = (accent: typeof accentColor) => {
    setAccentColor(accent);
    onUpdateSettings({ accentColor: accent });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-in fade-in duration-150">
      {/* Screen Header */}
      <div
        className="flex items-center gap-3 pb-3 border-b"
        style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
      >
        <button
          type="button"
          onClick={() => onNavigate('home')}
          aria-label="Back to Home"
          style={{ color: 'var(--md-sys-color-on-background)' }}
          className="p-2 -ml-2 rounded-xl hover:opacity-75 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: 'var(--md-sys-color-on-background)' }}
          >
            Settings
          </h1>
          <p
            className="text-xs sm:text-sm font-medium mt-0.5"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Configure gameplay mechanics, display theme, and audio preferences.
          </p>
        </div>
      </div>

      {/* SECTION 1: Gameplay */}
      <section className="space-y-4">
        <div
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Gameplay</span>
        </div>

        <div
          className="p-4 sm:p-5 rounded-2xl border shadow-xs divide-y divide-m3-outline-variant"
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
        >
          {/* Auto notes */}
          <MaterialSwitch
            id="setting-auto-notes"
            label="Auto notes"
            description="Automatically calculate and display pencil marks in empty cells."
            checked={settings.autoNotes}
            onChange={val => onUpdateSettings({ autoNotes: val })}
          />

          {/* Highlight same numbers */}
          <MaterialSwitch
            id="setting-highlight-same"
            label="Highlight same numbers"
            description="Highlight all instances of the selected number across the board."
            checked={settings.highlightSameNumbers}
            onChange={val => onUpdateSettings({ highlightSameNumbers: val })}
          />

          {/* Highlight row, column and block */}
          <MaterialSwitch
            id="setting-highlight-rcb"
            label="Highlight row, column and block"
            description="Show a crosshair highlight along the active row, column, and 3x3 block."
            checked={settings.highlightRowColBlock}
            onChange={val => onUpdateSettings({ highlightRowColBlock: val })}
          />

          {/* Mistakes mode */}
          <div className="py-4 space-y-2">
            <div
              className="text-base font-semibold"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              Mistakes
            </div>
            <div
              className="text-sm"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Choose how incorrect number placements are handled.
            </div>
            <div className="pt-2">
              <SegmentedControl<MistakesMode>
                options={[
                  { value: 'three', label: '3 Limit' },
                  { value: 'unlimited', label: 'Unlimited' },
                  { value: 'off', label: 'Off' },
                ]}
                value={settings.mistakesMode}
                onChange={val => onUpdateSettings({ mistakesMode: val })}
                ariaLabel="Mistakes Mode"
              />
            </div>
          </div>

          {/* Auto advance */}
          <MaterialSwitch
            id="setting-auto-advance"
            label="Auto advance"
            description="Automatically move cursor to the next empty cell after placing a digit."
            checked={settings.autoAdvance}
            onChange={val => onUpdateSettings({ autoAdvance: val })}
          />

          {/* Hints mode */}
          <div className="py-4 space-y-2">
            <div
              className="text-base font-semibold"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              Hints
            </div>
            <div
              className="text-sm"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Select between logical step-by-step reasoning or direct answer reveal.
            </div>
            <div className="pt-2">
              <SegmentedControl<HintsMode>
                options={[
                  { value: 'logic', label: 'Logic Tutor' },
                  { value: 'direct', label: 'Direct Reveal' },
                ]}
                value={settings.hintsMode}
                onChange={val => onUpdateSettings({ hintsMode: val })}
                ariaLabel="Hints Mode"
              />
            </div>
          </div>

          {/* Confirm new game */}
          <MaterialSwitch
            id="setting-confirm-new-game"
            label="Confirm new game"
            description="Require a confirmation prompt before abandoning an active puzzle."
            checked={settings.confirmNewGame}
            onChange={val => onUpdateSettings({ confirmNewGame: val })}
          />
        </div>
      </section>

      {/* SECTION 2: Appearance */}
      <section className="space-y-4">
        <div
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
        >
          <Palette className="w-4 h-4" />
          <span>Appearance</span>
        </div>

        <div
          className="p-4 sm:p-5 rounded-2xl border shadow-xs space-y-6"
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
        >
          {/* Theme selector */}
          <div className="space-y-2.5">
            <label
              className="block text-base font-semibold"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              Theme
            </label>
            <div
              className="text-sm"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Select your preferred appearance mode or sync with system preferences.
            </div>
            <div className="pt-1">
              <SegmentedControl<ThemeMode>
                options={[
                  { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
                  { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
                  { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
                ]}
                value={themeMode}
                onChange={handleThemeChange}
                ariaLabel="Theme Mode"
              />
            </div>
          </div>

          {/* Accent color picker */}
          <div
            className="space-y-2.5 pt-4 border-t"
            style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
          >
            <div
              className="text-base font-semibold"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              Accent color
            </div>
            <div
              className="text-sm"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              All accent palettes are calibrated to guarantee WCAG 2.2 AA text readability.
            </div>
            <AccentSwatchPicker
              value={accentColor}
              onChange={handleAccentChange}
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: Sound & Haptics */}
      <section className="space-y-4">
        <div
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
        >
          <Volume2 className="w-4 h-4" />
          <span>Sound & Haptics</span>
        </div>

        <div
          className="p-4 sm:p-5 rounded-2xl border shadow-xs divide-y divide-m3-outline-variant"
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
        >
          <MaterialSwitch
            id="setting-sound"
            label="Sound effects"
            description="Play crisp synthesized audio chimes on number placement, erase, and puzzle completion."
            checked={settings.soundEnabled}
            onChange={val => onUpdateSettings({ soundEnabled: val })}
          />

          <MaterialSwitch
            id="setting-haptics"
            label="Haptic vibration"
            description="Tactile vibration pulses on key actions (for supported mobile browsers)."
            checked={settings.hapticsEnabled}
            onChange={val => onUpdateSettings({ hapticsEnabled: val })}
          />
        </div>
      </section>

      {/* SECTION 4: Android App & Offline Installation */}
      {onOpenInstallApp && (
        <section
          className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-primary)',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--md-sys-color-primary)',
              }}
            >
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div
                className="text-sm font-bold"
                style={{ color: 'var(--md-sys-color-on-surface)' }}
              >
                Download / Install Android App
              </div>
              <div
                className="text-xs mt-0.5 leading-relaxed"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                Install as a native full-screen WebAPK on your phone with offline support.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenInstallApp}
            style={{
              backgroundColor: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-on-primary)',
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-xs hover:opacity-85 transition-opacity whitespace-nowrap self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Install APK</span>
          </button>
        </section>
      )}

      {/* SECTION 5: Contrast & Compliance Verification */}
      <section
        className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--md-sys-color-surface-container-high)',
          borderColor: 'var(--md-sys-color-outline-variant)',
        }}
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <div
              className="text-sm font-bold"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              Accessibility & Contrast Auditor
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Verified compliant with WCAG 2.2 AA standards across all light and dark palettes.
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenContrastAudit}
          style={{
            borderColor: 'var(--md-sys-color-outline)',
            backgroundColor: 'var(--md-sys-color-surface)',
            color: 'var(--md-sys-color-primary)',
          }}
          className="px-4 py-2 text-xs font-bold rounded-xl border hover:opacity-85 transition-opacity whitespace-nowrap self-start sm:self-auto"
        >
          View Contrast Metrics
        </button>
      </section>
    </div>
  );
};
