import React from 'react';

export interface SudokuFruitMeta {
  value: number;
  name: string;
  ariaLabel: string;
  primaryColor: string;
  description: string;
}

/**
 * Mandatory fixed mapping for Fruit Mode:
 * 1 -> Mango      (Ripe mango)
 * 2 -> Banana     (Yellow banana)
 * 3 -> Apple      (Red apple)
 * 4 -> Orange     (Orange fruit)
 * 5 -> Strawberry (Red strawberry)
 * 6 -> Grapes     (Purple grape bunch)
 * 7 -> Watermelon (Watermelon slice)
 * 8 -> Pineapple  (Pineapple)
 * 9 -> Cherry     (Pair of cherries)
 */
export const SUDOKU_FRUITS: Record<number, SudokuFruitMeta> = {
  1: {
    value: 1,
    name: 'Mango',
    ariaLabel: 'Value 1, ripe mango',
    primaryColor: '#F59E0B',
    description: 'Golden ripe mango with fresh green leaf',
  },
  2: {
    value: 2,
    name: 'Banana',
    ariaLabel: 'Value 2, yellow banana',
    primaryColor: '#FACC15',
    description: 'Curved yellow banana',
  },
  3: {
    value: 3,
    name: 'Apple',
    ariaLabel: 'Value 3, red apple',
    primaryColor: '#EF4444',
    description: 'Crisp red apple with stem and leaf',
  },
  4: {
    value: 4,
    name: 'Orange',
    ariaLabel: 'Value 4, orange fruit',
    primaryColor: '#FB923C',
    description: 'Sunny orange citrus fruit with leaf',
  },
  5: {
    value: 5,
    name: 'Strawberry',
    ariaLabel: 'Value 5, red strawberry',
    primaryColor: '#F43F5E',
    description: 'Seed-studded red strawberry with leafy calyx',
  },
  6: {
    value: 6,
    name: 'Grapes',
    ariaLabel: 'Value 6, purple grape bunch',
    primaryColor: '#9333EA',
    description: 'Cluster of glossy purple grapes',
  },
  7: {
    value: 7,
    name: 'Watermelon',
    ariaLabel: 'Value 7, watermelon slice',
    primaryColor: '#10B981',
    description: 'Juicy watermelon slice with green rind and seeds',
  },
  8: {
    value: 8,
    name: 'Pineapple',
    ariaLabel: 'Value 8, pineapple',
    primaryColor: '#EAB308',
    description: 'Golden textured pineapple with spiky crown',
  },
  9: {
    value: 9,
    name: 'Cherry',
    ariaLabel: 'Value 9, pair of cherries',
    primaryColor: '#DC2626',
    description: 'Twin pair of ruby red cherries on stems',
  },
};

export function getFruitMeta(num: number): SudokuFruitMeta | undefined {
  return SUDOKU_FRUITS[num];
}

export function getFruitName(num: number): string {
  return SUDOKU_FRUITS[num]?.name || `Fruit ${num}`;
}

export function getFruitAriaLabel(num: number): string {
  return SUDOKU_FRUITS[num]?.ariaLabel || `Value ${num}, fruit`;
}

/**
 * Raw SVG string templates for instant offline Canvas drawing and 60fps animations.
 */
export const FRUIT_SVG_STRINGS: Record<number, string> = {
  // 1: Mango
  1: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="m-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDE047"/>
        <stop offset="45%" stop-color="#F59E0B"/>
        <stop offset="100%" stop-color="#EA580C"/>
      </linearGradient>
    </defs>
    <!-- Leaf -->
    <path d="M16 6 C19 3 24 3 26 6 C24 8 20 8 16 6 Z" fill="#22C55E"/>
    <path d="M17 5.5 C20 4.5 23 5 25 6" stroke="#15803D" stroke-width="0.75" fill="none"/>
    <!-- Stem -->
    <path d="M16 7 C15.5 5 15 3.5 13.5 2" stroke="#78350F" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    <!-- Mango Body -->
    <path d="M16.5 6.5 C22.5 6.5 27 11.5 26 19 C25 25 19.5 28.5 14.5 28.5 C9 28.5 5.5 23.5 6.5 16 C7.5 9 11.5 6.5 16.5 6.5 Z" fill="url(#m-grad)"/>
    <!-- Blush Highlight -->
    <path d="M10 13 C9.5 17 11 22 13 24" stroke="#FEF08A" stroke-width="1.8" stroke-linecap="round" opacity="0.6" fill="none"/>
  </svg>`,

  // 2: Banana
  2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="b-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FEF08A"/>
        <stop offset="40%" stop-color="#FACC15"/>
        <stop offset="100%" stop-color="#EAB308"/>
      </linearGradient>
    </defs>
    <!-- Banana Body -->
    <path d="M6 22.5 C8 25.5 14 26.5 21 21.5 C26 17.5 27.5 11 26.5 6.5 C25.5 7 24 8 22 10 C17.5 14.5 11 18.5 6 22.5 Z" fill="url(#b-grad)"/>
    <!-- Ridge Line -->
    <path d="M6 22.5 C12 21 18 16.5 23 10" stroke="#CA8A04" stroke-width="1.2" fill="none" opacity="0.8"/>
    <!-- Inner Highlight -->
    <path d="M10 22 C15 19 20 15 24 9" stroke="#FEF9C3" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7"/>
    <!-- Stem Tip -->
    <path d="M26.5 6.5 L28 4.5" stroke="#713F12" stroke-width="2" stroke-linecap="round"/>
    <!-- Bottom Tip -->
    <circle cx="5.8" cy="22.8" r="1.2" fill="#713F12"/>
  </svg>`,

  // 3: Apple
  3: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="a-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F87171"/>
        <stop offset="40%" stop-color="#EF4444"/>
        <stop offset="100%" stop-color="#B91C1C"/>
      </linearGradient>
    </defs>
    <!-- Leaf -->
    <path d="M16 6 C19.5 3.5 23.5 4.5 25 7 C22 8.5 18 8 16 6 Z" fill="#22C55E"/>
    <!-- Stem -->
    <path d="M16 9 C16.5 6 17.5 4 19 2.5" stroke="#78350F" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    <!-- Apple Body -->
    <path d="M16 8.5 C12 4.5 5 7.5 5 15.5 C5 23.5 11 28.5 16 27.5 C21 28.5 27 23.5 27 15.5 C27 7.5 20 4.5 16 8.5 Z" fill="url(#a-grad)"/>
    <!-- Glossy Highlight -->
    <path d="M9 11 C7.5 14 7.5 19 9 22" stroke="#FCA5A5" stroke-width="2" stroke-linecap="round" opacity="0.6" fill="none"/>
    <circle cx="10" cy="12" r="1.5" fill="#FFFFFF" opacity="0.75"/>
  </svg>`,

  // 4: Orange
  4: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="o-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDBA74"/>
        <stop offset="45%" stop-color="#FB923C"/>
        <stop offset="100%" stop-color="#EA580C"/>
      </linearGradient>
    </defs>
    <!-- Leaf -->
    <path d="M16 5 C19.5 2.5 24 3.5 25.5 6 C22.5 7.5 18.5 7 16 5 Z" fill="#22C55E"/>
    <path d="M16 6 L15 3.5" stroke="#78350F" stroke-width="1.6" stroke-linecap="round"/>
    <!-- Orange Sphere -->
    <circle cx="16" cy="17" r="11" fill="url(#o-grad)"/>
    <!-- Dimple Texture Dots -->
    <circle cx="12" cy="13" r="0.7" fill="#C2410C" opacity="0.6"/>
    <circle cx="19" cy="14" r="0.7" fill="#C2410C" opacity="0.6"/>
    <circle cx="15" cy="20" r="0.7" fill="#C2410C" opacity="0.6"/>
    <circle cx="21" cy="21" r="0.7" fill="#C2410C" opacity="0.6"/>
    <circle cx="10" cy="18" r="0.7" fill="#C2410C" opacity="0.6"/>
    <!-- Glossy Sheen -->
    <path d="M10 13 C12 9.5 17 9 20 11" stroke="#FFEDD5" stroke-width="1.8" stroke-linecap="round" opacity="0.6" fill="none"/>
  </svg>`,

  // 5: Strawberry
  5: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="sb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FB7185"/>
        <stop offset="45%" stop-color="#F43F5E"/>
        <stop offset="100%" stop-color="#BE123C"/>
      </linearGradient>
    </defs>
    <!-- Berry Body -->
    <path d="M16 28.5 C13 28.5 6 22 6 13.5 C6 8.5 11 7 16 8 C21 7 26 8.5 26 13.5 C26 22 19 28.5 16 28.5 Z" fill="url(#sb-grad)"/>
    <!-- Yellow Seeds -->
    <circle cx="12" cy="12" r="0.8" fill="#FEF08A"/>
    <circle cx="16" cy="11.5" r="0.8" fill="#FEF08A"/>
    <circle cx="20" cy="12" r="0.8" fill="#FEF08A"/>
    <circle cx="9.5" cy="16" r="0.8" fill="#FEF08A"/>
    <circle cx="14" cy="16" r="0.8" fill="#FEF08A"/>
    <circle cx="18" cy="16" r="0.8" fill="#FEF08A"/>
    <circle cx="22.5" cy="16" r="0.8" fill="#FEF08A"/>
    <circle cx="12" cy="20.5" r="0.8" fill="#FEF08A"/>
    <circle cx="16" cy="20" r="0.8" fill="#FEF08A"/>
    <circle cx="20" cy="20.5" r="0.8" fill="#FEF08A"/>
    <circle cx="14" cy="24.5" r="0.8" fill="#FEF08A"/>
    <circle cx="18" cy="24.5" r="0.8" fill="#FEF08A"/>
    <!-- Leafy Calyx Crown -->
    <path d="M16 5 L16 3" stroke="#15803D" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M16 8 L11 5 C13 8 13 9 13 10 C14 8 15 8 16 8 C17 8 18 8 19 10 C19 9 19 8 21 5 Z" fill="#22C55E"/>
    <path d="M16 8 C14 10 9 10 7 8 C10 11 13 10 16 8 Z" fill="#16A34A"/>
    <path d="M16 8 C18 10 23 10 25 8 C22 11 19 10 16 8 Z" fill="#16A34A"/>
  </svg>`,

  // 6: Grapes
  6: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="g-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#C084FC"/>
        <stop offset="50%" stop-color="#9333EA"/>
        <stop offset="100%" stop-color="#6B21A8"/>
      </linearGradient>
    </defs>
    <!-- Vine & Leaf -->
    <path d="M16 7 C16 4.5 17 3 19 2.5" stroke="#78350F" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    <path d="M16 6 C13 4 9 4.5 8 7 C11 8 14 7.5 16 6 Z" fill="#22C55E"/>
    <!-- Grape Berries Cluster -->
    <!-- Top Row -->
    <circle cx="11" cy="9.5" r="3.2" fill="url(#g-grad)"/>
    <circle cx="16" cy="9" r="3.2" fill="url(#g-grad)"/>
    <circle cx="21" cy="9.5" r="3.2" fill="url(#g-grad)"/>
    <!-- Row 2 -->
    <circle cx="8.5" cy="14.5" r="3.3" fill="url(#g-grad)"/>
    <circle cx="13.5" cy="14" r="3.3" fill="url(#g-grad)"/>
    <circle cx="18.5" cy="14" r="3.3" fill="url(#g-grad)"/>
    <circle cx="23.5" cy="14.5" r="3.3" fill="url(#g-grad)"/>
    <!-- Row 3 -->
    <circle cx="11" cy="19" r="3.3" fill="url(#g-grad)"/>
    <circle cx="16" cy="19" r="3.3" fill="url(#g-grad)"/>
    <circle cx="21" cy="19" r="3.3" fill="url(#g-grad)"/>
    <!-- Row 4 -->
    <circle cx="13.5" cy="23.5" r="3.2" fill="url(#g-grad)"/>
    <circle cx="18.5" cy="23.5" r="3.2" fill="url(#g-grad)"/>
    <!-- Bottom Berry -->
    <circle cx="16" cy="27.5" r="3" fill="url(#g-grad)"/>
    <!-- Highlights -->
    <circle cx="12.5" cy="13" r="0.9" fill="#E9D5FF" opacity="0.8"/>
    <circle cx="17.5" cy="13" r="0.9" fill="#E9D5FF" opacity="0.8"/>
    <circle cx="15" cy="18" r="0.9" fill="#E9D5FF" opacity="0.8"/>
  </svg>`,

  // 7: Watermelon
  7: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <!-- Outer Dark Green Rind -->
    <path d="M4 11 C8 24.5 24 24.5 28 11 C25 21 7 21 4 11 Z" fill="#15803D"/>
    <!-- Inner White/Pale Pith -->
    <path d="M5 11 C8.5 22.5 23.5 22.5 27 11 C24.5 19.5 7.5 19.5 5 11 Z" fill="#DCFCE7"/>
    <!-- Red Juicy Flesh -->
    <path d="M6 11 C9 20.5 23 20.5 26 11 Z" fill="#EF4444"/>
    <!-- Seeds -->
    <ellipse cx="11" cy="13" rx="0.8" ry="1.4" transform="rotate(-18 11 13)" fill="#18181B"/>
    <ellipse cx="16" cy="14" rx="0.8" ry="1.4" fill="#18181B"/>
    <ellipse cx="21" cy="13" rx="0.8" ry="1.4" transform="rotate(18 21 13)" fill="#18181B"/>
    <ellipse cx="13.5" cy="16.5" rx="0.8" ry="1.4" transform="rotate(-10 13.5 16.5)" fill="#18181B"/>
    <ellipse cx="18.5" cy="16.5" rx="0.8" ry="1.4" transform="rotate(10 18.5 16.5)" fill="#18181B"/>
  </svg>`,

  // 8: Pineapple
  8: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="pa-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDE047"/>
        <stop offset="50%" stop-color="#F59E0B"/>
        <stop offset="100%" stop-color="#B45309"/>
      </linearGradient>
    </defs>
    <!-- Spiky Crown Leaves -->
    <path d="M16 12 L16 3 C15 6 13 8 11 9 C13 7 14 5 13 2 C15 5 16 8 16 12 Z" fill="#15803D"/>
    <path d="M16 12 L16 3 C17 6 19 8 21 9 C19 7 18 5 19 2 C17 5 16 8 16 12 Z" fill="#16A34A"/>
    <path d="M16 12 C14 9 9 9 7 8 C10 11 13 12 16 12 Z" fill="#22C55E"/>
    <path d="M16 12 C18 9 23 9 25 8 C22 11 19 12 16 12 Z" fill="#22C55E"/>
    <!-- Oval Pineapple Body -->
    <rect x="8.5" y="11.5" width="15" height="17" rx="7.5" fill="url(#pa-grad)"/>
    <!-- Cross-hatch Diamond Texture Lines -->
    <path d="M10 15 L22 25" stroke="#78350F" stroke-width="0.9" opacity="0.6"/>
    <path d="M9 20 L19 28" stroke="#78350F" stroke-width="0.9" opacity="0.6"/>
    <path d="M13 12 L23 20" stroke="#78350F" stroke-width="0.9" opacity="0.6"/>
    <path d="M22 15 L10 25" stroke="#78350F" stroke-width="0.9" opacity="0.6"/>
    <path d="M23 20 L13 28" stroke="#78350F" stroke-width="0.9" opacity="0.6"/>
    <path d="M19 12 L9 20" stroke="#78350F" stroke-width="0.9" opacity="0.6"/>
    <!-- Center scale dots -->
    <circle cx="16" cy="18" r="0.75" fill="#FEF08A"/>
    <circle cx="12" cy="20" r="0.75" fill="#FEF08A"/>
    <circle cx="20" cy="20" r="0.75" fill="#FEF08A"/>
    <circle cx="16" cy="23" r="0.75" fill="#FEF08A"/>
  </svg>`,

  // 9: Cherry
  9: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="ch-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F87171"/>
        <stop offset="40%" stop-color="#DC2626"/>
        <stop offset="100%" stop-color="#881337"/>
      </linearGradient>
    </defs>
    <!-- Joined Leaf -->
    <path d="M17 3.5 C20.5 1 25 2.5 26.5 5.5 C23 7 19 6 17 3.5 Z" fill="#22C55E"/>
    <!-- Arched Stems -->
    <path d="M10 20 C10 11.5 14 5.5 17 3.5" stroke="#15803D" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    <path d="M22 19 C21 11 18 5.5 17 3.5" stroke="#15803D" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    <!-- Left Cherry -->
    <circle cx="10" cy="22" r="6" fill="url(#ch-grad)"/>
    <circle cx="8" cy="19.5" r="1.3" fill="#FFFFFF" opacity="0.75"/>
    <path d="M7 23 C7.5 25 9.5 26.5 11.5 26.5" stroke="#FECDD3" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.5"/>
    <!-- Right Cherry -->
    <circle cx="22" cy="21" r="6" fill="url(#ch-grad)"/>
    <circle cx="20" cy="18.5" r="1.3" fill="#FFFFFF" opacity="0.75"/>
    <path d="M19 22 C19.5 24 21.5 25.5 23.5 25.5" stroke="#FECDD3" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.5"/>
  </svg>`,
};

// Cached Image elements for Hardware-Accelerated Canvas Rendering
const cachedFruitImages: Record<number, HTMLImageElement> = {};

if (typeof window !== 'undefined') {
  Object.entries(FRUIT_SVG_STRINGS).forEach(([valStr, svgStr]) => {
    const num = Number(valStr);
    const img = new Image();
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;
    cachedFruitImages[num] = img;
  });
}

/**
 * Draw a fruit directly onto an HTML5 Canvas 2D context.
 * Used for hardware-accelerated animations (motion trails, ghost echoes, etc.).
 */
export function drawFruitOnCanvas(
  ctx: CanvasRenderingContext2D,
  num: number,
  x: number,
  y: number,
  size: number
): void {
  const img = cachedFruitImages[num];
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.save();
    ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    ctx.restore();
    return;
  }

  // Fallback if image not yet loaded: draw iconic fruit colored badge
  const meta = SUDOKU_FRUITS[num];
  const color = meta?.primaryColor || '#F59E0B';
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size * 0.45, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();
}

export interface SudokuFruitProps {
  value: number;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  title?: string;
  isNote?: boolean;
}

/**
 * High-definition vector SVG component for Fruit Mode.
 * Sized and centered consistently across all nine fruits.
 */
export const SudokuFruit: React.FC<SudokuFruitProps> = ({
  value,
  className = '',
  size = 'md',
  title,
  isNote = false,
}) => {
  const meta = SUDOKU_FRUITS[value];
  if (!meta) return null;

  let sizeClasses = 'w-6 h-6 sm:w-7 sm:h-7';
  if (isNote || size === 'xs') {
    sizeClasses = 'w-3 h-3 sm:w-3.5 sm:h-3.5';
  } else if (size === 'sm') {
    sizeClasses = 'w-4 h-4 sm:w-5 sm:h-5';
  } else if (size === 'md') {
    sizeClasses = 'w-6 h-6 sm:w-7 sm:h-7';
  } else if (size === 'lg') {
    sizeClasses = 'w-7 h-7 sm:w-8 sm:h-8';
  } else if (size === 'xl') {
    sizeClasses = 'w-8 h-8 sm:w-10 sm:h-10';
  }

  const style: React.CSSProperties = {};
  if (typeof size === 'number') {
    style.width = `${size}px`;
    style.height = `${size}px`;
  }

  const ariaLabel = title || meta.ariaLabel;
  const svgHtml = FRUIT_SVG_STRINGS[value];

  if (!svgHtml) return null;

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      title={title || `${meta.name} (Value ${value})`}
      style={style}
      className={`inline-flex items-center justify-center shrink-0 select-none transition-transform hover:scale-105 ${typeof size === 'number' ? '' : sizeClasses} ${className}`}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
};
