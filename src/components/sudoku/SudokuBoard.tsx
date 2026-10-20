import React, { useRef, useState, useCallback, useEffect } from 'react';
import { BoardMatrix, CellData, CompletedHighlightCell, GameSettings, LogicStep } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { triggerHaptic, playSuccessSound } from '../../utils/audio';
import { CellNotesPopup } from './CellNotesPopup';
import { SudokuValueDisplay, getSymbolAriaLabel } from '../../utils/sudokuSymbols';

interface SudokuBoardProps {
  board: BoardMatrix;
  selectedCell: { row: number; col: number } | null;
  onSelectCell: (row: number, col: number) => void;
  onToggleCellNote?: (row: number, col: number, num: number) => void;
  settings: GameSettings;
  activeLogicStep?: LogicStep | null;
  mistakeCells?: { row: number; col: number }[];
  completedHighlightCells?: CompletedHighlightCell[];
  isPaused?: boolean;
  celebratingNumber?: number | null;
  completedParadeNumbers?: number[];
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  selectedCell,
  onSelectCell,
  onToggleCellNote,
  settings,
  activeLogicStep,
  mistakeCells = [],
  completedHighlightCells = [],
  isPaused = false,
  celebratingNumber = null,
  completedParadeNumbers = [],
}) => {
  const { tokens } = useTheme();

  // Long-press state for 2-second hold to add notes
  const [progressCell, setProgressCell] = useState<{ row: number; col: number } | null>(null);
  const [notesPopupTarget, setNotesPopupTarget] = useState<{
    row: number;
    col: number;
    rect: DOMRect;
    currentNotes: number[];
  } | null>(null);

  const longPressTimerRef = useRef<number | null>(null);
  const pressStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const longPressTriggeredRef = useRef<boolean>(false);

  // Clear timer helper
  const cancelLongPress = useCallback(() => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setProgressCell(null);
    pressStartPosRef.current = null;
  }, []);

  // Clean up on unmount or pause
  useEffect(() => {
    if (isPaused) {
      cancelLongPress();
      setNotesPopupTarget(null);
    }
    return () => {
      cancelLongPress();
    };
  }, [isPaused, cancelLongPress]);

  const selectedValue =
    selectedCell && board[selectedCell.row]?.[selectedCell.col]?.value
      ? board[selectedCell.row][selectedCell.col].value
      : null;

  return (
    <div className="relative w-full max-w-[480px] mx-auto aspect-square select-none">
      {/* CSS Keyframes for smooth 0.5-second (500ms) circular progress indicator */}
      <style>{`
        @keyframes fillSudokuProgress {
          0% {
            stroke-dashoffset: 113.1;
            opacity: 0.6;
          }
          20% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
      `}</style>
      {/* 9x9 Grid Box */}
      <div
        role="grid"
        aria-label="Sudoku Board"
        className="w-full h-full grid grid-cols-9 grid-rows-9 border-2 rounded-xl overflow-hidden shadow-md"
        style={{
          borderColor: 'var(--md-sys-color-grid-border-major)',
          backgroundColor: 'var(--md-sys-color-surface)',
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isSelected =
              (selectedCell?.row === r && selectedCell?.col === c) ||
              (notesPopupTarget?.row === r && notesPopupTarget?.col === c);
            const isSameNumber =
              settings.highlightSameNumbers &&
              selectedValue &&
              cell.value === selectedValue &&
              cell.value !== 0 &&
              !isSelected;

            const isSameUnit =
              settings.highlightRowColBlock &&
              selectedCell &&
              !isSelected &&
              (selectedCell.row === r ||
                selectedCell.col === c ||
                (Math.floor(selectedCell.row / 3) === Math.floor(r / 3) &&
                  Math.floor(selectedCell.col / 3) === Math.floor(c / 3)));

            const isMistake = mistakeCells.some(m => m.row === r && m.col === c);
            const completedCell = completedHighlightCells.find(ch => ch.row === r && ch.col === c);
            const isCompletedUnit = !!completedCell;

            // Logic step highlight checks
            let logicType: 'focus' | 'reference' | 'elimination' | null = null;
            if (activeLogicStep) {
              if (
                activeLogicStep.targetCell.row === r &&
                activeLogicStep.targetCell.col === c
              ) {
                logicType = 'focus';
              } else {
                const inv = activeLogicStep.involvedCells?.find(
                  ic => ic.row === r && ic.col === c
                );
                if (inv) logicType = inv.type || 'reference';
              }
            }

            // Border styling using M3 tokens
            const isBlockRight = (c + 1) % 3 === 0 && c < 8;
            const isBlockBottom = (r + 1) % 3 === 0 && r < 8;

            const borderRightStyle = c < 8 ? {
              borderRightWidth: isBlockRight ? '2px' : '1px',
              borderRightColor: isBlockRight
                ? 'var(--md-sys-color-grid-border-major)'
                : 'var(--md-sys-color-grid-border-minor)',
            } : {};

            const borderBottomStyle = r < 8 ? {
              borderBottomWidth: isBlockBottom ? '2px' : '1px',
              borderBottomColor: isBlockBottom
                ? 'var(--md-sys-color-grid-border-major)'
                : 'var(--md-sys-color-grid-border-minor)',
            } : {};

            // Background priority via CSS Variables / gradients
            let cellBg = 'var(--md-sys-color-surface)';
            if (completedCell) {
              cellBg = completedCell.bgStyle;
            } else if (isSelected) {
              cellBg = 'var(--md-sys-color-cell-selected-bg)';
            } else if (logicType === 'focus') {
              cellBg = 'rgba(245, 158, 11, 0.25)';
            } else if (logicType === 'elimination') {
              cellBg = 'rgba(244, 63, 94, 0.25)';
            } else if (logicType === 'reference') {
              cellBg = 'rgba(14, 116, 144, 0.2)';
            } else if (isMistake) {
              cellBg = 'var(--md-sys-color-cell-error-bg)';
            } else if (isSameNumber) {
              cellBg = 'var(--md-sys-color-cell-match-bg)';
            } else if (isSameUnit) {
              cellBg = 'var(--md-sys-color-cell-unit-bg)';
            }

            // Text color via CSS Variables
            let textColor = 'var(--md-sys-color-cell-given)';
            if (isMistake) {
              textColor = 'var(--md-sys-color-cell-error-text)';
            } else if (!cell.given) {
              textColor = 'var(--md-sys-color-cell-user)';
            }

            const isBeingPressed = progressCell?.row === r && progressCell?.col === c;

            return (
              <button
                key={`${r}-${c}`}
                id={`sudoku-cell-${r}-${c}`}
                type="button"
                role="gridcell"
                aria-label={
                  cell.value !== 0
                    ? `Row ${r + 1}, Column ${c + 1}, ${getSymbolAriaLabel(cell.value, settings.inputMode, settings.customColors)}`
                    : `Row ${r + 1}, Column ${c + 1}, Empty`
                }
                aria-selected={isSelected}
                disabled={isPaused}
                onPointerDown={(e) => {
                  if (isPaused) return;
                  // Immediately update selected cell to pressed cell so visual highlight appears instantaneously
                  onSelectCell(r, c);

                  // Only trigger 0.5-second (500ms) long-press on empty cells
                  if (cell.value === 0) {
                    longPressTriggeredRef.current = false;
                    pressStartPosRef.current = { x: e.clientX, y: e.clientY };
                    const targetBtn = e.currentTarget;
                    cancelLongPress();
                    setProgressCell({ row: r, col: c });

                    longPressTimerRef.current = window.setTimeout(() => {
                      longPressTriggeredRef.current = true;
                      setProgressCell(null);
                      triggerHaptic('success');
                      playSuccessSound(settings.soundEnabled);
                      // Reaffirm selection of this exact cell before opening popup
                      onSelectCell(r, c);
                      const rect = targetBtn.getBoundingClientRect();
                      setNotesPopupTarget({
                        row: r,
                        col: c,
                        rect,
                        currentNotes: [...(cell.notes || [])],
                      });
                    }, 500);
                  }
                }}
                onPointerMove={(e) => {
                  if (pressStartPosRef.current && isBeingPressed) {
                    const dx = Math.abs(e.clientX - pressStartPosRef.current.x);
                    const dy = Math.abs(e.clientY - pressStartPosRef.current.y);
                    if (dx > 10 || dy > 10) {
                      cancelLongPress();
                    }
                  }
                }}
                onPointerUp={() => {
                  const wasTriggered = longPressTriggeredRef.current;
                  cancelLongPress();
                  if (!wasTriggered) {
                    onSelectCell(r, c);
                  }
                }}
                onPointerCancel={cancelLongPress}
                onClick={() => {
                  if (!longPressTriggeredRef.current) {
                    onSelectCell(r, c);
                  }
                }}
                style={{
                  background: cellBg,
                  ...borderRightStyle,
                  ...borderBottomStyle,
                }}
                className={`relative flex items-center justify-center p-0 transition-colors focus:outline-none ${
                  isCompletedUnit ? `ring-2 ring-inset ${completedCell?.ringColor || 'ring-amber-400'} z-20 animate-pulse` : ''
                } ${
                  isSelected && !isCompletedUnit ? 'ring-2 ring-inset z-10' : ''
                } ${
                  logicType === 'focus' ? 'ring-2 ring-inset ring-amber-500 z-10' : ''
                } ${
                  isBeingPressed ? 'ring-2 ring-inset ring-primary z-20' : ''
                }`}
              >
                {/* 0.5-Second Circular Progress Indicator */}
                {isBeingPressed && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <svg className="w-[84%] h-[84%]" viewBox="0 0 44 44">
                      {/* Background Track */}
                      <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        className="opacity-25"
                        style={{ color: 'var(--md-sys-color-primary)' }}
                      />
                      {/* Animated Fill Circle */}
                      <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="var(--md-sys-color-primary)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeDasharray="113.1"
                        strokeDashoffset="113.1"
                        style={{
                          transformOrigin: 'center',
                          transform: 'rotate(-90deg)',
                          animation: 'fillSudokuProgress 500ms linear forwards',
                        }}
                      />
                    </svg>
                  </div>
                )}

                {/* Value Display */}
                {cell.value !== 0 ? (
                  <span
                    className={`text-xl sm:text-2xl font-mono tabular-nums leading-none select-none transition-all duration-300 flex items-center justify-center ${
                      cell.given ? 'font-extrabold' : 'font-bold'
                    } ${
                      completedParadeNumbers?.includes(cell.value)
                        ? 'opacity-0 scale-75'
                        : celebratingNumber === cell.value
                        ? 'opacity-0 scale-90'
                        : ''
                    }`}
                    style={{ color: textColor }}
                  >
                    <SudokuValueDisplay
                      value={cell.value}
                      inputMode={settings.inputMode}
                      customColors={settings.customColors}
                      size="md"
                    />
                  </span>
                ) : cell.notes && cell.notes.length > 0 ? (
                  /* 3x3 Notes Matrix */
                  <div className="w-full h-full p-0.5 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
                      const hasNote = cell.notes.includes(n);
                      const isHighlightedNote =
                        activeLogicStep?.involvedCandidates?.includes(n) &&
                        (logicType === 'focus' || logicType === 'elimination');
                      return (
                        <div
                          key={n}
                          style={{
                            color: isHighlightedNote
                              ? 'var(--md-sys-color-primary)'
                              : 'var(--md-sys-color-cell-note)',
                          }}
                          className={`flex items-center justify-center text-[9px] sm:text-[11px] font-mono leading-none ${
                            hasNote
                              ? isHighlightedNote
                                ? 'font-bold scale-110'
                                : 'font-medium'
                              : 'opacity-0'
                          }`}
                        >
                          <SudokuValueDisplay
                            value={n}
                            inputMode={settings.inputMode}
                            customColors={settings.customColors}
                            isNote
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {/* Conflict / Mistake indicator dot */}
                {isMistake && (
                  <span
                    className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--md-sys-color-error)' }}
                  />
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Paused Overlay */}
      {isPaused && (
        <div
          className="absolute inset-0 rounded-xl backdrop-blur-sm flex flex-col items-center justify-center z-20"
          style={{
            backgroundColor: 'rgba(9, 13, 22, 0.75)',
            color: 'var(--md-sys-color-on-background)',
          }}
        >
          <div className="text-xl font-bold tracking-tight mb-2">Game Paused</div>
          <div className="text-sm opacity-80">Tap Resume to continue</div>
        </div>
      )}

      {/* 3x3 Notes Selection Popup - Multiple Selection Allowed */}
      {notesPopupTarget && (
        <CellNotesPopup
          cellRect={notesPopupTarget.rect}
          currentNotes={notesPopupTarget.currentNotes}
          inputMode={settings.inputMode}
          customColors={settings.customColors}
          onSelectNumber={(num) => {
            if (onToggleCellNote) {
              onToggleCellNote(notesPopupTarget.row, notesPopupTarget.col, num);
            }
            // Keep popup open for multiple selections; toggle number in currentNotes
            setNotesPopupTarget(prev => {
              if (!prev) return null;
              const has = prev.currentNotes.includes(num);
              const nextNotes = has
                ? prev.currentNotes.filter(n => n !== num)
                : [...prev.currentNotes, num].sort((a, b) => a - b);
              return {
                ...prev,
                currentNotes: nextNotes,
              };
            });
          }}
          onClose={() => setNotesPopupTarget(null)}
        />
      )}
    </div>
  );
};
