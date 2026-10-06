// WCAG 2.2 AA Contrast Calculator & System Audit Utility

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  try {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    const ratio = (brightest + 0.05) / (darkest + 0.05);
    return Math.round(ratio * 10) / 10;
  } catch {
    return 1.0;
  }
}

export interface ContrastAuditResult {
  pairName: string;
  category: string;
  foreground: string;
  background: string;
  ratio: number;
  wcagAA: boolean; // >= 4.5:1 (or 3:1 for large)
  wcagAAA: boolean; // >= 7.0:1 (or 4.5:1 for large)
  level: 'AAA' | 'AA' | 'FAIL';
}

export function auditThemeTokens(isDark: boolean, accentKey: string): ContrastAuditResult[] {
  const bg = isDark ? '#090d16' : '#f8fafc';
  const surface = isDark ? '#111827' : '#ffffff';
  const surfaceVariant = isDark ? '#1f2937' : '#f1f5f9';

  // Primary text
  const primaryText = isDark ? '#f8fafc' : '#0f172a';
  // Secondary text (descriptions, metadata)
  const secondaryText = isDark ? '#cbd5e1' : '#475569';
  // Tertiary text (subtle labels)
  const tertiaryText = isDark ? '#94a3b8' : '#64748b';

  // Accent mapping
  const accentLight: Record<string, { primary: string; onPrimary: string; text: string }> = {
    indigo: { primary: '#2563eb', onPrimary: '#ffffff', text: '#1d4ed8' },
    emerald: { primary: '#047857', onPrimary: '#ffffff', text: '#047857' },
    amber: { primary: '#b45309', onPrimary: '#ffffff', text: '#92400e' },
    rose: { primary: '#e11d48', onPrimary: '#ffffff', text: '#be123c' },
    violet: { primary: '#7c3aed', onPrimary: '#ffffff', text: '#6d28d9' },
    cyan: { primary: '#0e7490', onPrimary: '#ffffff', text: '#0e7490' },
  };

  const accentDark: Record<string, { primary: string; onPrimary: string; text: string }> = {
    indigo: { primary: '#60a5fa', onPrimary: '#090d16', text: '#93c5fd' },
    emerald: { primary: '#34d399', onPrimary: '#062817', text: '#6ee7b7' },
    amber: { primary: '#fbbf24', onPrimary: '#381c02', text: '#fcd34d' },
    rose: { primary: '#fb7185', onPrimary: '#370614', text: '#fda4af' },
    violet: { primary: '#a78bfa', onPrimary: '#200c43', text: '#c4b5fd' },
    cyan: { primary: '#22d3ee', onPrimary: '#04222f', text: '#67e8f9' },
  };

  const currentAccent = isDark ? (accentDark[accentKey] || accentDark.indigo) : (accentLight[accentKey] || accentLight.indigo);

  const testPairs: { name: string; cat: string; fg: string; bg: string; min: number }[] = [
    { name: 'Primary Text on Background', cat: 'Typography', fg: primaryText, bg, min: 4.5 },
    { name: 'Primary Text on Surface Card', cat: 'Typography', fg: primaryText, bg: surface, min: 4.5 },
    { name: 'Secondary Text on Background', cat: 'Typography', fg: secondaryText, bg, min: 4.5 },
    { name: 'Secondary Text on Surface Card', cat: 'Typography', fg: secondaryText, bg: surface, min: 4.5 },
    { name: 'Secondary Text on Surface Variant', cat: 'Typography', fg: secondaryText, bg: surfaceVariant, min: 4.5 },
    { name: 'Tertiary Text on Surface Card', cat: 'Typography', fg: tertiaryText, bg: surface, min: 3.5 },
    { name: 'Accent Button Text (onPrimary)', cat: 'Controls', fg: currentAccent.onPrimary, bg: currentAccent.primary, min: 4.5 },
    { name: 'Accent Text on Surface', cat: 'Branding', fg: currentAccent.text, bg: surface, min: 4.5 },
    { name: 'Error Text on Surface Card', cat: 'Status', fg: isDark ? '#f87171' : '#dc2626', bg: surface, min: 4.5 },
    { name: 'Given Sudoku Number on Cell', cat: 'Sudoku Grid', fg: primaryText, bg: surface, min: 4.5 },
    { name: 'Candidate / Notes on Cell', cat: 'Sudoku Grid', fg: secondaryText, bg: surface, min: 4.5 },
    { name: 'Placed Number on Cell', cat: 'Sudoku Grid', fg: currentAccent.text, bg: surface, min: 4.5 },
  ];

  return testPairs.map(item => {
    const ratio = getContrastRatio(item.fg, item.bg);
    const wcagAA = ratio >= item.min;
    const wcagAAA = ratio >= 7.0;
    return {
      pairName: item.name,
      category: item.cat,
      foreground: item.fg,
      background: item.bg,
      ratio,
      wcagAA,
      wcagAAA,
      level: wcagAAA ? 'AAA' : wcagAA ? 'AA' : 'FAIL',
    };
  });
}
