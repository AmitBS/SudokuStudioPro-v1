import React from 'react';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  shortLabel?: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (val: T) => void;
  ariaLabel?: string;
  size?: 'sm' | 'md';
  columns?: 1 | 2 | 3 | 4 | 'auto';
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'md',
  columns,
  className = '',
}: SegmentedControlProps<T>) {
  // Determine responsive grid columns based on option count
  let gridColsClass = 'grid-cols-2';
  if (columns === 4 || (!columns && options.length === 4)) {
    gridColsClass = 'grid-cols-2 md:grid-cols-4';
  } else if (columns === 3 || (!columns && options.length === 3)) {
    gridColsClass = 'grid-cols-3';
  } else if (columns === 2 || (!columns && options.length === 2)) {
    gridColsClass = 'grid-cols-2';
  } else if (columns === 1 || options.length === 1) {
    gridColsClass = 'grid-cols-1';
  } else if (options.length > 4) {
    gridColsClass = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5';
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`grid w-full max-w-full items-center p-1 rounded-xl border shadow-inner transition-colors gap-1.5 ${gridColsClass} ${className}`}
      style={{
        borderColor: 'var(--md-sys-color-outline-variant)',
        backgroundColor: 'var(--md-sys-color-surface-container-high)',
      }}
    >
      {options.map(opt => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className={`w-full min-w-0 max-w-full flex items-center justify-center gap-1.5 transition-all duration-150 font-medium rounded-lg text-center ${
              size === 'sm' ? 'py-1.5 px-2 text-xs' : 'py-2 px-2.5 text-xs sm:text-sm'
            } ${isSelected ? 'shadow-sm font-semibold' : 'hover:opacity-85'}`}
            style={{
              backgroundColor: isSelected ? 'var(--md-sys-color-primary)' : 'transparent',
              color: isSelected
                ? 'var(--md-sys-color-on-primary)'
                : 'var(--md-sys-color-on-surface-variant)',
            }}
          >
            {opt.icon && <span className="shrink-0 flex items-center justify-center">{opt.icon}</span>}
            {opt.shortLabel ? (
              <>
                <span className="truncate sm:hidden">{opt.shortLabel}</span>
                <span className="truncate hidden sm:inline">{opt.label}</span>
              </>
            ) : (
              <span className="truncate">{opt.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
