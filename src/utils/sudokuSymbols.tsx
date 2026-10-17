import React from 'react';

export type SudokuInputMode = 'numbers' | 'symbols';

export interface SudokuSymbolMeta {
  value: number;
  name: string;
  ariaLabel: string;
  pathData: string;
}

/**
 * Fixed Sudoku Symbol Mapping:
 * 1 -> Filled Square
 * 2 -> Filled Circle
 * 3 -> Filled Triangle
 * 4 -> Five-pointed Star
 * 5 -> Filled Hexagon
 * 6 -> Filled Diamond
 * 7 -> Filled Octagon
 * 8 -> Crescent Moon
 * 9 -> Heart
 */
export const SUDOKU_SYMBOLS: Record<number, SudokuSymbolMeta> = {
  1: {
    value: 1,
    name: 'Filled Square',
    ariaLabel: 'Number 1, filled square',
    pathData: 'M4 4h16v16H4z',
  },
  2: {
    value: 2,
    name: 'Filled Circle',
    ariaLabel: 'Number 2, filled circle',
    pathData: 'M12 3a9 9 0 1 1-0.01 0z',
  },
  3: {
    value: 3,
    name: 'Filled Triangle',
    ariaLabel: 'Number 3, filled triangle',
    pathData: 'M12 3.5 21 19.5H3z',
  },
  4: {
    value: 4,
    name: 'Five-pointed Star',
    ariaLabel: 'Number 4, five-pointed star',
    pathData: 'M12 2.5l2.9 6.3 6.9.9-5.1 4.7 1.3 6.8L12 17.9l-6 3.3 1.3-6.8-5.1-4.7 6.9-.9z',
  },
  5: {
    value: 5,
    name: 'Filled Hexagon',
    ariaLabel: 'Number 5, filled hexagon',
    pathData: 'M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z',
  },
  6: {
    value: 6,
    name: 'Filled Diamond',
    ariaLabel: 'Number 6, filled diamond',
    pathData: 'M12 2.8 20.2 12 12 21.2 3.8 12z',
  },
  7: {
    value: 7,
    name: 'Filled Octagon',
    ariaLabel: 'Number 7, filled octagon',
    pathData: 'M7.2 3h9.6L21 7.2v9.6L16.8 21H7.2L3 16.8V7.2z',
  },
  8: {
    value: 8,
    name: 'Crescent Moon',
    ariaLabel: 'Number 8, crescent moon',
    pathData: 'M13 3c-4.4 1.2-7.5 5.1-7.5 9.8 0 5.2 4.3 9.4 9.5 9.4 2.6 0 4.9-1.1 6.5-2.8-5.3-.1-9.5-4.4-9.5-9.6 0-2.7 1.1-5.1 2.8-6.8-.6 0-1.2 0-1.8 0z',
  },
  9: {
    value: 9,
    name: 'Heart',
    ariaLabel: 'Number 9, heart',
    pathData: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  },
};

// Cached Path2D objects for Canvas 2D rendering
const cachedPaths: Record<number, Path2D> = {};

function getCachedPath(num: number): Path2D | null {
  if (typeof Path2D === 'undefined') return null;
  if (!cachedPaths[num] && SUDOKU_SYMBOLS[num]) {
    cachedPaths[num] = new Path2D(SUDOKU_SYMBOLS[num].pathData);
  }
  return cachedPaths[num] || null;
}

/**
 * Draw a vector symbol directly onto an HTML5 Canvas 2D context.
 * Used for hardware-accelerated animations (motion trails, ghost echoes, etc.).
 */
export function drawSymbolOnCanvas(
  ctx: CanvasRenderingContext2D,
  num: number,
  x: number,
  y: number,
  size: number,
  fillColor: string = '#ffffff'
): void {
  const path = getCachedPath(num);
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 24;
  ctx.scale(scale, scale);
  // Center of 24x24 box is (12, 12)
  ctx.translate(-12, -12);
  ctx.fillStyle = fillColor;

  if (path) {
    ctx.fill(path);
  } else {
    // Fallback if Path2D is somehow unavailable
    ctx.font = `bold ${Math.round(size * 0.7)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(num), 12, 12);
  }
  ctx.restore();
}

export function getSymbolMeta(num: number): SudokuSymbolMeta | undefined {
  return SUDOKU_SYMBOLS[num];
}

export function getSymbolName(num: number): string {
  return SUDOKU_SYMBOLS[num]?.name || String(num);
}

export function getSymbolAriaLabel(num: number, inputMode?: SudokuInputMode): string {
  if (inputMode === 'symbols') {
    return SUDOKU_SYMBOLS[num]?.ariaLabel || `Number ${num}`;
  }
  return `Number ${num}`;
}

export interface SudokuSymbolProps {
  value: number;
  className?: string;
  size?: number | string;
  color?: string;
  title?: string;
}

/**
 * Reusable vector SVG symbol component.
 */
export const SudokuSymbol: React.FC<SudokuSymbolProps> = ({
  value,
  className = 'w-full h-full',
  size,
  color = 'currentColor',
  title,
}) => {
  const meta = SUDOKU_SYMBOLS[value];
  if (!meta) return null;

  const style: React.CSSProperties = {};
  if (size) {
    style.width = typeof size === 'number' ? `${size}px` : size;
    style.height = typeof size === 'number' ? `${size}px` : size;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill={color}
      className={`inline-block shrink-0 select-none ${className}`}
      style={style}
      aria-hidden={!title}
      aria-label={title || meta.ariaLabel}
      role="img"
    >
      {title && <title>{title}</title>}
      <path d={meta.pathData} fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
};

export interface SudokuValueDisplayProps {
  value: number;
  inputMode?: SudokuInputMode;
  className?: string;
  isNote?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Unified value display: renders either standard number (1-9) or vector symbol based on inputMode.
 */
export const SudokuValueDisplay: React.FC<SudokuValueDisplayProps> = ({
  value,
  inputMode = 'numbers',
  className = '',
  isNote = false,
  size = 'md',
}) => {
  if (!value || value < 1 || value > 9) return null;

  if (inputMode === 'symbols') {
    let symbolClass = 'w-5 h-5';
    if (isNote) {
      symbolClass = 'w-2 h-2 sm:w-2.5 sm:h-2.5';
    } else if (size === 'xs') {
      symbolClass = 'w-3 h-3';
    } else if (size === 'sm') {
      symbolClass = 'w-4 h-4';
    } else if (size === 'md') {
      symbolClass = 'w-5 h-5 sm:w-6 sm:h-6';
    } else if (size === 'lg') {
      symbolClass = 'w-6 h-6 sm:w-7 sm:h-7';
    } else if (size === 'xl') {
      symbolClass = 'w-7 h-7 sm:w-8 sm:h-8';
    }

    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        <SudokuSymbol value={value} className={symbolClass} />
      </span>
    );
  }

  return <span className={className}>{value}</span>;
};
