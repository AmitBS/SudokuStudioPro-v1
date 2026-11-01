import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../theme/themeContext';
import { SudokuInputMode } from '../../types/sudoku';
import {
  SudokuValueDisplay,
  getSymbolAriaLabel,
  getConfiguredNumberColor,
  getProgressiveNumberBoxColor,
  isColorLight,
  interpolateColors,
} from '../../utils/sudokuSymbols';
import { Undo2, Eraser, Pencil, Pen, Lightbulb, Compass } from 'lucide-react';
import { playClickSound, playSuccessSound, triggerHaptic } from '../../utils/audio';

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
  selectedNoteValue?: number | null;
  onSelectNoteValue?: (num: number | null) => void;
  isParadeActive?: boolean;
  paradeCollectionCounts?: Record<number, number>;
  arrivingBoxPulse?: { num: number; count: number } | null;
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
  selectedNoteValue = null,
  onSelectNoteValue,
  isParadeActive = false,
  paradeCollectionCounts,
  arrivingBoxPulse = null,
}) => {
  const { isDark, activePrimary } = useTheme();

  // Long-press detection on numpad buttons while in Pencil Mode
  const longPressTimerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef<boolean>(false);
  const pressStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const pressingNumRef = useRef<number | null>(null);
  const [pressingNum, setPressingNum] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const handlePointerDown = (num: number, e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (!isNotesMode) return;

    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressTriggeredRef.current = false;
    pressingNumRef.current = num;
    setPressingNum(num);
    pressStartPosRef.current = { x: e.clientX, y: e.clientY };

    longPressTimerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      setPressingNum(null);
      if (onSelectNoteValue) {
        onSelectNoteValue(num);
        playSuccessSound(true);
        triggerHaptic('success');
      }
    }, 450);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (pressStartPosRef.current && pressingNumRef.current !== null) {
      const dx = Math.abs(e.clientX - pressStartPosRef.current.x);
      const dy = Math.abs(e.clientY - pressStartPosRef.current.y);
      if (dx > 12 || dy > 12) {
        if (longPressTimerRef.current !== null) {
          window.clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
        setPressingNum(null);
        pressingNumRef.current = null;
      }
    }
  };

  const handlePointerUp = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setPressingNum(null);
    pressingNumRef.current = null;
  };

  const handleClick = (num: number) => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    // If the user taps the same highlighted value again, restore its background color to normal state and deselect it
    if (isNotesMode && selectedNoteValue === num) {
      if (onSelectNoteValue) {
        onSelectNoteValue(null);
        playClickSound(true);
        triggerHaptic('light');
      }
      return;
    }
    onNumberClick(num);
  };

  return (
    <div className="w-full max-w-[480px] mx-auto space-y-2 sm:space-y-3">
      {/* Action Toolbar */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center select-none">
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
          className={`flex flex-col items-center justify-center h-[44px] sm:h-[50px] px-1 py-1 rounded-xl border transition-all ${
            canUndo && !disabled ? 'active:scale-95 hover:opacity-90' : 'opacity-40 cursor-not-allowed'
          }`}
          title="Undo last move (U or Backspace)"
        >
          <Undo2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5" />
          <span className="text-[10px] sm:text-[11px] font-semibold leading-tight">Undo</span>
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
          className="flex flex-col items-center justify-center h-[44px] sm:h-[50px] px-1 py-1 rounded-xl border hover:opacity-90 active:scale-95 transition-all"
          title="Erase cell value or notes (Backspace)"
        >
          <Eraser className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5 text-rose-500" />
          <span className="text-[10px] sm:text-[11px] font-semibold leading-tight">Erase</span>
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
          className={`relative flex flex-col items-center justify-center h-[44px] sm:h-[50px] px-1 py-1 rounded-xl border transition-all ${
            isNotesMode ? 'shadow-xs ring-2 ring-amber-500/30 font-bold' : 'hover:opacity-90 active:scale-95'
          }`}
        >
          <div className="relative mb-0.5 flex items-center justify-center">
            <Pencil className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform ${isNotesMode ? 'scale-105 text-amber-500' : ''}`} />
            {isNotesMode && (
              <span className="absolute -top-0.5 -right-1 w-1.5 h-1.5 rounded-full bg-amber-500 ring-1 ring-white animate-pulse" />
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold flex items-center gap-0.5 leading-tight">
            <span>Pencil</span>
            <span
              className={`text-[8.5px] px-1 py-0 rounded font-mono font-bold leading-none ${
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
          className="flex flex-col items-center justify-center h-[44px] sm:h-[50px] px-1 py-1 rounded-xl border hover:opacity-90 active:scale-95 transition-all"
          title="Direct clue hint (H)"
        >
          <Lightbulb className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5 text-amber-500" />
          <span className="text-[10px] sm:text-[11px] font-semibold leading-tight">Hint</span>
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
          className="flex flex-col items-center justify-center h-[44px] sm:h-[50px] px-1 py-1 rounded-xl border hover:opacity-90 active:scale-95 transition-all"
          title="Deductive Tutor Logic Step (L)"
        >
          <Compass className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5 text-indigo-500" />
          <span className="text-[10px] sm:text-[11px] font-semibold leading-tight">Ask Logic</span>
        </button>
      </div>

      {/* Prominent Segmented Pencil Mode Switcher */}
      <div className="space-y-1">
        <div
          className="flex items-center p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border shadow-xs max-w-md mx-auto"
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
            className={`flex-1 h-7 sm:h-8.5 px-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
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
            <Pen className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
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
            className={`flex-1 h-7 sm:h-8.5 px-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isNotesMode
                ? 'shadow-xs active:scale-98 ring-2 ring-amber-500/40'
                : 'hover:opacity-75 opacity-70'
            }`}
            style={{
              backgroundColor: isNotesMode ? '#F59E0B' : 'transparent',
              color: isNotesMode ? '#FFFFFF' : 'var(--md-sys-color-on-surface-variant)',
              border: isNotesMode ? '1px solid #D97706' : '1px solid transparent',
            }}
          >
            <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="flex items-center gap-1">
              <span>Pencil Mode (Notes)</span>
              {isNotesMode && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </span>
          </button>
        </div>

        {/* Contextual Status Tip - Reduced font size and height */}
        <div
          className="text-center text-[10px] sm:text-[11px] font-medium leading-tight transition-colors min-h-[1.125rem] flex items-center justify-center px-1"
          style={{
            color: isNotesMode ? '#D97706' : 'var(--md-sys-color-on-surface-variant)',
          }}
        >
          {isNotesMode && selectedNoteValue !== null ? (
            <span className="inline-flex items-center gap-1.5 animate-in fade-in font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 text-[9.5px] sm:text-[10.5px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>
                <strong>Note Selected:</strong> Tap empty cells to enter or remove note. Tap highlighted value again to deselect.
              </span>
            </span>
          ) : isNotesMode ? (
            <span className="inline-flex items-center gap-1 animate-in fade-in">
              <Pencil className="w-2.5 h-2.5 text-amber-500 shrink-0" />
              <span><strong>Pencil Mode:</strong> Tap cell to add notes, or <strong>long-press</strong> any number below to select & stamp</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Pen className="w-2.5 h-2.5 opacity-60 shrink-0" />
              <span><strong>Normal Mode:</strong> Numbers will place final values into the selected cell</span>
            </span>
          )}
        </div>
      </div>

      {/* Number Pad 1-9 with Long-Press Note Selection & Background Highlighting */}
      <div className="grid grid-cols-9 gap-1 sm:gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
          const placedCount = digitCounts[num] || 0;
          const isNormalCompleted = placedCount >= 9;
          const isSelected = isNotesMode && selectedNoteValue === num;
          const isPressing = isNotesMode && pressingNum === num && !isSelected;

          // Celebration parade collection state
          const isInParade = isParadeActive || paradeCollectionCounts !== undefined || completedParadeNumbers.length > 0;
          const collectionCount = paradeCollectionCounts ? (paradeCollectionCounts[num] ?? 0) : (completedParadeNumbers.includes(num) ? 9 : 0);
          const isParadeCompleted = completedParadeNumbers.includes(num) || collectionCount >= 9;
          const isCurrentlyGathering = celebratingNumber === num;
          const isArrivingPulse = arrivingBoxPulse?.num === num;

          const targetColor = getConfiguredNumberColor(num, inputMode, customColors);
          const baseSurfaceBg = isDark ? '#1a1f2c' : '#ffffff';
          const baseOutline = isDark ? '#334155' : 'var(--md-sys-color-outline-variant)';

          // Dynamic background color during parade collection:
          // - Initial state (count = 0): retain original default background color
          // - During collection (1 <= count < 9): smoothly transition from original to configured color
          // - Completed (count >= 9): 100% configured color
          let buttonBgColor: string;
          let buttonBorderColor: string;
          let textColor: string;
          let counterColor: string;

          if (isInParade) {
            if (collectionCount <= 0) {
              // Initial State: pristine default background color, not prematurely colored
              buttonBgColor = 'var(--md-sys-color-surface)';
              buttonBorderColor = 'var(--md-sys-color-outline-variant)';
              textColor = 'var(--md-sys-color-on-surface)';
              counterColor = 'var(--md-sys-color-on-surface-variant)';
            } else if (collectionCount >= 9) {
              // Final Completed State: 100% configured color
              buttonBgColor = targetColor;
              buttonBorderColor = targetColor;
              const light = isColorLight(targetColor);
              textColor = light ? '#0f172a' : '#ffffff';
              counterColor = light ? '#1e293b' : 'rgba(255, 255, 255, 0.95)';
            } else {
              // Progressive color transition as occurrences arrive
              buttonBgColor = getProgressiveNumberBoxColor(baseSurfaceBg, targetColor, collectionCount);
              buttonBorderColor = interpolateColors(
                typeof baseOutline === 'string' && baseOutline.startsWith('#') ? baseOutline : '#94a3b8',
                targetColor,
                Math.min(1, (collectionCount + 2) / 11)
              );
              const light = isColorLight(buttonBgColor);
              textColor = collectionCount >= 5 ? (light ? '#0f172a' : '#ffffff') : 'var(--md-sys-color-on-surface)';
              counterColor = collectionCount >= 5 ? (light ? '#1e293b' : 'rgba(255, 255, 255, 0.95)') : 'var(--md-sys-color-on-surface)';
            }
          } else {
            // Normal Gameplay State
            buttonBgColor = isSelected
              ? '#F59E0B'
              : isNotesMode
              ? isDark ? 'rgba(245, 158, 11, 0.12)' : 'rgba(254, 243, 199, 0.5)'
              : isNormalCompleted
              ? 'var(--md-sys-color-surface-container-high)'
              : 'var(--md-sys-color-surface)';

            buttonBorderColor = isSelected
              ? '#B45309'
              : isNotesMode
              ? '#F59E0B'
              : 'var(--md-sys-color-outline-variant)';

            textColor = isSelected
              ? '#FFFFFF'
              : isNotesMode
              ? isDark ? '#FCD34D' : '#B45309'
              : isNormalCompleted
              ? 'var(--md-sys-color-on-surface-variant)'
              : 'var(--md-sys-color-on-surface)';

            counterColor = isSelected
              ? '#FFFFFF'
              : isNotesMode
              ? '#D97706'
              : 'var(--md-sys-color-on-surface-variant)';
          }

          // In Pencil mode, allow tapping any number to draft candidate notes even if 9 are completed
          const isDisabled = isInParade || (!isNotesMode && isNormalCompleted);

          const buttonTitle = isInParade
            ? `${getSymbolAriaLabel(num, inputMode, customColors)}: collected ${collectionCount}/9`
            : isNotesMode
            ? isSelected
              ? `Note ${num} selected. Tap empty cells to add or remove note. Tap to deselect.`
              : `Long-press ${num} to select note for quick cell placement.`
            : `Place value ${num}`;

          return (
            <button
              key={num}
              id={`numpad-btn-${num}`}
              type="button"
              aria-label={`${getSymbolAriaLabel(num, inputMode, customColors)}${
                isInParade
                  ? ` collection count ${collectionCount} of 9`
                  : isNotesMode
                  ? ' candidate note'
                  : ''
              }${isSelected ? ' (selected note)' : ''}`}
              aria-pressed={isSelected}
              disabled={isDisabled || disabled}
              title={buttonTitle}
              onPointerDown={(e) => handlePointerDown(num, e)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onContextMenu={(e) => {
                if (isNotesMode) e.preventDefault();
              }}
              onClick={() => handleClick(num)}
              style={{
                backgroundColor: buttonBgColor,
                borderColor: buttonBorderColor,
                borderWidth: isSelected || isArrivingPulse || (isInParade && collectionCount >= 9) ? '2px' : '1px',
                transition: 'background-color 420ms cubic-bezier(0.4, 0, 0.2, 1), border-color 420ms cubic-bezier(0.4, 0, 0.2, 1), transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 360ms ease',
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 sm:py-2 h-[48px] sm:h-[56px] rounded-xl border select-none touch-manipulation ${
                isSelected
                  ? 'ring-4 ring-amber-500/60 shadow-lg shadow-amber-500/35 scale-105 z-10 font-extrabold'
                  : isArrivingPulse
                  ? 'scale-115 ring-4 shadow-xl z-30 font-black'
                  : isInParade && isParadeCompleted
                  ? 'ring-2 ring-white/50 shadow-md font-bold'
                  : isInParade && isCurrentlyGathering
                  ? 'ring-2 ring-primary/40 shadow-xs'
                  : isDisabled && !isInParade
                  ? 'opacity-35 cursor-not-allowed'
                  : isNotesMode
                  ? 'hover:ring-1 hover:ring-amber-500 shadow-xs active:scale-95'
                  : 'hover:opacity-90 shadow-xs active:scale-95'
              } ${isPressing ? 'scale-95 ring-2 ring-amber-500/50' : ''}`}
            >
              {/* Corner badge indicating selected note stamping or standard pencil mode or 9/9 completed */}
              {isSelected ? (
                <span
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white text-amber-600 flex items-center justify-center text-[9px] font-black shadow-md ring-1 ring-amber-500 animate-in zoom-in-75 duration-150 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  ✎
                </span>
              ) : isNotesMode && !isInParade ? (
                <span
                  className="absolute top-0.5 right-1 text-[8px] font-bold text-amber-500 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  ✎
                </span>
              ) : isInParade && collectionCount >= 9 ? (
                <span
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white text-emerald-600 flex items-center justify-center text-[8px] font-black shadow-sm ring-1 ring-black/10 select-none pointer-events-none animate-in zoom-in-50 duration-200"
                  aria-hidden="true"
                >
                  ✓
                </span>
              ) : null}

              {/* Symbol / Number / Fruit / Color Display */}
              <span
                style={{
                  color: textColor,
                }}
                className={`text-base sm:text-xl font-bold font-mono flex items-center justify-center h-5 sm:h-7 transition-all duration-150 ${
                  isSelected || (isInParade && collectionCount >= 9) ? 'drop-shadow-sm font-extrabold' : ''
                } ${isArrivingPulse ? 'scale-115' : ''}`}
              >
                <SudokuValueDisplay value={num} inputMode={inputMode} customColors={customColors} size="md" />
              </span>

              {/* Counter: live 0/9 to 9/9 during parade collection, or placedCount during normal gameplay */}
              <span
                style={{
                  color: counterColor,
                }}
                className={`font-mono leading-none mt-0.5 transition-all duration-150 ${
                  isInParade
                    ? 'text-[9.5px] sm:text-[10px] font-bold tracking-tight'
                    : isSelected
                    ? 'text-[9px] sm:text-[10px] font-bold'
                    : 'text-[9px] sm:text-[10px] font-medium'
                } ${isArrivingPulse ? 'scale-120 font-black' : ''}`}
              >
                {isInParade ? `${Math.min(9, collectionCount)}/9` : 9 - placedCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
