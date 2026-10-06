import React from 'react';
import { ACCENT_PALETTES } from '../../theme/themeContext';
import { AccentColor } from '../../types/sudoku';
import { Check } from 'lucide-react';

interface AccentSwatchPickerProps {
  value: AccentColor;
  onChange: (accent: AccentColor) => void;
}

export const AccentSwatchPicker: React.FC<AccentSwatchPickerProps> = ({
  value,
  onChange,
}) => {
  const accents: AccentColor[] = ['indigo', 'emerald', 'amber', 'rose', 'violet', 'cyan'];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
      {accents.map(accKey => {
        const pal = ACCENT_PALETTES[accKey];
        const isSelected = value === accKey;

        return (
          <button
            key={accKey}
            type="button"
            onClick={() => onChange(accKey)}
            style={{
              backgroundColor: isSelected
                ? 'var(--md-sys-color-surface-container-high)'
                : 'var(--md-sys-color-surface)',
              borderColor: isSelected
                ? 'var(--md-sys-color-primary)'
                : 'var(--md-sys-color-outline-variant)',
            }}
            className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
              isSelected ? 'shadow-sm ring-2 ring-offset-1' : 'hover:opacity-90'
            }`}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs border border-black/10 dark:border-white/10"
              style={{ backgroundColor: pal.swatchHex }}
            >
              {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
            </div>
            <div className="min-w-0 flex-1">
              <div
                className="text-xs font-semibold truncate"
                style={{ color: 'var(--md-sys-color-on-surface)' }}
              >
                {pal.label}
              </div>
              <div
                className="text-[11px] capitalize"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                {accKey}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
