import React from 'react';

export interface SudokuFruitMeta {
  value: number;
  name: string;
  ariaLabel: string;
  primaryColor: string;
  description: string;
}

/**
 * 9 Unique Fruits with 9 Distinct Colors in Realistic, High-Quality 3D:
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
    ariaLabel: 'Value 1, 3D golden mango',
    primaryColor: '#F59E0B',
    description: 'Realistic 3D tropical golden mango with lush leaf and sunset blush',
  },
  2: {
    value: 2,
    name: 'Banana',
    ariaLabel: 'Value 2, 3D yellow banana',
    primaryColor: '#FACC15',
    description: 'Realistic 3D curved canary banana with faceted peel ridges',
  },
  3: {
    value: 3,
    name: 'Apple',
    ariaLabel: 'Value 3, 3D red apple',
    primaryColor: '#EF4444',
    description: 'Realistic 3D lacquered red apple with glossy gleam and twig stem',
  },
  4: {
    value: 4,
    name: 'Orange',
    ariaLabel: 'Value 4, 3D citrus orange',
    primaryColor: '#EA580C',
    description: 'Realistic 3D textured citrus orange with peel pores and leaf',
  },
  5: {
    value: 5,
    name: 'Kiwi',
    ariaLabel: 'Value 5, 3D green kiwi',
    primaryColor: '#22C55E',
    description: 'Realistic 3D sliced lime-green kiwi with seed ring and creamy core',
  },
  6: {
    value: 6,
    name: 'Grapes',
    ariaLabel: 'Value 6, 3D purple grapes',
    primaryColor: '#9333EA',
    description: 'Realistic 3D cluster of glossy royal purple grapes with vine',
  },
  7: {
    value: 7,
    name: 'Blueberry',
    ariaLabel: 'Value 7, 3D blue blueberry',
    primaryColor: '#2563EB',
    description: 'Realistic 3D sapphire blueberry with waxy bloom and calyx crown',
  },
  8: {
    value: 8,
    name: 'Dragonfruit',
    ariaLabel: 'Value 8, 3D pink dragonfruit',
    primaryColor: '#EC4899',
    description: 'Realistic 3D radiant hot-pink pitaya with layered green scales',
  },
  9: {
    value: 9,
    name: 'Coconut',
    ariaLabel: 'Value 9, 3D brown coconut',
    primaryColor: '#78350F',
    description: 'Realistic 3D fibrous brown coconut half with white meat and water',
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
 * Realistic 3D SVG String Templates:
 * Built with volumetric radial gradients, directional key lighting, ambient occlusion,
 * realistic material micro-textures, and contact depth shadows.
 * All SVGs are 32x32 viewBox, centered, with transparent backgrounds.
 */
export const FRUIT_SVG_STRINGS: Record<number, string> = {
  // 1: Mango (Golden Amber) - Realistic 3D Tropical Mango
  1: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <radialGradient id="m3d-body" cx="35%" cy="30%" r="68%">
        <stop offset="0%" stop-color="#FEF08A"/>
        <stop offset="25%" stop-color="#FBBF24"/>
        <stop offset="65%" stop-color="#F59E0B"/>
        <stop offset="90%" stop-color="#D97706"/>
        <stop offset="100%" stop-color="#92400E"/>
      </radialGradient>
      <radialGradient id="m3d-blush" cx="70%" cy="55%" r="50%">
        <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.8"/>
        <stop offset="50%" stop-color="#E11D48" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#D97706" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="m3d-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4ADE80"/>
        <stop offset="50%" stop-color="#22C55E"/>
        <stop offset="100%" stop-color="#15803D"/>
      </linearGradient>
      <linearGradient id="m3d-stem" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#A16207"/>
        <stop offset="100%" stop-color="#451A03"/>
      </linearGradient>
    </defs>
    <!-- Soft Ambient Ground Shadow -->
    <ellipse cx="16" cy="29.5" rx="8" ry="1.8" fill="#000000" opacity="0.18"/>
    <!-- 3D Leaf Body -->
    <path d="M16 6.5 C20 2 26 2.5 28 6 C24.5 8.5 19.5 8.5 16 6.5 Z" fill="url(#m3d-leaf)"/>
    <!-- Leaf Bevel Rib -->
    <path d="M16.5 6.2 C20 4.2 24 4.5 27.5 6" stroke="#86EFAC" stroke-width="0.8" stroke-linecap="round" fill="none" opacity="0.8"/>
    <!-- 3D Woody Stem -->
    <path d="M16 7.5 C15.5 5 14.5 3 13 1.8" stroke="url(#m3d-stem)" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M15.8 7 C15.4 5 14.6 3.4 13.5 2.2" stroke="#D97706" stroke-width="0.7" stroke-linecap="round" fill="none" opacity="0.7"/>
    <!-- Main 3D Mango Body -->
    <path d="M16.5 6.5 C22.8 6.5 27.2 11.5 26.2 19 C25.2 25 19.5 28.5 14.5 28.5 C9 28.5 5.5 23.5 6.5 16 C7.5 9 11.5 6.5 16.5 6.5 Z" fill="url(#m3d-body)"/>
    <!-- 3D Soft Peach/Coral Blush Overlay -->
    <path d="M16.5 6.5 C22.8 6.5 27.2 11.5 26.2 19 C25.2 25 19.5 28.5 14.5 28.5 C9 28.5 5.5 23.5 6.5 16 C7.5 9 11.5 6.5 16.5 6.5 Z" fill="url(#m3d-blush)"/>
    <!-- Contact Shadow Under Stem/Leaf onto Mango -->
    <path d="M14 7.5 C16 9 18 9 20 8 C18 7.5 16 7.5 14 7.5 Z" fill="#451A03" opacity="0.25"/>
    <!-- 3D Rim Bounce Light (Bottom Left) -->
    <path d="M7.5 18 C7 23 10 27 14 28" stroke="#FDE047" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.5"/>
    <!-- Glossy Specular Light Reflection (Top Left) -->
    <ellipse cx="12" cy="12" rx="3.5" ry="5.5" transform="rotate(-25 12 12)" fill="#FFFFFF" opacity="0.45"/>
    <ellipse cx="11" cy="10.5" rx="1.5" ry="2.8" transform="rotate(-25 11 10.5)" fill="#FFFFFF" opacity="0.85"/>
  </svg>`,

  // 2: Banana (Bright Yellow) - Realistic 3D Faceted Banana
  2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <linearGradient id="b3d-top" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FEFCE8"/>
        <stop offset="40%" stop-color="#FEF08A"/>
        <stop offset="100%" stop-color="#FACC15"/>
      </linearGradient>
      <linearGradient id="b3d-mid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDE047"/>
        <stop offset="50%" stop-color="#EAB308"/>
        <stop offset="100%" stop-color="#CA8A04"/>
      </linearGradient>
      <linearGradient id="b3d-bot" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#CA8A04"/>
        <stop offset="100%" stop-color="#854D0E"/>
      </linearGradient>
      <linearGradient id="b3d-stem" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#854D0E"/>
        <stop offset="60%" stop-color="#451A03"/>
        <stop offset="100%" stop-color="#1C1917"/>
      </linearGradient>
    </defs>
    <!-- Ground Shadow -->
    <ellipse cx="15" cy="27.5" rx="9" ry="2" fill="#000000" opacity="0.18"/>
    <!-- Bottom Shadow Facet -->
    <path d="M5.5 22.8 C7.5 26.2 14.5 27 21.5 21.8 C26.5 17.5 27.8 11 26.8 6.5 C25.8 7 24.5 8 22.5 10 C18 14.5 11 18.5 5.5 22.8 Z" fill="url(#b3d-bot)"/>
    <!-- Middle Side Facet -->
    <path d="M6 22.5 C10 24 16 23.5 21 19.5 C25.5 15.5 26.8 10 26.5 6.5 C25 7.5 23 9 20.5 11.5 C15.5 16.5 10 20 6 22.5 Z" fill="url(#b3d-mid)"/>
    <!-- Top Sunlit Facet -->
    <path d="M6.5 22 C11 21.5 17 17.5 22 12.5 C25 9.5 26.2 7.2 26.5 6.5 C24.5 7.5 21.5 9.5 17.5 13 C12.5 17 8.5 20 6.5 22 Z" fill="url(#b3d-top)"/>
    <!-- 3D Bevel Ridge Line (Sharp Light Edge) -->
    <path d="M6.5 22.2 C12 21 18.5 16 23.5 9.5" stroke="#FEF9C3" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.95"/>
    <path d="M6 22.8 C11.5 22 17.5 17.5 22.5 11" stroke="#A16207" stroke-width="0.8" stroke-linecap="round" fill="none" opacity="0.45"/>
    <!-- Glossy Specular Sheen Along Upper Ridge -->
    <path d="M10 20 C14.5 17.5 19 13.5 23 8" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.75"/>
    <circle cx="15" cy="16" r="1.2" fill="#FFFFFF" opacity="0.8"/>
    <!-- 3D Cut Stalk Stem -->
    <path d="M26.5 6.5 L28.5 4 C28.8 3.6 28.2 3 27.5 3.3 L25.5 5.8 Z" fill="url(#b3d-stem)"/>
    <!-- Stem Bevel Cap -->
    <ellipse cx="28" cy="3.8" rx="1.2" ry="0.8" transform="rotate(-40 28 3.8)" fill="#713F12"/>
    <ellipse cx="28" cy="3.8" rx="0.7" ry="0.4" transform="rotate(-40 28 3.8)" fill="#A16207"/>
    <!-- Dark Blossom Tip -->
    <path d="M5.5 22.5 C5 23 5.2 23.8 5.8 23.8 C6.4 23.8 6.5 23.2 6.2 22.6 Z" fill="#292524"/>
  </svg>`,

  // 3: Apple (Crimson Red) - Realistic 3D Lacquered Apple
  3: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <radialGradient id="a3d-body" cx="35%" cy="32%" r="68%">
        <stop offset="0%" stop-color="#FCA5A5"/>
        <stop offset="25%" stop-color="#EF4444"/>
        <stop offset="65%" stop-color="#DC2626"/>
        <stop offset="88%" stop-color="#991B1B"/>
        <stop offset="100%" stop-color="#450A0A"/>
      </radialGradient>
      <radialGradient id="a3d-cavity" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#450A0A"/>
        <stop offset="70%" stop-color="#7F1D1D" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#DC2626" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="a3d-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#86EFAC"/>
        <stop offset="50%" stop-color="#22C55E"/>
        <stop offset="100%" stop-color="#15803D"/>
      </linearGradient>
      <linearGradient id="a3d-stem" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#78350F"/>
        <stop offset="100%" stop-color="#292524"/>
      </linearGradient>
    </defs>
    <!-- Ground Shadow -->
    <ellipse cx="16" cy="28.8" rx="8.5" ry="2" fill="#000000" opacity="0.2"/>
    <!-- 3D Woody Twig Stem -->
    <path d="M16 10 C16.5 6.5 17.5 4 19.5 2.5" stroke="url(#a3d-stem)" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M16.3 9.5 C16.8 6.5 17.6 4.3 19.2 3" stroke="#A16207" stroke-width="0.8" stroke-linecap="round" fill="none" opacity="0.8"/>
    <!-- 3D Leaf Body -->
    <path d="M16 6.5 C20 3.5 24.5 4.5 26 7.5 C22.5 9 18 8.5 16 6.5 Z" fill="url(#a3d-leaf)"/>
    <path d="M16.5 6.5 C20 4.8 23 5.5 25.5 7.2" stroke="#DCFCE7" stroke-width="0.8" stroke-linecap="round" fill="none" opacity="0.8"/>
    <!-- Main Apple Body -->
    <path d="M16 8.5 C11.5 4.5 4.5 7.5 4.5 15.5 C4.5 23.5 10.8 28.5 16 27.5 C21.2 28.5 27.5 23.5 27.5 15.5 C27.5 7.5 20.5 4.5 16 8.5 Z" fill="url(#a3d-body)"/>
    <!-- Top Dimple Cavity Shadow -->
    <ellipse cx="16" cy="8.8" rx="3.5" ry="1.8" fill="url(#a3d-cavity)"/>
    <!-- Ambient Bottom Rim Light -->
    <path d="M10 26 C13 28 19 28 22 26" stroke="#F87171" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.55"/>
    <!-- Glossy Specular Shine 1 (Bright Hero Glint) -->
    <ellipse cx="10" cy="12.5" rx="2.5" ry="4.5" transform="rotate(-30 10 12.5)" fill="#FFFFFF" opacity="0.55"/>
    <ellipse cx="9.2" cy="11.2" rx="1.2" ry="2.2" transform="rotate(-30 9.2 11.2)" fill="#FFFFFF" opacity="0.9"/>
    <!-- Glossy Specular Shine 2 (Secondary Soft Reflection) -->
    <path d="M19 11 C22 13 23 16 23 19" stroke="#FECDD3" stroke-width="1.5" stroke-linecap="round" opacity="0.4" fill="none"/>
  </svg>`,

  // 4: Orange (Vivid Citrus Orange) - Realistic 3D Citrus Sphere
  4: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <radialGradient id="o3d-body" cx="35%" cy="30%" r="68%">
        <stop offset="0%" stop-color="#FED7AA"/>
        <stop offset="25%" stop-color="#FB923C"/>
        <stop offset="65%" stop-color="#EA580C"/>
        <stop offset="90%" stop-color="#C2410C"/>
        <stop offset="100%" stop-color="#7C2D12"/>
      </radialGradient>
      <linearGradient id="o3d-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4ADE80"/>
        <stop offset="50%" stop-color="#22C55E"/>
        <stop offset="100%" stop-color="#15803D"/>
      </linearGradient>
    </defs>
    <!-- Ground Shadow -->
    <ellipse cx="16" cy="28.8" rx="8" ry="2" fill="#000000" opacity="0.2"/>
    <!-- 3D Leaf -->
    <path d="M16 6 C20 3 24.5 4 26 6.8 C23 8.5 18.5 8 16 6 Z" fill="url(#o3d-leaf)"/>
    <path d="M16.5 5.8 C20 4.2 23 4.8 25.5 6.5" stroke="#BBF7D0" stroke-width="0.75" stroke-linecap="round" fill="none" opacity="0.8"/>
    <!-- Top Button Calyx / Stem -->
    <circle cx="16" cy="6.8" r="1.6" fill="#15803D"/>
    <circle cx="16" cy="6.5" r="0.8" fill="#78350F"/>
    <!-- 3D Spherical Orange Body -->
    <circle cx="16" cy="17.5" r="11" fill="url(#o3d-body)"/>
    <!-- Stippled 3D Dimple Pores (Shadow + Light Rim) -->
    <circle cx="11.5" cy="14" r="0.8" fill="#7C2D12" opacity="0.45"/>
    <circle cx="11.8" cy="14.3" r="0.5" fill="#FFEDD5" opacity="0.6"/>
    <circle cx="19.5" cy="14.5" r="0.8" fill="#7C2D12" opacity="0.45"/>
    <circle cx="19.8" cy="14.8" r="0.5" fill="#FFEDD5" opacity="0.6"/>
    <circle cx="15.5" cy="21.5" r="0.8" fill="#7C2D12" opacity="0.45"/>
    <circle cx="15.8" cy="21.8" r="0.5" fill="#FFEDD5" opacity="0.6"/>
    <circle cx="21" cy="22" r="0.8" fill="#7C2D12" opacity="0.45"/>
    <circle cx="21.3" cy="22.3" r="0.5" fill="#FFEDD5" opacity="0.6"/>
    <circle cx="10" cy="19.5" r="0.8" fill="#7C2D12" opacity="0.45"/>
    <circle cx="10.3" cy="19.8" r="0.5" fill="#FFEDD5" opacity="0.6"/>
    <!-- Ambient Bottom Rim Light -->
    <path d="M11 25.5 C14 27.5 19 27.5 22 25.5" stroke="#FDBA74" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.55"/>
    <!-- Curved Glossy Specular Surface Highlight -->
    <ellipse cx="11.5" cy="11.5" rx="3.5" ry="2.2" transform="rotate(-30 11.5 11.5)" fill="#FFFFFF" opacity="0.5"/>
    <circle cx="10.8" cy="10.8" r="1.3" fill="#FFFFFF" opacity="0.85"/>
  </svg>`,

  // 5: Kiwi (Lime Green) - Realistic 3D Sliced Kiwi
  5: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <radialGradient id="kw3d-rind" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#A16207"/>
        <stop offset="60%" stop-color="#78350F"/>
        <stop offset="100%" stop-color="#451A03"/>
      </radialGradient>
      <radialGradient id="kw3d-flesh" cx="48%" cy="46%" r="52%">
        <stop offset="0%" stop-color="#FEF9C3"/>
        <stop offset="25%" stop-color="#A7F3D0"/>
        <stop offset="45%" stop-color="#4ADE80"/>
        <stop offset="75%" stop-color="#22C55E"/>
        <stop offset="100%" stop-color="#15803D"/>
      </radialGradient>
      <radialGradient id="kw3d-core" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="60%" stop-color="#FEF08A"/>
        <stop offset="100%" stop-color="#D9F99D"/>
      </radialGradient>
    </defs>
    <!-- Ground Shadow -->
    <ellipse cx="16" cy="28.8" rx="8.5" ry="2" fill="#000000" opacity="0.2"/>
    <!-- 3D Fuzzy Brown Rind Edge -->
    <circle cx="16" cy="16" r="12.5" fill="url(#kw3d-rind)"/>
    <circle cx="16" cy="16" r="12.5" fill="none" stroke="#A16207" stroke-width="0.8" stroke-dasharray="1.5 1"/>
    <!-- Pale Inner Crust Ring -->
    <circle cx="16" cy="16" r="11.4" fill="#DCFCE7"/>
    <!-- 3D Juicy Lime Green Flesh -->
    <circle cx="16" cy="16" r="10.8" fill="url(#kw3d-flesh)"/>
    <!-- 3D Radial Pulp Striations (Rays) -->
    <g stroke="#DCFCE7" stroke-width="0.7" opacity="0.7">
      <line x1="16" y1="10" x2="16" y2="22"/>
      <line x1="10" y1="16" x2="22" y2="16"/>
      <line x1="11.8" y1="11.8" x2="20.2" y2="20.2"/>
      <line x1="20.2" y1="11.8" x2="11.8" y2="20.2"/>
      <line x1="13" y1="10.5" x2="19" y2="21.5"/>
      <line x1="19" y1="10.5" x2="13" y2="21.5"/>
      <line x1="10.5" y1="13" x2="21.5" y2="19"/>
      <line x1="10.5" y1="19" x2="21.5" y2="13"/>
    </g>
    <!-- Creamy Core with 3D Depth -->
    <ellipse cx="16" cy="16" rx="3.4" ry="3.4" fill="url(#kw3d-core)"/>
    <!-- Ring of 3D Teardrop Black Seeds with Specular Glints -->
    <circle cx="16" cy="10.8" r="0.85" fill="#0F172A"/>
    <circle cx="15.8" cy="10.5" r="0.3" fill="#FFFFFF"/>
    <circle cx="16" cy="21.2" r="0.85" fill="#0F172A"/>
    <circle cx="15.8" cy="20.9" r="0.3" fill="#FFFFFF"/>
    <circle cx="10.8" cy="16" r="0.85" fill="#0F172A"/>
    <circle cx="10.5" cy="15.8" r="0.3" fill="#FFFFFF"/>
    <circle cx="21.2" cy="16" r="0.85" fill="#0F172A"/>
    <circle cx="20.9" cy="15.8" r="0.3" fill="#FFFFFF"/>
    <circle cx="12.3" cy="12.3" r="0.85" fill="#0F172A"/>
    <circle cx="12.1" cy="12.1" r="0.3" fill="#FFFFFF"/>
    <circle cx="19.7" cy="12.3" r="0.85" fill="#0F172A"/>
    <circle cx="19.5" cy="12.1" r="0.3" fill="#FFFFFF"/>
    <circle cx="12.3" cy="19.7" r="0.85" fill="#0F172A"/>
    <circle cx="12.1" cy="19.5" r="0.3" fill="#FFFFFF"/>
    <circle cx="19.7" cy="19.7" r="0.85" fill="#0F172A"/>
    <circle cx="19.5" cy="19.5" r="0.3" fill="#FFFFFF"/>
    <!-- Glossy Surface Wet Sheen Reflection -->
    <path d="M8.5 13.5 C10.5 9 16 8 19 9.5" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.65"/>
  </svg>`,

  // 6: Grapes (Royal Purple) - Realistic 3D Cluster of Grapes
  6: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <radialGradient id="g3d-berry" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#E9D5FF"/>
        <stop offset="30%" stop-color="#C084FC"/>
        <stop offset="65%" stop-color="#9333EA"/>
        <stop offset="90%" stop-color="#6B21A8"/>
        <stop offset="100%" stop-color="#3B0764"/>
      </radialGradient>
      <radialGradient id="g3d-dark" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#C084FC"/>
        <stop offset="50%" stop-color="#7E22CE"/>
        <stop offset="100%" stop-color="#2E1065"/>
      </radialGradient>
      <linearGradient id="g3d-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#86EFAC"/>
        <stop offset="50%" stop-color="#22C55E"/>
        <stop offset="100%" stop-color="#15803D"/>
      </linearGradient>
    </defs>
    <!-- Ground Shadow -->
    <ellipse cx="16" cy="29.2" rx="6" ry="1.6" fill="#000000" opacity="0.2"/>
    <!-- 3D Woody Vine Branch & Leaf -->
    <path d="M16 7 C16 4 17.5 2.5 19.5 2" stroke="#78350F" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    <path d="M16 6 C12 3.5 8 4 7 7 C10.5 8 14 7.5 16 6 Z" fill="url(#g3d-leaf)"/>
    <!-- Curled Vine Tendril -->
    <path d="M18 3 C20 2.5 22 4 21 6" stroke="#16A34A" stroke-width="1" stroke-linecap="round" fill="none"/>
    <!-- === BACK LAYER (Occluded Grapes) === -->
    <circle cx="11.5" cy="14" r="3.2" fill="url(#g3d-dark)"/>
    <circle cx="20.5" cy="14" r="3.2" fill="url(#g3d-dark)"/>
    <circle cx="16" cy="18.5" r="3.2" fill="url(#g3d-dark)"/>
    <!-- === MIDDLE LAYER (Body Grapes) === -->
    <!-- Top row -->
    <circle cx="11" cy="9.5" r="3.3" fill="url(#g3d-berry)"/>
    <circle cx="11" cy="8.5" r="0.7" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="16" cy="9" r="3.3" fill="url(#g3d-berry)"/>
    <circle cx="16" cy="8" r="0.7" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="21" cy="9.5" r="3.3" fill="url(#g3d-berry)"/>
    <circle cx="21" cy="8.5" r="0.7" fill="#FFFFFF" opacity="0.8"/>
    <!-- Row 2 -->
    <circle cx="8" cy="15" r="3.3" fill="url(#g3d-berry)"/>
    <circle cx="8" cy="14" r="0.7" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="16" cy="14.5" r="3.4" fill="url(#g3d-berry)"/>
    <circle cx="15.8" cy="13.5" r="0.8" fill="#FFFFFF" opacity="0.85"/>
    <circle cx="24" cy="15" r="3.3" fill="url(#g3d-berry)"/>
    <circle cx="24" cy="14" r="0.7" fill="#FFFFFF" opacity="0.8"/>
    <!-- Row 3 -->
    <circle cx="11.5" cy="19.5" r="3.3" fill="url(#g3d-berry)"/>
    <circle cx="11.5" cy="18.5" r="0.7" fill="#FFFFFF" opacity="0.85"/>
    <circle cx="20.5" cy="19.5" r="3.3" fill="url(#g3d-berry)"/>
    <circle cx="20.5" cy="18.5" r="0.7" fill="#FFFFFF" opacity="0.85"/>
    <!-- Row 4 -->
    <circle cx="13.5" cy="24" r="3.2" fill="url(#g3d-berry)"/>
    <circle cx="13.5" cy="23" r="0.6" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="18.5" cy="24" r="3.2" fill="url(#g3d-berry)"/>
    <circle cx="18.5" cy="23" r="0.6" fill="#FFFFFF" opacity="0.8"/>
    <!-- Tip Hero Grape -->
    <circle cx="16" cy="27.5" r="3" fill="url(#g3d-berry)"/>
    <circle cx="15.8" cy="26.5" r="0.6" fill="#FFFFFF" opacity="0.85"/>
  </svg>`,

  // 7: Blueberry (Sapphire Blue) - Realistic 3D Blueberry with Calyx Crown
  7: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <radialGradient id="bb3d-body" cx="34%" cy="28%" r="68%">
        <stop offset="0%" stop-color="#BAE6FD"/>
        <stop offset="25%" stop-color="#60A5FA"/>
        <stop offset="60%" stop-color="#2563EB"/>
        <stop offset="85%" stop-color="#1D4ED8"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </radialGradient>
      <radialGradient id="bb3d-cavity" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#020617"/>
        <stop offset="70%" stop-color="#1E3A8A"/>
        <stop offset="100%" stop-color="#2563EB" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="bb3d-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4ADE80"/>
        <stop offset="100%" stop-color="#15803D"/>
      </linearGradient>
    </defs>
    <!-- Ground Shadow -->
    <ellipse cx="16" cy="28.8" rx="8" ry="2" fill="#000000" opacity="0.2"/>
    <!-- Mini Green Leaf Tucked Behind -->
    <path d="M19 5.5 C23 3.5 27 5 28 8 C25 9 21 8 19 5.5 Z" fill="url(#bb3d-leaf)"/>
    <!-- Plump 3D Spherical Berry -->
    <circle cx="16" cy="18" r="11" fill="url(#bb3d-body)"/>
    <!-- 3D Star-Shaped Calyx Crown Rim (Beveled Points) -->
    <path d="M11.5 9.5 L13.8 11.8 L16 8.5 L18.2 11.8 L20.5 9.5 L19.2 13.2 L21.5 15 L18.2 15.5 L16 17 L13.8 15.5 L10.5 15 L12.8 13.2 Z" fill="#1E3A8A"/>
    <path d="M12 10 L14 12 L16 9 L18 12 L20 10 L19 13.2 L21 14.8 L18 15.2 L16 16.5 L14 15.2 L11 14.8 L13 13.2 Z" fill="#2563EB"/>
    <!-- Deep Central Calyx Crater Cavity -->
    <ellipse cx="16" cy="12.8" rx="3.6" ry="2" fill="url(#bb3d-cavity)"/>
    <!-- Inner Pistil Dot in Crater -->
    <circle cx="16" cy="12.8" r="0.9" fill="#020617"/>
    <!-- Ambient Cyan-Blue Rim Bounce Light -->
    <path d="M10 26 C13 28 19 28 22 26" stroke="#7DD3FC" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.5"/>
    <!-- Soft Crescent Waxy Bloom Sheen -->
    <ellipse cx="11.5" cy="13" rx="3" ry="4.5" transform="rotate(-30 11.5 13)" fill="#FFFFFF" opacity="0.45"/>
    <circle cx="10.8" cy="11.5" r="1.3" fill="#FFFFFF" opacity="0.85"/>
  </svg>`,

  // 8: Dragonfruit (Hot Pink) - Realistic 3D Dragonfruit / Pitaya with Layered Scales
  8: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <radialGradient id="df3d-body" cx="35%" cy="30%" r="68%">
        <stop offset="0%" stop-color="#FCE7F3"/>
        <stop offset="25%" stop-color="#F472B6"/>
        <stop offset="60%" stop-color="#EC4899"/>
        <stop offset="85%" stop-color="#BE185D"/>
        <stop offset="100%" stop-color="#700731"/>
      </radialGradient>
      <linearGradient id="df3d-scale-l" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#BE185D"/>
        <stop offset="45%" stop-color="#EC4899"/>
        <stop offset="80%" stop-color="#4ADE80"/>
        <stop offset="100%" stop-color="#22C55E"/>
      </linearGradient>
      <linearGradient id="df3d-scale-r" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#BE185D"/>
        <stop offset="45%" stop-color="#EC4899"/>
        <stop offset="80%" stop-color="#4ADE80"/>
        <stop offset="100%" stop-color="#22C55E"/>
      </linearGradient>
    </defs>
    <!-- Ground Shadow -->
    <ellipse cx="16" cy="29.2" rx="7.5" ry="1.8" fill="#000000" opacity="0.2"/>
    <!-- Top Crown Scales -->
    <path d="M16 2.5 L16 9 C13.5 5.5 11 4.5 9 3.5 C12.5 6.5 13.5 9 13.5 11 Z" fill="#22C55E"/>
    <path d="M16 2.5 L16 9 C18.5 5.5 21 4.5 23 3.5 C19.5 6.5 18.5 9 18.5 11 Z" fill="#22C55E"/>
    <!-- Main 3D Oval Body -->
    <path d="M16 29 C9 29 6 22.5 6 15 C6 8.5 11 7.5 16 7.5 C21 7.5 26 8.5 26 15 C26 22.5 23 29 16 29 Z" fill="url(#df3d-body)"/>
    <!-- === 3D LAYERED SCALES WITH CONTACT SHADOWS === -->
    <!-- Scale Left Upper -->
    <path d="M6 13.5 C3 11 4.5 8 8 10 C6.5 12 6 13.5 6 13.5 Z" fill="url(#df3d-scale-l)"/>
    <path d="M7 14 C5.5 13 6 10.5 8 11.5" stroke="#700731" stroke-width="0.8" opacity="0.3" fill="none"/>
    <!-- Scale Right Upper -->
    <path d="M26 13.5 C29 11 27.5 8 24 10 C25.5 12 26 13.5 26 13.5 Z" fill="url(#df3d-scale-r)"/>
    <!-- Scale Left Middle -->
    <path d="M6.8 19 C3.8 17.5 4.8 14 9 16 C7.5 18 7 19 6.8 19 Z" fill="url(#df3d-scale-l)"/>
    <!-- Scale Right Middle -->
    <path d="M25.2 19 C28.2 17.5 27.2 14 23 16 C24.5 18 25 19 25.2 19 Z" fill="url(#df3d-scale-r)"/>
    <!-- Scale Left Lower -->
    <path d="M9.5 25 C6.5 24.5 7.5 21 11.5 22.5 C10 24 9.5 25 9.5 25 Z" fill="url(#df3d-scale-l)"/>
    <!-- Scale Right Lower -->
    <path d="M22.5 25 C25.5 24.5 24.5 21 20.5 22.5 C22 24 22.5 25 22.5 25 Z" fill="url(#df3d-scale-r)"/>
    <!-- Center Front Scales (3D Petals on Belly) -->
    <path d="M16 12 C13.5 15.5 13.5 18 16 19 C18.5 18 18.5 15.5 16 12 Z" fill="#F472B6"/>
    <path d="M16 12 L16 15" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M16 20.5 C13.8 23 13.8 25.5 16 26.5 C18.2 25.5 18.2 23 16 20.5 Z" fill="#F472B6"/>
    <path d="M16 20.5 L16 23" stroke="#22C55E" stroke-width="1.3" stroke-linecap="round"/>
    <!-- 3D Specular Highlight Ridge -->
    <path d="M10.5 12 C9 15 9.5 21 12 24" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.6"/>
    <circle cx="10.8" cy="11.5" r="1.3" fill="#FFFFFF" opacity="0.85"/>
  </svg>`,

  // 9: Coconut (Earthy Brown) - Realistic 3D Coconut Bowl Half
  9: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <radialGradient id="cc3d-husk" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#A16207"/>
        <stop offset="45%" stop-color="#78350F"/>
        <stop offset="85%" stop-color="#451A03"/>
        <stop offset="100%" stop-color="#1C1917"/>
      </radialGradient>
      <linearGradient id="cc3d-meat" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="60%" stop-color="#F1F5F9"/>
        <stop offset="100%" stop-color="#CBD5E1"/>
      </linearGradient>
      <radialGradient id="cc3d-water" cx="45%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#E0F2FE"/>
        <stop offset="60%" stop-color="#BAE6FD"/>
        <stop offset="90%" stop-color="#94A3B8"/>
        <stop offset="100%" stop-color="#64748B"/>
      </radialGradient>
      <linearGradient id="cc3d-palm" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#86EFAC"/>
        <stop offset="100%" stop-color="#15803D"/>
      </linearGradient>
    </defs>
    <!-- Ground Shadow -->
    <ellipse cx="16" cy="28.8" rx="8.5" ry="2" fill="#000000" opacity="0.22"/>
    <!-- Tropical Palm Frond Leaflet in Background -->
    <path d="M20 4.5 C25 2.5 29.5 3.5 30.5 7 C27 8 23 7 20 4.5 Z" fill="url(#cc3d-palm)"/>
    <path d="M20.5 4.5 C25 3.8 28 4.5 29.5 6.5" stroke="#DCFCE7" stroke-width="0.7" stroke-linecap="round" fill="none" opacity="0.8"/>
    <!-- 3D Fibrous Brown Coconut Shell -->
    <circle cx="16" cy="17" r="12" fill="url(#cc3d-husk)"/>
    <!-- Realistic Coir Fiber Strands (Micro-texture) -->
    <path d="M5.5 13 C4.5 16 5 20 7 22" stroke="#292524" stroke-width="0.9" stroke-linecap="round" fill="none" opacity="0.8"/>
    <path d="M26.5 13 C27.5 16 27 20 25 22" stroke="#292524" stroke-width="0.9" stroke-linecap="round" fill="none" opacity="0.8"/>
    <path d="M12.5 28 C15 29 17 29 19.5 28" stroke="#292524" stroke-width="0.9" stroke-linecap="round" fill="none" opacity="0.8"/>
    <path d="M6 14 C5.2 16.5 5.5 19.5 7.2 21" stroke="#A16207" stroke-width="0.6" stroke-linecap="round" fill="none" opacity="0.6"/>
    <!-- Outer Shell Cut Rim (Bevel Rim) -->
    <circle cx="16" cy="17" r="10.8" fill="#451A03"/>
    <!-- Pristine Snow-White Coconut Meat Layer -->
    <circle cx="16" cy="17" r="9.6" fill="url(#cc3d-meat)"/>
    <!-- Shaded Inner Cavity Lip Shadow -->
    <circle cx="16" cy="17" r="6.8" fill="#475569" opacity="0.4"/>
    <!-- Sunken Clear Coconut Water Surface -->
    <circle cx="16" cy="17.2" r="6.4" fill="url(#cc3d-water)"/>
    <!-- 3D Glossy Light Reflection Across Water & Meat Rim -->
    <path d="M10 13.5 C11.5 10 16 9 19.5 10.5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.95"/>
    <circle cx="11" cy="13" r="1.3" fill="#FFFFFF" opacity="0.9"/>
    <!-- Water Ripple Highlight -->
    <ellipse cx="15" cy="16" rx="2.5" ry="1.2" fill="#FFFFFF" opacity="0.6"/>
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

  // Fallback if image not yet loaded: draw iconic fruit colored badge with 3D gradient
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
 * High-definition realistic 3D vector component for Fruit Mode.
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
      className={`inline-flex items-center justify-center shrink-0 select-none transition-transform duration-150 hover:scale-110 drop-shadow-2xs ${typeof size === 'number' ? '' : sizeClasses} ${className}`}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
};
