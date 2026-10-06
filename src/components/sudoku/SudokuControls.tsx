import React from 'react';
import { useTheme } from '../../theme/themeContext';
import { Undo2, Eraser, Edit3, Lightbulb, Compass } from 'lucide-react';

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
}) => {
  return (
    <div className="w-full max-w-[480px] mx-auto space-y-4">
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
        >
          <Eraser className="w-5 h-5 mb-1 text-rose-500" />
          <span className="text-[11px] font-semibold">Erase</span>
        </button>

        {/* Notes Mode Toggle */}
        <button
          type="button"
          disabled={disabled}
          onClick={onToggleNotesMode}
          style={{
            backgroundColor: isNotesMode
              ? 'var(--md-sys-color-primary)'
              : 'var(--md-sys-color-surface)',
            borderColor: isNotesMode
              ? 'var(--md-sys-color-primary)'
              : 'var(--md-sys-color-outline-variant)',
            color: isNotesMode
              ? 'var(--md-sys-color-on-primary)'
              : 'var(--md-sys-color-on-surface)',
          }}
          className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
            isNotesMode ? 'shadow-sm ring-2 ring-offset-1' : 'hover:opacity-90'
          }`}
        >
          <Edit3 className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-semibold">
            {isNotesMode ? 'Notes ON' : 'Notes'}
          </span>
          {isNotesMode && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
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
        >
          <Compass className="w-5 h-5 mb-1 text-indigo-500" />
          <span className="text-[11px] font-semibold">Ask Logic</span>
        </button>
      </div>

      {/* Number Pad 1-9 */}
      <div className="grid grid-cols-9 gap-1 sm:gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
          const placedCount = digitCounts[num] || 0;
          const isCompleted = placedCount >= 9;

          return (
            <button
              key={num}
              type="button"
              disabled={isCompleted || disabled}
              onClick={() => onNumberClick(num)}
              style={{
                backgroundColor: isCompleted
                  ? 'var(--md-sys-color-surface-container-high)'
                  : 'var(--md-sys-color-surface)',
                borderColor: 'var(--md-sys-color-outline-variant)',
              }}
              className={`flex flex-col items-center justify-center py-2 sm:py-2.5 rounded-xl border transition-all active:scale-95 select-none ${
                isCompleted ? 'opacity-35 cursor-not-allowed' : 'hover:opacity-90 shadow-xs'
              }`}
            >
              <span
                style={{
                  color: isCompleted
                    ? 'var(--md-sys-color-on-surface-variant)'
                    : 'var(--md-sys-color-on-surface)',
                }}
                className="text-lg sm:text-xl font-bold font-mono"
              >
                {num}
              </span>
              <span
                style={{
                  color: 'var(--md-sys-color-on-surface-variant)',
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
