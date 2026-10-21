import React, { useState } from 'react';
import bananaImage from '../assets/fruits/banana.png';
import orangeImage from '../assets/fruits/orange.png';
import kiwiImage from '../assets/fruits/kiwi.png';
import coconutImage from '../assets/fruits/coconut.png';

export interface SudokuFruitMeta {
  value: number;
  name: string;
  ariaLabel: string;
  primaryColor: string;
  description: string;
  imageSrc?: string;
  fallbackImageSrc?: string;
}

/**
 * 9 Unique Fruits with 9 Distinct Colors in Realistic, High-Quality 3D:
 * 1 -> Mango        (Golden Yellow  - #FBBF24) [Mandatory - No leaf, clearly different from Orange]
 * 2 -> Banana       (Bright Yellow  - #FACC15) [Mandatory]
 * 3 -> Apple        (Crimson Red    - #EF4444) [Mandatory]
 * 4 -> Orange       (Vivid Orange   - #EA580C) [Textured pores, calyx, green leaf]
 * 5 -> Kiwi         (Lime Green     - #22C55E) [User attached 3D sliced kiwi image]
 * 6 -> Grapes       (Royal Purple   - #9333EA)
 * 7 -> Blueberry    (Sapphire Blue  - #2563EB)
 * 8 -> Dragonfruit  (Hot Pink       - #EC4899)
 * 9 -> Coconut      (Earthy Brown   - #78350F) [User attached 3D coconut half image]
 */
export const SUDOKU_FRUITS: Record<number, SudokuFruitMeta> = {
  1: {
    value: 1,
    name: 'Mango',
    ariaLabel: 'Value 1, 3D golden mango',
    primaryColor: '#FBBF24',
    description: 'Realistic 3D golden Alphonso mango with woody stem and smooth sunlit silhouette (no leaf)',
  },
  2: {
    value: 2,
    name: 'Banana',
    ariaLabel: 'Value 2, 3D yellow banana bunch',
    primaryColor: '#FACC15',
    imageSrc: bananaImage,
    fallbackImageSrc: '/assets/fruits/banana.png',
    description: 'Realistic 3D cluster of ripe yellow bananas with brown tips',
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
    ariaLabel: 'Value 4, 3D sliced citrus orange',
    primaryColor: '#EA580C',
    imageSrc: orangeImage,
    fallbackImageSrc: '/assets/fruits/orange.png',
    description: 'Realistic 3D juicy sliced citrus orange half showing pulp and peel',
  },
  5: {
    value: 5,
    name: 'Kiwi',
    ariaLabel: 'Value 5, 3D green kiwi',
    primaryColor: '#22C55E',
    imageSrc: kiwiImage,
    fallbackImageSrc: '/assets/fruits/kiwi.png',
    description: 'Realistic 3D sliced lime-green kiwi half with seed ring, creamy core, and fuzzy rind',
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
    imageSrc: coconutImage,
    fallbackImageSrc: '/assets/fruits/coconut.png',
    description: 'Realistic 3D fibrous brown coconut half with succulent white meat',
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
  // 1: Mango (Golden Yellow) - Realistic 3D Alphonso Mango (Stem only, NO leaf, distinct golden yellow)
  1: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <radialGradient id="m3d-body" cx="35%" cy="30%" r="68%">
        <stop offset="0%" stop-color="#FFFBEB"/>
        <stop offset="20%" stop-color="#FEF08A"/>
        <stop offset="50%" stop-color="#FBBF24"/>
        <stop offset="80%" stop-color="#F59E0B"/>
        <stop offset="95%" stop-color="#D97706"/>
        <stop offset="100%" stop-color="#B45309"/>
      </radialGradient>
      <radialGradient id="m3d-warmglow" cx="72%" cy="60%" r="48%">
        <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.8"/>
        <stop offset="55%" stop-color="#D97706" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#FBBF24" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="m3d-stem" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#A16207"/>
        <stop offset="60%" stop-color="#713F12"/>
        <stop offset="100%" stop-color="#3B1A04"/>
      </linearGradient>
    </defs>
    <!-- Soft Ambient Ground Shadow -->
    <ellipse cx="16" cy="29.2" rx="8" ry="1.8" fill="#000000" opacity="0.18"/>
    <!-- 3D Woody Stem Only (NO LEAF - clearly differentiated from Orange) -->
    <path d="M16 6.5 C15.5 4.5 14.5 2.5 13 1.5" stroke="url(#m3d-stem)" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M15.8 6 C15.4 4.3 14.6 2.8 13.4 2" stroke="#EAB308" stroke-width="0.7" stroke-linecap="round" fill="none" opacity="0.7"/>
    <ellipse cx="13" cy="1.6" rx="1.1" ry="0.6" transform="rotate(-30 13 1.6)" fill="#78350F"/>
    <!-- Main 3D Mango Body - Smooth Tropical Kidney Silhouette -->
    <path d="M16 6 C22.8 6 27.2 11 26.2 18.5 C25.2 24.8 19.5 28.5 14.5 28.5 C9 28.5 5.5 23.5 6.5 15.5 C7.5 8.5 11.5 6 16 6 Z" fill="url(#m3d-body)"/>
    <!-- 3D Warm Sunset Ripe Glow Overlay -->
    <path d="M16 6 C22.8 6 27.2 11 26.2 18.5 C25.2 24.8 19.5 28.5 14.5 28.5 C9 28.5 5.5 23.5 6.5 15.5 C7.5 8.5 11.5 6 16 6 Z" fill="url(#m3d-warmglow)"/>
    <!-- Contact Shadow Under Stem onto Mango Top -->
    <ellipse cx="16" cy="6.6" rx="2.2" ry="1" fill="#451A03" opacity="0.3"/>
    <!-- 3D Rim Bounce Light (Bottom Left) -->
    <path d="M7.5 17.5 C7 22.5 10 26.5 14 27.8" stroke="#FEF08A" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.65"/>
    <!-- Volumetric Glossy Specular Light Reflection (Top Left) -->
    <ellipse cx="12" cy="12" rx="3.5" ry="5.5" transform="rotate(-25 12 12)" fill="#FFFFFF" opacity="0.5"/>
    <ellipse cx="11" cy="10.5" rx="1.5" ry="2.8" transform="rotate(-25 11 10.5)" fill="#FFFFFF" opacity="0.9"/>
  </svg>`,

  // 2: Banana (Bright Yellow) - Realistic 3D Banana Bunch
  2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <image href="${bananaImage}" x="1" y="1" width="30" height="30" preserveAspectRatio="xMidYMid meet" />
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
      </linearGradient>
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

  // 4: Orange (Vivid Citrus Orange) - Realistic 3D Sliced Orange
  4: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <image href="${orangeImage}" x="1" y="1" width="30" height="30" preserveAspectRatio="xMidYMid meet" />
  </svg>`,

  // 5: Kiwi (Lime Green) - Realistic 3D Sliced Kiwi
  5: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <image href="${kiwiImage}" x="1" y="1" width="30" height="30" preserveAspectRatio="xMidYMid meet" />
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
    <!-- Back Occluded Grapes -->
    <circle cx="11.5" cy="14" r="3.2" fill="url(#g3d-dark)"/>
    <circle cx="20.5" cy="14" r="3.2" fill="url(#g3d-dark)"/>
    <circle cx="16" cy="18.5" r="3.2" fill="url(#g3d-dark)"/>
    <!-- Middle Layer Grapes -->
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
    <circle cx="11.5" cy="18.5" r="0.7" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="20.5" cy="19.5" r="3.3" fill="url(#g3d-berry)"/>
    <circle cx="20.5" cy="18.5" r="0.7" fill="#FFFFFF" opacity="0.8"/>
    <!-- Row 4 -->
    <circle cx="13.5" cy="24" r="3.2" fill="url(#g3d-berry)"/>
    <circle cx="13.5" cy="23" r="0.7" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="18.5" cy="24" r="3.2" fill="url(#g3d-berry)"/>
    <circle cx="18.5" cy="23" r="0.7" fill="#FFFFFF" opacity="0.8"/>
    <!-- Bottom Terminal Grape -->
    <circle cx="16" cy="27.2" r="2.8" fill="url(#g3d-berry)"/>
    <circle cx="16" cy="26.3" r="0.6" fill="#FFFFFF" opacity="0.85"/>
  </svg>`,

  // 7: Blueberry (Sapphire Blue) - Realistic 3D Blueberry with Calyx Crown
  7: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <defs>
      <radialGradient id="bb3d-body" cx="35%" cy="30%" r="68%">
        <stop offset="0%" stop-color="#93C5FD"/>
        <stop offset="25%" stop-color="#3B82F6"/>
        <stop offset="60%" stop-color="#2563EB"/>
        <stop offset="85%" stop-color="#1D4ED8"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </radialGradient>
      <radialGradient id="bb3d-cavity" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#020617"/>
        <stop offset="70%" stop-color="#1E3A8A" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#2563EB" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="bb3d-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4ADE80"/>
        <stop offset="50%" stop-color="#22C55E"/>
        <stop offset="100%" stop-color="#15803D"/>
      </linearGradient>
    </defs>
    <!-- Ground Shadow -->
    <ellipse cx="16" cy="28.8" rx="8" ry="2" fill="#000000" opacity="0.2"/>
    <!-- Green Leaf in Background -->
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
    <!-- 3D Layered Scales with Depth Shadows -->
    <path d="M6 13.5 C3 11 4.5 8 8 10 C6.5 12 6 13.5 6 13.5 Z" fill="url(#df3d-scale-l)"/>
    <path d="M7 14 C5.5 13 6 10.5 8 11.5" stroke="#700731" stroke-width="0.8" opacity="0.3" fill="none"/>
    <path d="M26 13.5 C29 11 27.5 8 24 10 C25.5 12 26 13.5 26 13.5 Z" fill="url(#df3d-scale-r)"/>
    <path d="M6.8 19 C3.8 17.5 4.8 14 9 16 C7.5 18 7 19 6.8 19 Z" fill="url(#df3d-scale-l)"/>
    <path d="M25.2 19 C28.2 17.5 27.2 14 23 16 C24.5 18 25 19 25.2 19 Z" fill="url(#df3d-scale-r)"/>
    <path d="M9.5 25 C6.5 24.5 7.5 21 11.5 22.5 C10 24 9.5 25 9.5 25 Z" fill="url(#df3d-scale-l)"/>
    <path d="M22.5 25 C25.5 24.5 24.5 21 20.5 22.5 C22 24 22.5 25 22.5 25 Z" fill="url(#df3d-scale-r)"/>
    <!-- Center Front Scales -->
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
    <image href="${coconutImage}" x="1" y="1" width="30" height="30" preserveAspectRatio="xMidYMid meet" />
  </svg>`,
};

// Cached Image elements for Hardware-Accelerated Canvas Rendering
const cachedFruitImages: Record<number, HTMLImageElement> = {};

if (typeof window !== 'undefined') {
  Object.entries(SUDOKU_FRUITS).forEach(([valStr, meta]) => {
    const num = Number(valStr);
    const img = new Image();
    if (meta.imageSrc) {
      img.src = meta.imageSrc;
    } else if (FRUIT_SVG_STRINGS[num]) {
      img.src = `data:image/svg+xml;utf8,${encodeURIComponent(FRUIT_SVG_STRINGS[num])}`;
    }
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
  const color = meta?.primaryColor || '#FBBF24';
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
 * High-definition realistic 3D component for Fruit Mode.
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

  // If the fruit has a direct 3D image asset (Banana, Orange, Kiwi, Coconut)
  if (meta.imageSrc) {
    return (
      <span
        role="img"
        aria-label={ariaLabel}
        title={title || `${meta.name} (Value ${value})`}
        style={style}
        className={`inline-flex items-center justify-center shrink-0 select-none transition-transform duration-150 hover:scale-110 drop-shadow-2xs ${typeof size === 'number' ? '' : sizeClasses} ${className}`}
      >
        <img
          src={meta.imageSrc}
          alt={ariaLabel}
          className="w-full h-full object-contain pointer-events-none select-none"
          loading="eager"
          draggable={false}
          onError={e => {
            if (meta.fallbackImageSrc && !e.currentTarget.src.endsWith(meta.fallbackImageSrc)) {
              e.currentTarget.src = meta.fallbackImageSrc;
            }
          }}
        />
      </span>
    );
  }

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
