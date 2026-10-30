import React from 'react';
import { useTheme } from '../../theme/themeContext';
import { Clock, Pause, Play } from 'lucide-react';

interface GameTimerProps {
  elapsedSeconds: number;
  isPaused: boolean;
  onTogglePause: () => void;
  disabled?: boolean;
}

export function formatElapsedTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export const GameTimer: React.FC<GameTimerProps> = ({
  elapsedSeconds,
  isPaused,
  onTogglePause,
  disabled = false,
}) => {
  const { isDark, activePrimary } = useTheme();
  const timeFormatted = formatElapsedTime(elapsedSeconds);

  return (
    <button
      type="button"
      onClick={onTogglePause}
      disabled={disabled}
      aria-label={
        isPaused
          ? `Timer paused at ${timeFormatted}. Click or tap to resume game`
          : `Elapsed time: ${timeFormatted}. Click or tap to pause game`
      }
      title={
        isPaused
          ? 'Timer paused - click to resume game'
          : 'Elapsed time - click to pause game'
      }
      className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all select-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xs ${
        isPaused ? 'ring-2 ring-amber-500/30' : ''
      }`}
      style={{
        backgroundColor: isPaused
          ? 'var(--md-sys-color-surface-container-high)'
          : 'var(--md-sys-color-surface)',
        borderColor: isPaused
          ? '#F59E0B'
          : 'var(--md-sys-color-outline-variant)',
        color: isPaused
          ? '#F59E0B'
          : 'var(--md-sys-color-on-surface)',
      }}
    >
      {/* Live status pulsing dot */}
      <span className="relative flex items-center justify-center shrink-0">
        {isPaused ? (
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        ) : (
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: '#22C55E' }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: '#22C55E' }}
            />
          </span>
        )}
      </span>

      {/* Clock icon with state coloring */}
      <Clock
        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform ${
          !isPaused ? 'text-emerald-500 dark:text-emerald-400 group-hover:rotate-12' : 'text-amber-500'
        }`}
      />

      {/* Real-time formatted elapsed numbers */}
      <span className="font-mono text-xs sm:text-sm font-bold tracking-tight tabular-nums">
        {timeFormatted}
      </span>

      {/* Visual Paused badge or subtle Pause icon */}
      {isPaused ? (
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded font-sans shrink-0 flex items-center gap-1"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.18)',
            color: '#F59E0B',
          }}
        >
          <Play className="w-2.5 h-2.5 fill-current" />
          <span>Paused</span>
        </span>
      ) : (
        <span
          className="p-0.5 rounded opacity-40 group-hover:opacity-90 transition-opacity shrink-0"
          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          title="Pause Game"
        >
          <Pause className="w-3 h-3 fill-current" />
        </span>
      )}
    </button>
  );
};
