import React, { useState } from 'react';
import { Difficulty, GameHistoryItem, Screen } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { ArrowLeft, Clock, BookmarkCheck } from 'lucide-react';

interface HistoryScreenProps {
  history: GameHistoryItem[];
  onNavigate: (screen: Screen) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onNavigate,
}) => {
  const { activePrimary, activeOnPrimary } = useTheme();
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const filteredHistory = history.filter(item => {
    if (filterDifficulty === 'all') return true;
    return item.difficulty === filterDifficulty;
  });

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
            Game History
          </h1>
          <p
            className="text-xs sm:text-sm font-medium mt-0.5"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Archived puzzle records and solve times.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['all', 'easy', 'medium', 'hard', 'expert'].map(tab => {
          const isSelected = filterDifficulty === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterDifficulty(tab)}
              style={{
                backgroundColor: isSelected
                  ? 'var(--md-sys-color-primary)'
                  : 'var(--md-sys-color-surface-container-high)',
                color: isSelected
                  ? 'var(--md-sys-color-on-primary)'
                  : 'var(--md-sys-color-on-surface-variant)',
              }}
              className="px-3 py-1.5 rounded-lg font-bold capitalize transition-colors whitespace-nowrap shadow-xs hover:opacity-85"
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            borderColor: 'var(--md-sys-color-outline)',
          }}
          className="p-8 rounded-2xl border border-dashed text-center space-y-2"
        >
          <BookmarkCheck className="w-10 h-10 text-slate-400 mx-auto" />
          <div
            className="text-base font-bold"
            style={{ color: 'var(--md-sys-color-on-surface)' }}
          >
            No history recorded yet
          </div>
          <p
            className="text-xs max-w-sm mx-auto"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Complete a Sudoku puzzle to see your detailed match results, duration, and score history.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map(item => {
            const minutes = Math.floor(item.durationSeconds / 60);
            const seconds = item.durationSeconds % 60;
            const timeFormatted = `${minutes}m ${seconds}s`;

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--md-sys-color-surface)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                }}
                className="p-4 rounded-xl border shadow-xs flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold uppercase tracking-wider capitalize"
                      style={{ color: 'var(--md-sys-color-on-surface)' }}
                    >
                      {item.difficulty}
                    </span>
                    {item.isDaily && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
                        Daily
                      </span>
                    )}
                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>·</span>
                    <span
                      className="text-xs"
                      style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                      {item.date}
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-3 text-xs font-medium"
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                  >
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 opacity-70" />
                      {timeFormatted}
                    </span>
                    <span>·</span>
                    <span>Mistakes: {item.mistakes}</span>
                    <span>·</span>
                    <span>Score: {item.score}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      item.won
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {item.won ? 'Solved' : 'Abandoned'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
