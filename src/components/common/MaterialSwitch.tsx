import React from 'react';
import { useTheme } from '../../theme/themeContext';

interface MaterialSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export const MaterialSwitch: React.FC<MaterialSwitchProps> = ({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <div className="flex items-start justify-between gap-4 py-3 group">
      <label htmlFor={id} className="cursor-pointer select-none flex-1 pr-2">
        <div
          className="text-base font-semibold transition-colors"
          style={{ color: 'var(--md-sys-color-on-surface)' }}
        >
          {label}
        </div>
        {description && (
          <div
            className="text-sm font-normal mt-0.5 leading-relaxed"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            {description}
          </div>
        )}
      </label>

      <button
        id={id}
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          disabled ? 'opacity-40 cursor-not-allowed' : ''
        }`}
        style={{
          backgroundColor: checked
            ? 'var(--md-sys-color-primary)'
            : 'var(--md-sys-color-surface-container-high)',
          borderColor: checked
            ? 'var(--md-sys-color-primary)'
            : 'var(--md-sys-color-outline)',
        }}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          } mt-0.5`}
          style={{
            backgroundColor: checked
              ? 'var(--md-sys-color-on-primary)'
              : 'var(--md-sys-color-outline)',
          }}
        />
      </button>
    </div>
  );
};
