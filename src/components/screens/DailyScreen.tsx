import React from 'react';
import { Difficulty, Screen } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { ArrowLeft, Flame, CheckCircle2, Play, Star } from 'lucide-react';

interface DailyScreenProps {
  onStartDailyGame: (dateStr: string, difficulty: Difficulty) => void;
  onNavigate: (screen: Screen) => void;
  streak: number;
}

export const DailyScreen: React.FC<DailyScreenProps> = ({
  onStartDailyGame,
  onNavigate,
  streak,
}) => {
  const { activePrimary, activeOnPrimary } = useTheme();

  // Current date
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Generate past 7 days for calendar
  const pastDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const isToday = dStr === todayStr;
    return { dateStr: dStr, dayName, dayNum, isToday };
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
            Daily Sudoku
          </h1>
          <p
            className="text-xs sm:text-sm font-medium mt-0.5"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            A new synchronized challenge every calendar day.
          </p>
        </div>
      </div>

      {/* Streak Banner */}
      <div
        style={{
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          borderColor: 'rgba(245, 158, 11, 0.35)',
        }}
        className="p-5 rounded-2xl border flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
            <Flame className="w-7 h-7 fill-amber-500" />
          </div>
          <div>
            <div
              className="text-xl font-extrabold"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              {streak} Day Streak
            </div>
            <p
              className="text-xs font-medium"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Solve today's puzzle to maintain your daily streak!
            </p>
          </div>
        </div>
        <div className="text-right">
          <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
        </div>
      </div>

      {/* 7-Day Calendar Strip */}
      <div className="space-y-2">
        <div
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
        >
          This Week
        </div>
        <div className="grid grid-cols-7 gap-2">
          {pastDays.map(day => (
            <div
              key={day.dateStr}
              style={{
                backgroundColor: day.isToday
                  ? 'var(--md-sys-color-surface-container-high)'
                  : 'var(--md-sys-color-surface)',
                borderColor: day.isToday
                  ? 'var(--md-sys-color-primary)'
                  : 'var(--md-sys-color-outline-variant)',
              }}
              className="p-2.5 rounded-xl border text-center transition-all shadow-xs"
            >
              <div
                className="text-[10px] font-semibold uppercase"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                {day.dayName}
              </div>
              <div
                className="text-base font-bold font-mono mt-0.5"
                style={{ color: 'var(--md-sys-color-on-surface)' }}
              >
                {day.dayNum}
              </div>
              <div className="mt-1 flex justify-center">
                {day.isToday ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Challenge Card */}
      <div
        style={{
          backgroundColor: 'var(--md-sys-color-surface)',
          borderColor: 'var(--md-sys-color-outline-variant)',
        }}
        className="p-6 rounded-2xl border shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: 'var(--md-sys-color-primary)' }}
            >
              Today's Challenge
            </div>
            <h2
              className="text-xl font-bold mt-0.5"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>
          </div>
          <span
            style={{
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              borderColor: 'var(--md-sys-color-outline-variant)',
              color: 'var(--md-sys-color-on-surface)',
            }}
            className="px-3 py-1 rounded-lg text-xs font-bold border"
          >
            Medium Tier
          </span>
        </div>

        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
        >
          Today's puzzle features an elegant symmetric pattern with 32 starting clues. Perfect for training hidden singles and intersection logic.
        </p>

        <button
          type="button"
          onClick={() => onStartDailyGame(todayStr, 'medium')}
          className="w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
          style={{
            backgroundColor: 'var(--md-sys-color-primary)',
            color: 'var(--md-sys-color-on-primary)',
          }}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Play Today's Challenge</span>
        </button>
      </div>
    </div>
  );
};
