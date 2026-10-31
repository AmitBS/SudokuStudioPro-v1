import React from 'react';
import { Difficulty } from '../../types/sudoku';

export interface DifficultyConfig {
  label: string;
  level: number;
  color: string;
  lightBg: string;
  darkBg: string;
  lightBorder: string;
  darkBorder: string;
  lightText: string;
  darkText: string;
  dotColor: string;
  accentBorder: string;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'Easy',
    level: 1,
    color: '#10B981', // Emerald green
    lightBg: 'rgba(16, 185, 129, 0.12)',
    darkBg: 'rgba(16, 185, 129, 0.22)',
    lightBorder: 'rgba(16, 185, 129, 0.35)',
    darkBorder: 'rgba(16, 185, 129, 0.45)',
    lightText: '#065F46',
    darkText: '#6EE7B7',
    dotColor: '#10B981',
    accentBorder: '#10B981',
  },
  medium: {
    label: 'Medium',
    level: 2,
    color: '#F59E0B', // Amber / Gold
    lightBg: 'rgba(245, 158, 11, 0.12)',
    darkBg: 'rgba(245, 158, 11, 0.22)',
    lightBorder: 'rgba(245, 158, 11, 0.35)',
    darkBorder: 'rgba(245, 158, 11, 0.45)',
    lightText: '#92400E',
    darkText: '#FDE68A',
    dotColor: '#F59E0B',
    accentBorder: '#F59E0B',
  },
  hard: {
    label: 'Hard',
    level: 3,
    color: '#F97316', // Orange / Coral
    lightBg: 'rgba(249, 115, 22, 0.12)',
    darkBg: 'rgba(249, 115, 22, 0.22)',
    lightBorder: 'rgba(249, 115, 22, 0.35)',
    darkBorder: 'rgba(249, 115, 22, 0.45)',
    lightText: '#9A3412',
    darkText: '#FDBA74',
    dotColor: '#F97316',
    accentBorder: '#F97316',
  },
  expert: {
    label: 'Expert',
    level: 4,
    color: '#A855F7', // Royal Purple
    lightBg: 'rgba(168, 85, 247, 0.12)',
    darkBg: 'rgba(168, 85, 247, 0.22)',
    lightBorder: 'rgba(168, 85, 247, 0.35)',
    darkBorder: 'rgba(168, 85, 247, 0.45)',
    lightText: '#6B21A8',
    darkText: '#E9D5FF',
    dotColor: '#A855F7',
    accentBorder: '#A855F7',
  },
};

export const getDifficultyConfig = (difficulty: string): DifficultyConfig => {
  const normalized = difficulty.toLowerCase() as Difficulty;
  return DIFFICULTY_CONFIG[normalized] || DIFFICULTY_CONFIG.easy;
};

interface DifficultyBadgeProps {
  difficulty: Difficulty | string;
  size?: 'sm' | 'md' | 'lg';
  showIndicatorDot?: boolean;
  showLevelBars?: boolean;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  size = 'md',
  showIndicatorDot = true,
  showLevelBars = false,
  className = '',
}) => {
  const config = getDifficultyConfig(difficulty);

  // Size variations
  const sizeStyles = {
    sm: {
      container: 'px-2 py-0.5 text-[10px] gap-1.5',
      dot: 'w-1.5 h-1.5',
      bar: 'w-1 h-2',
    },
    md: {
      container: 'px-2.5 py-0.5 text-[11px] gap-1.5',
      dot: 'w-2 h-2',
      bar: 'w-1 h-2.5',
    },
    lg: {
      container: 'px-3 py-1 text-xs gap-2',
      dot: 'w-2.5 h-2.5',
      bar: 'w-1.5 h-3',
    },
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-extrabold uppercase tracking-wider border shadow-2xs select-none transition-all duration-200 ${sizeStyles.container} ${className}`}
      style={{
        backgroundColor: config.lightBg,
        borderColor: config.lightBorder,
        color: config.lightText,
      }}
    >
      {/* Visual Indicator Dot */}
      {showIndicatorDot && (
        <span
          className={`rounded-full shrink-0 shadow-xs ring-1 ring-white/60 dark:ring-black/40 ${sizeStyles.dot}`}
          style={{ backgroundColor: config.dotColor }}
          aria-hidden="true"
        />
      )}

      {/* Difficulty Label */}
      <span>{config.label}</span>

      {/* Optional Glanceable Level Bars (1 to 4 bars) */}
      {showLevelBars && (
        <span className="flex items-center gap-0.5 ml-0.5" aria-label={`Difficulty level ${config.level} of 4`}>
          {[1, 2, 3, 4].map(step => (
            <span
              key={step}
              className={`rounded-xs transition-opacity ${sizeStyles.bar}`}
              style={{
                backgroundColor: config.dotColor,
                opacity: step <= config.level ? 1 : 0.22,
              }}
            />
          ))}
        </span>
      )}
    </span>
  );
};
