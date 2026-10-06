import React, { useState } from 'react';
import { Difficulty, PlayerStats, Screen } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { ArrowLeft, Flame, RotateCcw, ShieldAlert } from 'lucide-react';

interface StatisticsScreenProps {
  stats: PlayerStats;
  onResetStats: () => void;
  onNavigate: (screen: Screen) => void;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  stats,
  onResetStats,
  onNavigate,
}) => {
  const { activePrimary, activeOnPrimary } = useTheme();
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  const formatSeconds = (sec: number | null) => {
    if (sec === null || sec === undefined) return '--:--';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

  const winRate = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div
        className="flex items-center gap-3 pb-3 border-b"
        style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
      >
        <button
          type="button"
          onClick={() => onNavigate('home')}
          aria-label="Back"
          style={{ color: 'var(--md-sys-color-on-background)' }}
          className="p-2 -ml-2 rounded-xl hover:opacity-75 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: 'var(--md-sys-color-on-background)' }}
          >
            Statistics & Records
          </h1>
          <p
            className="text-xs sm:text-sm font-medium mt-0.5"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Detailed performance tracking and speed records.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
          className="p-4 rounded-xl border shadow-xs"
        >
          <div
            className="text-xs font-semibold mb-1"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Played
          </div>
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: 'var(--md-sys-color-on-surface)' }}
          >
            {stats.gamesPlayed}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
          className="p-4 rounded-xl border shadow-xs"
        >
          <div
            className="text-xs font-semibold mb-1"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Won
          </div>
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: 'var(--md-sys-color-on-surface)' }}
          >
            {stats.gamesWon}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
          className="p-4 rounded-xl border shadow-xs"
        >
          <div
            className="text-xs font-semibold mb-1"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Win Rate
          </div>
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: 'var(--md-sys-color-on-surface)' }}
          >
            {winRate}%
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
          className="p-4 rounded-xl border shadow-xs"
        >
          <div
            className="text-xs font-semibold mb-1 flex items-center gap-1"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Streak</span>
          </div>
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: 'var(--md-sys-color-on-surface)' }}
          >
            {stats.currentStreak}
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="space-y-3">
        <div
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
        >
          Breakdown By Tier
        </div>

        <div className="space-y-3">
          {difficulties.map(diff => {
            const diffStat = stats.byDifficulty[diff];
            const avgTime = diffStat.won > 0 ? Math.round(diffStat.totalTimeSeconds / diffStat.won) : null;
            const rate = diffStat.played > 0 ? Math.round((diffStat.won / diffStat.played) * 100) : 0;

            return (
              <div
                key={diff}
                style={{
                  backgroundColor: 'var(--md-sys-color-surface)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                }}
                className="p-4 rounded-2xl border shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-base font-bold capitalize"
                    style={{ color: 'var(--md-sys-color-on-surface)' }}
                  >
                    {diff}
                  </span>
                  <span
                    className="text-xs font-mono font-semibold"
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                  >
                    {diffStat.won} / {diffStat.played} Won ({rate}%)
                  </span>
                </div>

                <div
                  style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)' }}
                  className="w-full h-2 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${rate}%`,
                      backgroundColor: 'var(--md-sys-color-primary)',
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1 text-xs">
                  <div>
                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Best Time:</span>{' '}
                    <span
                      className="font-mono font-bold"
                      style={{ color: 'var(--md-sys-color-on-surface)' }}
                    >
                      {formatSeconds(diffStat.bestTimeSeconds)}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Avg Time:</span>{' '}
                    <span
                      className="font-mono font-bold"
                      style={{ color: 'var(--md-sys-color-on-surface)' }}
                    >
                      {formatSeconds(avgTime)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Statistics */}
      <div
        className="pt-4 border-t"
        style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
      >
        <button
          type="button"
          onClick={() => setShowConfirmReset(true)}
          className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Statistics</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          style={{ backgroundColor: 'rgba(9, 13, 22, 0.75)' }}
        >
          <div
            style={{
              backgroundColor: 'var(--md-sys-color-surface)',
              borderColor: 'var(--md-sys-color-outline-variant)',
            }}
            className="w-full max-w-sm rounded-2xl border shadow-2xl p-6 text-center space-y-4"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2
              className="text-lg font-bold"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              Reset Statistics?
            </h2>
            <p
              className="text-sm"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              This will permanently clear your win counts, solve times, and streaks. This cannot be undone.
            </p>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                style={{
                  borderColor: 'var(--md-sys-color-outline-variant)',
                  color: 'var(--md-sys-color-on-surface)',
                }}
                className="flex-1 py-2 px-4 rounded-xl text-sm font-semibold border"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetStats();
                  setShowConfirmReset(false);
                }}
                className="flex-1 py-2 px-4 rounded-xl text-sm font-bold bg-rose-600 text-white hover:bg-rose-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
