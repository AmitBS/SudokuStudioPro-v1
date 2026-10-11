import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../theme/themeContext';

interface CellNotesPopupProps {
  cellRect: DOMRect;
  currentNotes: number[];
  onSelectNumber: (num: number) => void;
  onClose: () => void;
}

export const CellNotesPopup: React.FC<CellNotesPopupProps> = ({
  cellRect,
  currentNotes,
  onSelectNumber,
  onClose,
}) => {
  const { tokens } = useTheme();
  const popupRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    const popupWidth = 168;
    const popupHeight = 168;
    const padding = 12;

    // Center horizontally over the cell, clamped within screen boundaries
    let left = cellRect.left + cellRect.width / 2 - popupWidth / 2;
    left = Math.max(padding, Math.min(window.innerWidth - popupWidth - padding, left));

    // Place above if there is enough headroom, otherwise place below
    let top = cellRect.top - popupHeight - 10;
    if (top < padding + 40) {
      // Place below the cell
      top = cellRect.bottom + 10;
    }

    // Ensure it doesn't push off the bottom edge
    top = Math.max(padding, Math.min(window.innerHeight - popupHeight - padding, top));

    setCoords({ top, left });
  }, [cellRect]);

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Invisible dismiss backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
        onTouchStart={onClose}
        aria-hidden="true"
      />

      {/* Floating 3x3 Notes Matrix */}
      <div
        ref={popupRef}
        role="dialog"
        aria-label="Select note to add or remove"
        className="absolute rounded-2xl shadow-2xl overflow-hidden border-2 animate-in zoom-in-95 fade-in duration-150"
        style={{
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          width: '168px',
          height: '168px',
          backgroundColor: 'var(--md-sys-color-surface-container-high)',
          borderColor: 'var(--md-sys-color-primary)',
          boxShadow: '0 12px 36px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 3x3 Grid with crisp interior borders */}
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 bg-neutral-300 dark:bg-neutral-700 gap-[1px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
            const isNotePresent = currentNotes.includes(num);

            return (
              <button
                key={num}
                type="button"
                onClick={() => onSelectNumber(num)}
                aria-label={`Toggle note ${num}${isNotePresent ? ' (currently active)' : ''}`}
                style={{
                  backgroundColor: isNotePresent
                    ? 'var(--md-sys-color-primary)'
                    : 'var(--md-sys-color-surface)',
                  color: isNotePresent
                    ? 'var(--md-sys-color-on-primary)'
                    : 'var(--md-sys-color-on-surface)',
                }}
                className={`relative flex flex-col items-center justify-center transition-all active:scale-95 select-none focus:outline-none ${
                  isNotePresent
                    ? 'font-extrabold shadow-inner'
                    : 'font-bold hover:opacity-85'
                }`}
              >
                <span className="text-lg font-mono leading-none">{num}</span>
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
