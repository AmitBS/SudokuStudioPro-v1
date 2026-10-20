import React from 'react';

export interface SudokuFruitMeta {
  value: number;
  name: string;
  ariaLabel: string;
  primaryColor: string;
  description: string;
}

/**
 * 9 Unique Fruits with 9 Distinct Colors across the visual spectrum:
 * 1 -> Mango        (Golden Amber   - #F59E0B) [Mandatory]
 * 2 -> Banana       (Bright Yellow  - #FACC15) [Mandatory]
 * 3 -> Apple        (Crimson Red    - #EF4444) [Mandatory]
 * 4 -> Orange       (Vivid Orange   - #EA580C)
 * 5 -> Kiwi         (Lime Green     - #22C55E)
 * 6 -> Grapes       (Royal Purple   - #9333EA)
 * 7 -> Blueberry    (Sapphire Blue  - #2563EB)
 * 8 -> Dragonfruit  (Hot Pink       - #EC4899)
 * 9 -> Coconut      (Earthy Brown   - #78350F)
 */
export const SUDOKU_FRUITS: Record<number, SudokuFruitMeta> = {
  1: {
    value: 1,
    name: 'Mango',
    ariaLabel: 'Value 1, golden mango',
    primaryColor: '#F59E0B',
    description: 'Golden tropical mango with fresh green leaf',
  },
  2: {
    value: 2,
    name: 'Banana',
    ariaLabel: 'Value 2, yellow banana',
    primaryColor: '#FACC15',
    description: 'Curved bright yellow banana',
  },
  3: {
    value: 3,
    name: 'Apple',
    ariaLabel: 'Value 3, red apple',
    primaryColor: '#EF4444',
    description: 'Glossy crimson red apple with stem and leaf',
  },
  4: {
    value: 4,
    name: 'Orange',
    ariaLabel: 'Value 4, citrus orange',
    primaryColor: '#EA580C',
    description: 'Sunny citrus orange with textured peel and leaf',
  },
  5: {
    value: 5,
    name: 'Kiwi',
    ariaLabel: 'Value 5, green kiwi',
    primaryColor: '#22C55E',
    description: 'Electric lime-green sliced kiwi with seed circle',
  },
  6: {
    value: 6,
    name: 'Grapes',
    ariaLabel: 'Value 6, purple grapes',
    primaryColor: '#9333EA',
    description: 'Cluster of glossy royal purple grapes',
  },
  7: {
    value: 7,
    name: 'Blueberry',
    ariaLabel: 'Value 7, blue blueberry',
    primaryColor: '#2563EB',
    description: 'Sapphire blue berry with star calyx crown',
  },
  8: {
    value: 8,
    name: 'Dragonfruit',
    ariaLabel: 'Value 8, pink dragonfruit',
    primaryColor: '#EC4899',
    description: 'Vibrant hot-pink pitaya with green-tipped scales',
  },
  9: {
    value: 9,
    name: 'Coconut',
    ariaLabel: 'Value 9, brown coconut',
    primaryColor: '#78350F',
    description: 'Tropical brown coconut shell with white meat',
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
 * Raw SVG string templates for instant offline Canvas drawing and rendering.
 * All SVGs are 32x32 viewBox, centered, transparent background, and high contrast.
 */
export const FRUIT_SVG_STRINGS: Record<number, string> = {
  // 1: Mango (Golden Amber)
  1: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="m-grad" x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stop-color="#FDE047"/>
        <stop offset="45%" stop-color="#F59E0B"/>
        <stop offset="100%" stop-color="#D97706"/>
      </linearGradient>
    </defs>
    <!-- Leaf -->
    <path d="M16 6 C19.5 2.5 24.5 3 26.5 6 C24 8.5 19.5 8.5 16 6 Z" fill="#22C55E"/>
    <path d="M17 5.5 C20 4.5 23 5 25.5 6" stroke="#15803D" stroke-width="0.75" fill="none"/>
    <!-- Stem -->
    <path d="M16 7 C15.5 4.5 14.5 3 13 2" stroke="#78350F" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    <!-- Mango Body -->
    <path d="M16.5 6.5 C22.5 6.5 27 11.5 26 19 C25 25 19.5 28.5 14.5 28.5 C9 28.5 5.5 23.5 6.5 16 C7.5 9 11.5 6.5 16.5 6.5 Z" fill="url(#m-grad)"/>
    <!-- Rosy Blush on curve -->
    <path d="M21 13 C24 16 23.5 22 20 25" stroke="#FB7185" stroke-width="2.5" stroke-linecap="round" opacity="0.45" fill="none"/>
    <!-- Luminous highlight -->
    <path d="M10 13 C9.5 17 11 22 13 24" stroke="#FEF08A" stroke-width="1.8" stroke-linecap="round" opacity="0.7" fill="none"/>
  </svg>`,

  // 2: Banana (Bright Yellow)
  2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="b-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FEF9C3"/>
        <stop offset="35%" stop-color="#FACC15"/>
        <stop offset="100%" stop-color="#CA8A04"/>
      </linearGradient>
    </defs>
    <!-- Banana Body -->
    <path d="M6 22.5 C8 25.5 14 26.5 21 21.5 C26 17.5 27.5 11 26.5 6.5 C25.5 7 24 8 22 10 C17.5 14.5 11 18.5 6 22.5 Z" fill="url(#b-grad)"/>
    <!-- Ridge Line -->
    <path d="M6 22.5 C12 21 18 16.5 23 10" stroke="#A16207" stroke-width="1.2" fill="none" opacity="0.8"/>
    <!-- Inner Highlight -->
    <path d="M10 22 C15 19 20 15 24 9" stroke="#FEF9C3" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.8"/>
    <!-- Stem Tip -->
    <path d="M26.5 6.5 L28 4.5" stroke="#713F12" stroke-width="2" stroke-linecap="round"/>
    <!-- Bottom Tip -->
    <circle cx="5.8" cy="22.8" r="1.3" fill="#713F12"/>
  </svg>`,

  // 3: Apple (Crimson Red)
  3: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="a-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F87171"/>
        <stop offset="40%" stop-color="#EF4444"/>
        <stop offset="100%" stop-color="#991B1B"/>
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
    <circle cx="10" cy="12" r="1.5" fill="#FFFFFF" opacity="0.8"/>
  </svg>`,

  // 4: Orange (Vivid Citrus Orange)
  4: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="o-grad" x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stop-color="#FDBA74"/>
        <stop offset="45%" stop-color="#FB923C"/>
        <stop offset="100%" stop-color="#C2410C"/>
      </linearGradient>
    </defs>
    <!-- Leaf -->
    <path d="M16 5.5 C19.5 3 24 4 25.5 6.5 C22.5 8 18.5 7.5 16 5.5 Z" fill="#22C55E"/>
    <path d="M16 6.5 L15 3.5" stroke="#78350F" stroke-width="1.6" stroke-linecap="round"/>
    <!-- Orange Sphere -->
    <circle cx="16" cy="17.5" r="11" fill="url(#o-grad)"/>
    <!-- Dimple Texture Pores -->
    <circle cx="12" cy="14" r="0.8" fill="#9A3412" opacity="0.5"/>
    <circle cx="19" cy="15" r="0.8" fill="#9A3412" opacity="0.5"/>
    <circle cx="15" cy="21" r="0.8" fill="#9A3412" opacity="0.5"/>
    <circle cx="21" cy="22" r="0.8" fill="#9A3412" opacity="0.5"/>
    <circle cx="10" cy="19" r="0.8" fill="#9A3412" opacity="0.5"/>
    <!-- Glossy Curved Sheen -->
    <path d="M10 13.5 C12 10 17 9.5 20 11.5" stroke="#FFEDD5" stroke-width="1.8" stroke-linecap="round" opacity="0.65" fill="none"/>
  </svg>`,

  // 5: Kiwi (Electric Lime Green Slice)
  5: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <radialGradient id="kw-flesh" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FEF9C3"/>
        <stop offset="25%" stop-color="#86EFAC"/>
        <stop offset="65%" stop-color="#22C55E"/>
        <stop offset="100%" stop-color="#15803D"/>
      </radialGradient>
    </defs>
    <!-- Fuzzy Brown Outer Skin -->
    <circle cx="16" cy="16" r="12.5" fill="#78350F"/>
    <circle cx="16" cy="16" r="12" fill="#854D0E"/>
    <!-- Pale Inner Skin Ring -->
    <circle cx="16" cy="16" r="11.5" fill="#BBF7D0"/>
    <!-- Vibrant Lime Green Flesh -->
    <circle cx="16" cy="16" r="10.8" fill="url(#kw-flesh)"/>
    <!-- Radial Starburst Core Lines -->
    <path d="M16 11 L16 21 M11 16 L21 16 M12.5 12.5 L19.5 19.5 M19.5 12.5 L12.5 19.5" stroke="#DCFCE7" stroke-width="0.8" opacity="0.75"/>
    <!-- Creamy Core Center -->
    <ellipse cx="16" cy="16" rx="3.2" ry="3.2" fill="#FEF9C3"/>
    <!-- Ring of Tiny Black Seeds -->
    <circle cx="16" cy="11.2" r="0.8" fill="#0F172A"/>
    <circle cx="16" cy="20.8" r="0.8" fill="#0F172A"/>
    <circle cx="11.2" cy="16" r="0.8" fill="#0F172A"/>
    <circle cx="20.8" cy="16" r="0.8" fill="#0F172A"/>
    <circle cx="12.6" cy="12.6" r="0.8" fill="#0F172A"/>
    <circle cx="19.4" cy="12.6" r="0.8" fill="#0F172A"/>
    <circle cx="12.6" cy="19.4" r="0.8" fill="#0F172A"/>
    <circle cx="19.4" cy="19.4" r="0.8" fill="#0F172A"/>
  </svg>`,

  // 6: Grapes (Deep Royal Purple Cluster)
  6: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="g-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D8B4FE"/>
        <stop offset="45%" stop-color="#9333EA"/>
        <stop offset="100%" stop-color="#581C87"/>
      </linearGradient>
    </defs>
    <!-- Vine Stem & Leaf -->
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
    <circle cx="12.5" cy="13" r="0.9" fill="#F3E8FF" opacity="0.8"/>
    <circle cx="17.5" cy="13" r="0.9" fill="#F3E8FF" opacity="0.8"/>
    <circle cx="15" cy="18" r="0.9" fill="#F3E8FF" opacity="0.8"/>
  </svg>`,

  // 7: Blueberry (Sapphire Royal Blue Berry)
  7: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <radialGradient id="bb-grad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#93C5FD"/>
        <stop offset="35%" stop-color="#3B82F6"/>
        <stop offset="75%" stop-color="#1D4ED8"/>
        <stop offset="100%" stop-color="#1E3A8A"/>
      </radialGradient>
    </defs>
    <!-- Background mini leaf -->
    <path d="M19 6 C23 4 27 5.5 28 8.5 C25 9.5 21 8.5 19 6 Z" fill="#22C55E"/>
    <!-- Plump Blue Berry -->
    <circle cx="16" cy="18" r="11" fill="url(#bb-grad)"/>
    <!-- Star-shaped Calyx Crown Rim -->
    <path d="M12 9.5 L14 11.5 L16 8.5 L18 11.5 L20 9.5 L19 13 L21 14.5 L18 15 L16 16.5 L14 15 L11 14.5 L13 13 Z" fill="#1E3A8A"/>
    <ellipse cx="16" cy="12.5" rx="3.5" ry="2" fill="#0F172A"/>
    <ellipse cx="16" cy="12.5" rx="2" ry="1.2" fill="#1D4ED8"/>
    <!-- Luminous Soft Crescent Sheen -->
    <path d="M9.5 15 C8.5 18 9 22 11.5 25" stroke="#BFDBFE" stroke-width="2" stroke-linecap="round" opacity="0.75" fill="none"/>
    <circle cx="10" cy="15" r="1.3" fill="#FFFFFF" opacity="0.8"/>
  </svg>`,

  // 8: Dragonfruit (Radiant Hot Pink / Magenta)
  8: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="df-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F472B6"/>
        <stop offset="45%" stop-color="#EC4899"/>
        <stop offset="100%" stop-color="#9D174D"/>
      </linearGradient>
    </defs>
    <!-- Top Crown Leaf Scales -->
    <path d="M16 3 L16 9 C14 6 12 5 10 4 C13 7 14 9 14 11 Z" fill="#22C55E"/>
    <path d="M16 3 L16 9 C18 6 20 5 22 4 C19 7 18 9 18 11 Z" fill="#22C55E"/>
    <!-- Hot Pink Body -->
    <path d="M16 29 C9 29 6 22 6 15 C6 9 11 8 16 8 C21 8 26 9 26 15 C26 22 23 29 16 29 Z" fill="url(#df-grad)"/>
    <!-- Curved Bract Scales with Green Tips -->
    <!-- Left scales -->
    <path d="M6 14 C3 12 5 9 8 11 C6.5 13 6 14 6 14 Z" fill="#4ADE80"/>
    <path d="M7 19 C4 18 5 15 9 17 C7.5 18.5 7 19 7 19 Z" fill="#4ADE80"/>
    <path d="M10 25 C7 25 8 22 12 23 C10.5 24.5 10 25 10 25 Z" fill="#4ADE80"/>
    <!-- Right scales -->
    <path d="M26 14 C29 12 27 9 24 11 C25.5 13 26 14 26 14 Z" fill="#4ADE80"/>
    <path d="M25 19 C28 18 27 15 23 17 C24.5 18.5 25 19 25 19 Z" fill="#4ADE80"/>
    <path d="M22 25 C25 25 24 22 20 23 C21.5 24.5 22 25 22 25 Z" fill="#4ADE80"/>
    <!-- Center scale accents -->
    <path d="M16 13 C14 16 14 18 16 19 C18 18 18 16 16 13 Z" fill="#F472B6"/>
    <path d="M16 13 L16 15" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M16 21 C14 23 14 25 16 26 C18 25 18 23 16 21 Z" fill="#F472B6"/>
    <!-- Highlight -->
    <path d="M10 13 C9 16 10 21 12 24" stroke="#FCE7F3" stroke-width="1.5" stroke-linecap="round" opacity="0.6" fill="none"/>
  </svg>`,

  // 9: Coconut (Earthy Brown Shell with White Meat)
  9: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <defs>
      <radialGradient id="cc-husk" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#92400E"/>
        <stop offset="60%" stop-color="#78350F"/>
        <stop offset="100%" stop-color="#451A03"/>
      </radialGradient>
      <radialGradient id="cc-inner" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#E0F2FE"/>
        <stop offset="50%" stop-color="#F8FAFC"/>
        <stop offset="100%" stop-color="#E2E8F0"/>
      </radialGradient>
    </defs>
    <!-- Tropical Palm Leaf in Background -->
    <path d="M20 5 C25 3 29 4 30 7 C27 8 23 7 20 5 Z" fill="#22C55E"/>
    <!-- Outer Brown Textured Coconut Husk -->
    <circle cx="16" cy="17" r="12" fill="url(#cc-husk)"/>
    <!-- Husk Fiber Texture Strands -->
    <path d="M6 13 C5 15 5 19 7 21" stroke="#451A03" stroke-width="1" stroke-linecap="round" fill="none"/>
    <path d="M26 13 C27 15 27 19 25 21" stroke="#451A03" stroke-width="1" stroke-linecap="round" fill="none"/>
    <path d="M13 28 C15 29 17 29 19 28" stroke="#451A03" stroke-width="1" stroke-linecap="round" fill="none"/>
    <!-- Pristine White Coconut Meat Rim -->
    <circle cx="16" cy="17" r="9.5" fill="#FFFFFF"/>
    <!-- Shaded inner meat border -->
    <circle cx="16" cy="17" r="9.5" fill="none" stroke="#CBD5E1" stroke-width="1"/>
    <!-- Center Coconut Water Chamber -->
    <circle cx="16" cy="17" r="6.5" fill="url(#cc-inner)"/>
    <!-- Subtle shine on white meat -->
    <path d="M10 14 C11 11 15 9.5 18 10.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.9" fill="none"/>
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
