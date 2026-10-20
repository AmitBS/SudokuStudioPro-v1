import React, { useState, useEffect } from 'react';
import { CompletionAnimationStyle, GameSettings, HintsMode, MistakesMode, Screen, SudokuInputMode, ThemeMode } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { MaterialSwitch } from '../common/MaterialSwitch';
import { SegmentedControl } from '../common/SegmentedControl';
import { AccentSwatchPicker } from '../common/AccentSwatchPicker';
import { ArrowLeft, Monitor, Sun, Moon, Volume2, ShieldCheck, Gamepad2, Palette, RotateCcw, Pipette, Check } from 'lucide-react';
import { DEFAULT_CUSTOM_COLORS, DEFAULT_SUDOKU_COLORS, getSudokuColor, getSudokuColorName, SudokuColorCircle, SudokuFruit, getFruitName } from '../../utils/sudokuSymbols';

const PRESET_PALETTE = [
  '#E53935', // Red
  '#1E88E5', // Blue
  '#2E7D32', // Green
  '#FDD835', // Yellow
  '#FB8C00', // Orange
  '#8E24AA', // Purple
  '#EC407A', // Pink
  '#00ACC1', // Cyan
  '#795548', // Brown
  '#10B981', // Emerald
  '#6366F1', // Indigo
  '#F59E0B', // Amber
  '#14B8A6', // Teal
  '#8B5CF6', // Violet
];

interface ColorCustomizerRowProps {
  num: number;
  currentHex: string;
  defaultHex: string;
  colorName: string;
  onColorChange: (num: number, hex: string) => void;
  onResetColor: (num: number) => void;
}

const ColorCustomizerRow: React.FC<ColorCustomizerRowProps> = ({
  num,
  currentHex,
  defaultHex,
  colorName,
  onColorChange,
  onResetColor,
}) => {
  const [hexInput, setHexInput] = useState<string>(currentHex);

  useEffect(() => {
    setHexInput(currentHex);
  }, [currentHex]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();
    if (!val.startsWith('#') && val.length > 0) {
      val = '#' + val;
    }
    setHexInput(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      onColorChange(num, val);
    }
  };

  const handleHexBlur = () => {
    if (/^#[0-9A-F]{6}$/i.test(hexInput)) {
      onColorChange(num, hexInput);
    } else {
      setHexInput(currentHex);
    }
  };

  const isCustomized = currentHex.toUpperCase() !== defaultHex.toUpperCase();

  return (
    <div
      className="p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
      style={{
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        borderColor: 'var(--md-sys-color-outline-variant)',
      }}
    >
      {/* Left: Value identifier, color name, and solid circle preview */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Preview of the filled circle with no numbers, letters or symbols inside */}
        <div
          role="img"
          aria-label={`Value ${num} colored circle, currently ${colorName} (${currentHex})`}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 shadow-xs ring-2 ring-black/15 dark:ring-white/20 select-none transition-transform hover:scale-105"
          style={{ backgroundColor: currentHex }}
        />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-mono font-extrabold px-1.5 py-0.5 rounded-md"
              style={{
                backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                color: 'var(--md-sys-color-on-surface)',
              }}
            >
              Value {num}
            </span>
            <span
              className="text-sm font-bold truncate"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              {colorName}
            </span>
          </div>
          <div
            className="text-xs font-mono font-medium mt-0.5"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            {currentHex}
          </div>
        </div>
      </div>

      {/* Right: Customization controls (quick palette, native picker, hex text input, reset) */}
      <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
        {/* Quick predefined palette swatches */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full sm:max-w-none">
          {PRESET_PALETTE.slice(0, 9).map(hex => {
            const isSelected = hex.toUpperCase() === currentHex.toUpperCase();
            return (
              <button
                key={hex}
                type="button"
                onClick={() => onColorChange(num, hex)}
                aria-label={`Set Value ${num} to ${hex}`}
                title={hex}
                style={{ backgroundColor: hex }}
                className={`w-5 h-5 rounded-full shrink-0 shadow-2xs transition-transform hover:scale-115 flex items-center justify-center ${
                  isSelected ? 'ring-2 ring-offset-1 ring-primary scale-110' : 'opacity-85 hover:opacity-100'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white drop-shadow-sm stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Native Color Picker swatch button */}
        <label
          className="relative flex items-center justify-center w-8 h-8 rounded-lg border cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-xs"
          style={{
            backgroundColor: currentHex,
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
          title="Open Color Wheel Picker"
        >
          <Pipette className="w-4 h-4 text-white drop-shadow-md stroke-[2.5]" />
          <input
            type="color"
            value={currentHex}
            onChange={e => onColorChange(num, e.target.value.toUpperCase())}
            className="sr-only"
            aria-label={`Open system color picker for Value ${num}`}
          />
        </label>

        {/* Hex Text Input */}
        <div className="flex items-center">
          <input
            type="text"
            value={hexInput}
            maxLength={7}
            onChange={handleHexChange}
            onBlur={handleHexBlur}
            aria-label={`Hexadecimal color code for Value ${num}`}
            className="w-20 px-2 py-1 text-xs font-mono font-bold rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary uppercase text-center"
            style={{
              backgroundColor: 'var(--md-sys-color-surface)',
              borderColor: 'var(--md-sys-color-outline-variant)',
              color: 'var(--md-sys-color-on-surface)',
            }}
          />
        </div>

        {/* Reset button if customized */}
        {isCustomized && (
          <button
            type="button"
            onClick={() => onResetColor(num)}
            title={`Reset Value ${num} to default color (${defaultHex})`}
            aria-label={`Reset Value ${num} to default`}
            className="p-1.5 rounded-lg border text-xs font-medium transition-all hover:opacity-85 active:scale-95"
            style={{
              backgroundColor: 'var(--md-sys-color-surface)',
              borderColor: 'var(--md-sys-color-outline-variant)',
              color: 'var(--md-sys-color-on-surface-variant)',
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

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

  const handleUpdateColor = (num: number, hex: string) => {
    let cleanHex = hex.trim();
    if (!cleanHex.startsWith('#')) cleanHex = '#' + cleanHex;
    const updated = {
      ...DEFAULT_CUSTOM_COLORS,
      ...(settings.customColors || {}),
      [num]: cleanHex,
    };
    onUpdateSettings({ customColors: updated });
  };

  const handleResetSingleColor = (num: number) => {
    const updated = {
      ...DEFAULT_CUSTOM_COLORS,
      ...(settings.customColors || {}),
      [num]: DEFAULT_CUSTOM_COLORS[num] || '#94a3b8',
    };
    onUpdateSettings({ customColors: updated });
  };

  const handleResetDefaultColors = () => {
    onUpdateSettings({ customColors: { ...DEFAULT_CUSTOM_COLORS } });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-in fade-in duration-150 max-w-full overflow-x-hidden">
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
          {/* Sudoku Display Mode */}
          <div className="pb-4 space-y-2">
            <div
              className="text-base font-semibold"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              Sudoku Display Mode
            </div>
            <div
              className="text-sm"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Choose how Sudoku values are visually represented: classic numbers 1–9, geometric symbols, solid colored circles, or vibrant fruit illustrations.
            </div>
            <div className="pt-2">
              <SegmentedControl<SudokuInputMode>
                options={[
                  {
                    value: 'numbers',
                    label: 'Number Mode',
                    shortLabel: 'Numbers',
                    icon: <span className="font-mono font-black text-[11px] leading-none">123</span>,
                  },
                  {
                    value: 'symbols',
                    label: 'Symbol Mode',
                    shortLabel: 'Symbols',
                    icon: <span className="text-xs leading-none">★</span>,
                  },
                  {
                    value: 'colors',
                    label: 'Color Mode',
                    shortLabel: 'Colors',
                    icon: (
                      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 inline-block shrink-0" />
                    ),
                  },
                  {
                    value: 'fruits',
                    label: 'Fruit Mode',
                    shortLabel: 'Fruits',
                    icon: <span className="text-xs leading-none">🥝</span>,
                  },
                ]}
                value={settings.inputMode || 'numbers'}
                onChange={val => onUpdateSettings({ inputMode: val })}
                ariaLabel="Sudoku Display Mode"
              />
            </div>

            {settings.inputMode === 'fruits' && (
              <div
                className="mt-3 p-3 rounded-xl border flex flex-col gap-2 animate-in fade-in duration-200"
                style={{
                  backgroundColor: 'var(--md-sys-color-surface-container-low)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                }}
              >
                <div className="flex items-center justify-between text-xs font-bold" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                  <span>Fruit Mode Value Mapping</span>
                  <span className="text-[11px] font-normal" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>9 Realistic 3D Fruits</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <div
                      key={num}
                      className="flex flex-col items-center justify-center p-2 rounded-xl border text-center shadow-2xs transition-transform hover:scale-105"
                      style={{
                        backgroundColor: 'var(--md-sys-color-surface)',
                        borderColor: 'var(--md-sys-color-outline-variant)',
                      }}
                    >
                      <SudokuFruit value={num} size="md" />
                      <span className="text-[11px] font-mono font-bold mt-1" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                        {num}
                      </span>
                      <span className="text-[9px] truncate max-w-full font-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {getFruitName(num)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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

      {/* SECTION 2: Color Mode Settings */}
      <section className="space-y-4" id="color-mode-settings">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            <Palette className="w-4 h-4 text-primary" />
            <span>Color Mode Settings</span>
          </div>

          {/* Reset to Default Colors button */}
          <button
            type="button"
            onClick={handleResetDefaultColors}
            aria-label="Reset to Default Colors"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:opacity-85 active:scale-95 shadow-xs"
            style={{
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              borderColor: 'var(--md-sys-color-outline-variant)',
              color: 'var(--md-sys-color-on-surface)',
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Colors</span>
          </button>
        </div>

        <div
          className="p-4 sm:p-5 rounded-2xl border shadow-xs space-y-4"
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
        >
          <div>
            <div
              className="text-base font-semibold"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              Customize Sudoku Value Colors
            </div>
            <p
              className="text-sm mt-0.5"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              In Color Mode, each Sudoku value is represented as a solid filled circle with no numbers or symbols inside. Customize any of the nine colors below using the color picker, hex codes, or quick swatches.
            </p>
          </div>

          {/* 1-9 Palette Overview Strip */}
          <div
            className="p-3 rounded-xl border grid grid-cols-9 gap-1 sm:gap-2 max-w-full"
            style={{
              backgroundColor: 'var(--md-sys-color-surface-container-low)',
              borderColor: 'var(--md-sys-color-outline-variant)',
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
              const hex = getSudokuColor(num, settings.customColors);
              return (
                <div key={num} className="flex flex-col items-center gap-1 min-w-0">
                  <div
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-xs ring-1 ring-black/15 dark:ring-white/20 select-none"
                    style={{ backgroundColor: hex }}
                  />
                  <span
                    className="text-[10px] font-mono font-bold"
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                  >
                    {num}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 9 Value Rows */}
          <div className="space-y-2.5 pt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
              const currentHex = getSudokuColor(num, settings.customColors);
              const defaultMeta = DEFAULT_SUDOKU_COLORS[num];
              const defaultHex = defaultMeta?.defaultHex || DEFAULT_CUSTOM_COLORS[num] || '#94a3b8';
              const colorName = defaultMeta?.name || `Color ${num}`;

              return (
                <ColorCustomizerRow
                  key={num}
                  num={num}
                  currentHex={currentHex}
                  defaultHex={defaultHex}
                  colorName={colorName}
                  onColorChange={handleUpdateColor}
                  onResetColor={handleResetSingleColor}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: Appearance */}
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

          {/* Completion Animation Style: Show Ribbon / Numbers Only */}
          <div
            id="setting-completion-animation"
            className="space-y-2.5 pt-4 border-t"
            style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <label
                  htmlFor="setting-completion-animation-toggle"
                  className="block text-base font-semibold"
                  style={{ color: 'var(--md-sys-color-on-surface)' }}
                >
                  Show Ribbon / Numbers Only
                </label>
                <div
                  className="text-sm font-normal mt-0.5 leading-relaxed"
                  style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                >
                  {settings.completionAnimationStyle === 'numbers_only'
                    ? 'Numbers Only: Display only the moving numbers along their paths, without ribbon shapes.'
                    : 'Ribbon Style: Display motion trail ribbons filled with the moving number, using its existing color.'}
                </div>
              </div>
            </div>
            <div className="pt-1">
              <SegmentedControl<CompletionAnimationStyle>
                options={[
                  { value: 'ribbon', label: 'Show Ribbon' },
                  { value: 'numbers_only', label: 'Numbers Only' },
                ]}
                value={settings.completionAnimationStyle || 'ribbon'}
                onChange={val => onUpdateSettings({ completionAnimationStyle: val })}
                ariaLabel="Show Ribbon / Numbers Only"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Sound & Haptics */}
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
