import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../theme/themeContext';
import { SudokuInputMode } from '../../types/sudoku';
import { SudokuValueDisplay, getSymbolAriaLabel } from '../../utils/sudokuSymbols';

interface CellNotesPopupProps {
  cellRect: DOMRect;
  currentNotes: number[];
  onSelectNumber: (num: number) => void;
  onClose: () => void;
  inputMode?: SudokuInputMode;
  customColors?: Record<number, string>;
}

export const CellNotesPopup: React.FC<CellNotesPopupProps> = ({
  cellRect,
  currentNotes,
  onSelectNumber,
  onClose,
  inputMode = 'numbers',
  customColors,
}) => {
  const { tokens } = useTheme();
  const popupRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; startLeft: number; startTop: number } | null>(null);

  const POPUP_WIDTH = 176;
  const POPUP_HEIGHT = 202;
  const MARGIN = 10;

  // Initialize position near the pressed cell without covering surrounding cells unnecessarily
  useEffect(() => {
    const vWidth = window.innerWidth;
    const vHeight = window.innerHeight;
    const isLandscape = vWidth > vHeight && vWidth >= 640;

    let left = 0;
    let top = 0;

    if (isLandscape) {
      // In landscape orientation: prefer placing popup to the right or left of the cell/board
      const spaceRight = vWidth - cellRect.right;
      const spaceLeft = cellRect.left;

      if (spaceRight >= POPUP_WIDTH + MARGIN) {
        left = cellRect.right + 12;
      } else if (spaceLeft >= POPUP_WIDTH + MARGIN) {
        left = cellRect.left - POPUP_WIDTH - 12;
      } else {
        left = cellRect.left + cellRect.width / 2 - POPUP_WIDTH / 2;
      }

      // Vertically center with the cell, clamped within viewport
      top = cellRect.top + cellRect.height / 2 - POPUP_HEIGHT / 2;
    } else {
      // In portrait orientation: prefer placement below or above the cell
      const spaceBelow = vHeight - cellRect.bottom;
      const spaceAbove = cellRect.top;

      if (spaceBelow >= POPUP_HEIGHT + 16) {
        top = cellRect.bottom + 10;
      } else if (spaceAbove >= POPUP_HEIGHT + 16) {
        top = cellRect.top - POPUP_HEIGHT - 10;
      } else {
        top = spaceBelow >= spaceAbove ? cellRect.bottom + 6 : cellRect.top - POPUP_HEIGHT - 6;
      }

      // Horizontally center on the cell
      left = cellRect.left + cellRect.width / 2 - POPUP_WIDTH / 2;
    }

    // Strict boundary clamping so all 9 choices are 100% visible and never clipped
    left = Math.max(MARGIN, Math.min(vWidth - POPUP_WIDTH - MARGIN, left));
    top = Math.max(MARGIN, Math.min(vHeight - POPUP_HEIGHT - MARGIN, top));

    setCoords({ top, left });
  }, [cellRect]);

  // Ensure popup stays strictly within boundaries on viewport resize
  useEffect(() => {
    const handleResize = () => {
      setCoords(prev => ({
        left: Math.max(MARGIN, Math.min(window.innerWidth - POPUP_WIDTH - MARGIN, prev.left)),
        top: Math.max(MARGIN, Math.min(window.innerHeight - POPUP_HEIGHT - MARGIN, prev.top)),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Draggable Pointer Event Handlers
  const handleDragPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startLeft: coords.left,
      startTop: coords.top,
    };
  };

  const handleDragPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const deltaX = e.clientX - dragStartRef.current.clientX;
    const deltaY = e.clientY - dragStartRef.current.clientY;

    const nextLeft = dragStartRef.current.startLeft + deltaX;
    const nextTop = dragStartRef.current.startTop + deltaY;

    const clampedLeft = Math.max(MARGIN, Math.min(window.innerWidth - POPUP_WIDTH - MARGIN, nextLeft));
    const clampedTop = Math.max(MARGIN, Math.min(window.innerHeight - POPUP_HEIGHT - MARGIN, nextTop));

    setCoords({
      left: clampedLeft,
      top: clampedTop,
    });
  };

  const handleDragPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      setIsDragging(false);
      dragStartRef.current = null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Tap-outside-to-close dismiss backdrop */}
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-[1px] transition-opacity cursor-pointer"
        onClick={onClose}
        onPointerDown={onClose}
        aria-hidden="true"
      />

      {/* Floating 3x3 Notes Matrix (Draggable) */}
      <div
        ref={popupRef}
        role="dialog"
        aria-label="Draggable 3x3 Notes Matrix"
        className={`absolute rounded-2xl shadow-2xl overflow-hidden border-2 animate-in zoom-in-95 fade-in duration-150 flex flex-col ${
          isDragging ? 'shadow-cyan-500/20 ring-2 ring-primary scale-[1.02]' : ''
        }`}
        style={{
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          width: `${POPUP_WIDTH}px`,
          height: `${POPUP_HEIGHT}px`,
          backgroundColor: 'var(--md-sys-color-surface-container-high)',
          borderColor: 'var(--md-sys-color-primary)',
          boxShadow: '0 14px 40px -4px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        }}
        onClick={e => e.stopPropagation()}
        onPointerDown={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
      >
        {/* Drag Handle Bar Header */}
        <div
          onPointerDown={handleDragPointerDown}
          onPointerMove={handleDragPointerMove}
          onPointerUp={handleDragPointerUp}
          onPointerCancel={handleDragPointerUp}
          className="w-full h-7 flex items-center justify-between px-2.5 select-none touch-none cursor-grab active:cursor-grabbing border-b shrink-0 transition-colors"
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-highest)',
            borderColor: 'var(--md-sys-color-outline-variant)',
            color: 'var(--md-sys-color-on-surface-variant)',
          }}
          title="Drag to reposition anywhere on screen"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Notes
            </span>
          </div>

          {/* Grab indicator pill */}
          <div className="w-9 h-1 rounded-full bg-current opacity-40" />

          <span className="text-[9px] font-semibold opacity-60">
            Drag
          </span>
        </div>

        {/* 3x3 Grid with crisp interior borders */}
        <div className="w-full flex-1 grid grid-cols-3 grid-rows-3 bg-neutral-300 dark:bg-neutral-700 gap-[1px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
            const isNotePresent = currentNotes.includes(num);
            const labelText = getSymbolAriaLabel(num, inputMode, customColors);

            return (
              <button
                key={num}
                type="button"
                onClick={() => onSelectNumber(num)}
                aria-label={`Toggle note ${labelText}${isNotePresent ? ' (currently active)' : ''}`}
                style={{
                  backgroundColor: isNotePresent
                    ? 'var(--md-sys-color-primary)'
                    : 'var(--md-sys-color-surface)',
                  color: isNotePresent
                    ? 'var(--md-sys-color-on-primary)'
                    : 'var(--md-sys-color-on-surface)',
                }}
                className={`relative flex flex-col items-center justify-center p-2 transition-all active:scale-95 select-none focus:outline-none ${
                  isNotePresent
                    ? 'font-extrabold shadow-inner'
                    : 'font-bold hover:opacity-85'
                }`}
              >
                <SudokuValueDisplay value={num} inputMode={inputMode} customColors={customColors} size="md" />
                {isNotePresent && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
