import React from 'react';
import { useTheme } from '../../theme/themeContext';
import { SudokuInputMode } from '../../types/sudoku';
import { SudokuValueDisplay, getSymbolAriaLabel } from '../../utils/sudokuSymbols';
import { Undo2, Eraser, Pencil, Pen, Lightbulb, Compass } from 'lucide-react';

interface SudokuControlsProps {
  onNumberClick: (num: number) => void;
  onUndo: () => void;
  onErase: () => void;
  isNotesMode: boolean;
  onToggleNotesMode: () => void;
  onHint: () => void;
  onAskLogic: () => void;
  digitCounts: Record<number, number>;
  canUndo: boolean;
  disabled?: boolean;
  celebratingNumber?: number | null;
  completedParadeNumbers?: number[];
  inputMode?: SudokuInputMode;
  customColors?: Record<number, string>;
}

export const SudokuControls: React.FC<SudokuControlsProps> = ({
  onNumberClick,
  onUndo,
  onErase,
  isNotesMode,
  onToggleNotesMode,
  onHint,
  onAskLogic,
  digitCounts,
  canUndo,
  disabled = false,
  celebratingNumber = null,
  completedParadeNumbers = [],
  inputMode = 'numbers',
  customColors,
}) => {
  const { isDark, activePrimary } = useTheme();

  return (
    <div className="w-full max-w-[480px] mx-auto space-y-3.5">
      {/* Action Toolbar */}
      <div className="grid grid-cols-5 gap-2 text-center select-none">
        {/* Undo */}
        <button
          type="button"
          disabled={!canUndo || disabled}
          onClick={onUndo}
          style={{
            backgroundColor: canUndo && !disabled
              ? 'var(--md-sys-color-surface)'
              : 'var(--md-sys-color-surface-container-high)',
            borderColor: 'var(--md-sys-color-outline-variant)',
            color: canUndo && !disabled
              ? 'var(--md-sys-color-on-surface)'
              : 'var(--md-sys-color-on-surface-variant)',
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
            canUndo && !disabled ? 'active:scale-95 hover:opacity-90' : 'opacity-40 cursor-not-allowed'
          }`}
          title="Undo last move (U or Backspace)"
        >
          <Undo2 className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-semibold">Undo</span>
        </button>

        {/* Erase */}
        <button
          type="button"
          disabled={disabled}
          onClick={onErase}
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
            color: 'var(--md-sys-color-on-surface)',
          }}
          className="flex flex-col items-center justify-center p-2 rounded-xl border hover:opacity-90 active:scale-95 transition-all"
          title="Erase cell value or notes (Backspace)"
        >
          <Eraser className="w-5 h-5 mb-1 text-rose-500" />
          <span className="text-[11px] font-semibold">Erase</span>
        </button>

        {/* Pencil Mode Toggle Action Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={onToggleNotesMode}
          aria-pressed={isNotesMode}
          title={isNotesMode ? 'Pencil Mode ON (Click or press P to switch to normal numbers)' : 'Switch to Pencil Mode (Click or press P to add candidate notes)'}
          style={{
            backgroundColor: isNotesMode
              ? 'rgba(245, 158, 11, 0.16)'
              : 'var(--md-sys-color-surface)',
            borderColor: isNotesMode
              ? '#F59E0B'
              : 'var(--md-sys-color-outline-variant)',
            color: isNotesMode
              ? '#D97706'
              : 'var(--md-sys-color-on-surface)',
          }}
          className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
            isNotesMode ? 'shadow-sm ring-2 ring-amber-500/30 font-bold' : 'hover:opacity-90 active:scale-95'
          }`}
        >
          <div className="relative mb-1">
            <Pencil className={`w-5 h-5 transition-transform ${isNotesMode ? 'scale-110 text-amber-500' : ''}`} />
            {isNotesMode && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
            )}
          </div>
          <span className="text-[11px] font-semibold flex items-center gap-0.5">
            <span>Pencil</span>
            <span
              className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                isNotesMode ? 'bg-amber-500 text-white' : 'bg-black/5 dark:bg-white/10 text-muted'
              }`}
            >
              {isNotesMode ? 'ON' : 'OFF'}
            </span>
          </span>
        </button>

        {/* Quick Hint */}
        <button
          type="button"
          disabled={disabled}
          onClick={onHint}
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
            color: 'var(--md-sys-color-on-surface)',
          }}
          className="flex flex-col items-center justify-center p-2 rounded-xl border hover:opacity-90 active:scale-95 transition-all"
          title="Direct clue hint (H)"
        >
          <Lightbulb className="w-5 h-5 mb-1 text-amber-500" />
          <span className="text-[11px] font-semibold">Hint</span>
        </button>

        {/* Ask Logic */}
        <button
          type="button"
          disabled={disabled}
          onClick={onAskLogic}
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
            color: 'var(--md-sys-color-on-surface)',
          }}
          className="flex flex-col items-center justify-center p-2 rounded-xl border hover:opacity-90 active:scale-95 transition-all"
          title="Deductive Tutor Logic Step (L)"
        >
          <Compass className="w-5 h-5 mb-1 text-indigo-500" />
          <span className="text-[11px] font-semibold">Ask Logic</span>
        </button>
      </div>

      {/* Prominent Segmented Pencil Mode Switcher */}
      <div className="space-y-1.5">
        <div
          className="flex items-center p-1 rounded-2xl border shadow-xs max-w-md mx-auto"
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
          role="radiogroup"
          aria-label="Input Mode Switcher"
        >
          {/* Normal Pen Mode (Place Final Value) */}
          <button
            type="button"
            role="radio"
            aria-checked={!isNotesMode}
            disabled={disabled}
            onClick={() => {
              if (isNotesMode) onToggleNotesMode();
            }}
            className={`flex-1 py-1.5 sm:py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              !isNotesMode
                ? 'shadow-xs active:scale-98'
                : 'hover:opacity-75 opacity-70'
            }`}
            style={{
              backgroundColor: !isNotesMode ? 'var(--md-sys-color-surface)' : 'transparent',
              color: !isNotesMode ? 'var(--md-sys-color-on-surface)' : 'var(--md-sys-color-on-surface-variant)',
              border: !isNotesMode ? '1px solid var(--md-sys-color-outline-variant)' : '1px solid transparent',
            }}
          >
            <Pen className="w-3.5 h-3.5 shrink-0" />
            <span>Normal (Place Number)</span>
          </button>

          {/* Pencil Mode (Candidate Notes) */}
          <button
            type="button"
            role="radio"
            aria-checked={isNotesMode}
            disabled={disabled}
            onClick={() => {
              if (!isNotesMode) onToggleNotesMode();
            }}
            className={`flex-1 py-1.5 sm:py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              isNotesMode
                ? 'shadow-sm active:scale-98 ring-2 ring-amber-500/40'
                : 'hover:opacity-75 opacity-70'
            }`}
            style={{
              backgroundColor: isNotesMode ? '#F59E0B' : 'transparent',
              color: isNotesMode ? '#FFFFFF' : 'var(--md-sys-color-on-surface-variant)',
              border: isNotesMode ? '1px solid #D97706' : '1px solid transparent',
            }}
          >
            <Pencil className="w-3.5 h-3.5 shrink-0" />
            <span className="flex items-center gap-1.5">
              <span>Pencil Mode (Notes)</span>
              {isNotesMode && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </span>
          </button>
        </div>

        {/* Contextual Status Tip */}
        <div
          className="text-center text-[11px] font-medium transition-colors"
          style={{
            color: isNotesMode ? '#D97706' : 'var(--md-sys-color-on-surface-variant)',
          }}
        >
          {isNotesMode ? (
            <span className="inline-flex items-center gap-1.5 animate-in fade-in">
              <Pencil className="w-3 h-3 text-amber-500" />
              <span><strong>Pencil Mode Active:</strong> Numbers will add or remove candidate notes in the selected cell (Press P to toggle)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Pen className="w-3 h-3 opacity-60" />
              <span><strong>Normal Mode:</strong> Numbers will place final values into the selected cell</span>
            </span>
          )}
        </div>
      </div>

      {/* Number Pad 1-9 */}
      <div className="grid grid-cols-9 gap-1 sm:gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
          const placedCount = digitCounts[num] || 0;
          const isCompleted = placedCount >= 9;
          const isCelebrating = celebratingNumber === num;
          const isParadeCompleted = completedParadeNumbers.includes(num);

          // In Pencil mode, allow tapping any number to draft candidate notes even if 9 are completed
          const isDisabled = !isNotesMode && isCompleted && !isCelebrating && !isParadeCompleted;

          return (
            <button
              key={num}
              id={`numpad-btn-${num}`}
              type="button"
              aria-label={`${getSymbolAriaLabel(num, inputMode, customColors)}${isNotesMode ? ' as candidate note' : ''}`}
              disabled={isDisabled || disabled}
              onClick={() => onNumberClick(num)}
              style={{
                backgroundColor: isCelebrating || isParadeCompleted
                  ? 'var(--md-sys-color-primary)'
                  : isNotesMode
                  ? isDark ? 'rgba(245, 158, 11, 0.12)' : 'rgba(254, 243, 199, 0.5)'
                  : isCompleted
                  ? 'var(--md-sys-color-surface-container-high)'
                  : 'var(--md-sys-color-surface)',
                borderColor: isCelebrating || isParadeCompleted
                  ? 'var(--md-sys-color-primary)'
                  : isNotesMode
                  ? '#F59E0B'
                  : 'var(--md-sys-color-outline-variant)',
              }}
              className={`relative flex flex-col items-center justify-center py-2 sm:py-2.5 rounded-xl border transition-all active:scale-95 select-none ${
                isCelebrating
                  ? 'scale-115 ring-4 ring-primary/50 shadow-lg shadow-primary/40 z-20 animate-pulse'
                  : isParadeCompleted
                  ? 'ring-2 ring-primary/40 shadow-sm'
                  : isDisabled
                  ? 'opacity-35 cursor-not-allowed'
                  : isNotesMode
                  ? 'hover:ring-1 hover:ring-amber-500 shadow-xs'
                  : 'hover:opacity-90 shadow-xs'
              }`}
            >
              {/* Subtle pencil corner indicator on numpad buttons during Pencil Mode */}
              {isNotesMode && (
                <span
                  className="absolute top-0.5 right-1 text-[8px] font-bold text-amber-500 select-none"
                  aria-hidden="true"
                >
                  ✎
                </span>
              )}

              <span
                style={{
                  color: isCelebrating || isParadeCompleted
                    ? 'var(--md-sys-color-on-primary)'
                    : isNotesMode
                    ? isDark ? '#FCD34D' : '#B45309'
                    : isCompleted
                    ? 'var(--md-sys-color-on-surface-variant)'
                    : 'var(--md-sys-color-on-surface)',
                }}
                className="text-lg sm:text-xl font-bold font-mono flex items-center justify-center h-6 sm:h-7"
              >
                <SudokuValueDisplay value={num} inputMode={inputMode} customColors={customColors} size="md" />
              </span>
              <span
                style={{
                  color: isNotesMode ? '#D97706' : 'var(--md-sys-color-on-surface-variant)',
                }}
                className="text-[10px] font-mono leading-none mt-0.5 font-medium"
              >
                {9 - placedCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
