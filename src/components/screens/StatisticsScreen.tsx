import React, { useState, useMemo } from 'react';
import { Difficulty, GameHistoryItem, PlayerStats, Screen } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import {
  ArrowLeft,
  Flame,
  RotateCcw,
  ShieldAlert,
  TrendingUp,
  Clock,
  Zap,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface StatisticsScreenProps {
  stats: PlayerStats;
  history?: GameHistoryItem[];
  onResetStats: () => void;
  onNavigate: (screen: Screen) => void;
}

interface DayDataPoint {
  dateKey: string;
  dayLabel: string;
  fullDate: string;
  avgTimeSec: number | null;
  bestTimeSec: number | null;
  avgTimeMinutes: number | null;
  bestTimeMinutes: number | null;
  formattedAvg: string;
  formattedBest: string;
  gamesCompleted: number;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  stats,
  history: propHistory,
  onResetStats,
  onNavigate,
}) => {
  const { isDark, activePrimary } = useTheme();
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
  const [chartDifficulty, setChartDifficulty] = useState<string>('all');
  const [metricView, setMetricView] = useState<'both' | 'avg' | 'best'>('both');

  // Load history from props or localStorage
  const history: GameHistoryItem[] = useMemo(() => {
    if (propHistory && Array.isArray(propHistory)) return propHistory;
    try {
      const saved = localStorage.getItem('sudoku_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [];
  }, [propHistory]);

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

  // Compute 7-day completion time performance data
  const { chartData, weeklyTotalGames, weeklyAvgTimeSec, weeklyBestTimeSec } = useMemo(() => {
    const days: DayDataPoint[] = [];
    const today = new Date();

    let totalDurationSum = 0;
    let totalCompleted = 0;
    let fastestTime: number | null = null;

    // Filter games by selected tier
    const filteredGames = history.filter(item => {
      if (!item.won) return false;
      if (chartDifficulty !== 'all' && item.difficulty !== chartDifficulty) return false;
      return true;
    });

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - i);

      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      const dayName = i === 0
        ? 'Today'
        : i === 1
        ? 'Yest'
        : targetDate.toLocaleDateString('en-US', { weekday: 'short' });

      const fullDate = targetDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      // Find matching items from history for this day
      const dayGames = filteredGames.filter(item => {
        if (item.timestamp) {
          const itemD = new Date(item.timestamp);
          const iKey = `${itemD.getFullYear()}-${String(itemD.getMonth() + 1).padStart(2, '0')}-${String(itemD.getDate()).padStart(2, '0')}`;
          return iKey === dateKey;
        }
        // Fallback to item.date string
        try {
          const itemD = new Date(item.date);
          const iKey = `${itemD.getFullYear()}-${String(itemD.getMonth() + 1).padStart(2, '0')}-${String(itemD.getDate()).padStart(2, '0')}`;
          return iKey === dateKey;
        } catch {
          return false;
        }
      });

      if (dayGames.length > 0) {
        const sumDuration = dayGames.reduce((acc, g) => acc + (g.durationSeconds || 0), 0);
        const avgSec = Math.round(sumDuration / dayGames.length);
        const bestSec = Math.min(...dayGames.map(g => g.durationSeconds || 0));

        totalDurationSum += sumDuration;
        totalCompleted += dayGames.length;
        if (fastestTime === null || bestSec < fastestTime) {
          fastestTime = bestSec;
        }

        days.push({
          dateKey,
          dayLabel: dayName,
          fullDate,
          avgTimeSec: avgSec,
          bestTimeSec: bestSec,
          avgTimeMinutes: Number((avgSec / 60).toFixed(1)),
          bestTimeMinutes: Number((bestSec / 60).toFixed(1)),
          formattedAvg: formatSeconds(avgSec),
          formattedBest: formatSeconds(bestSec),
          gamesCompleted: dayGames.length,
        });
      } else {
        days.push({
          dateKey,
          dayLabel: dayName,
          fullDate,
          avgTimeSec: null,
          bestTimeSec: null,
          avgTimeMinutes: null,
          bestTimeMinutes: null,
          formattedAvg: '--:--',
          formattedBest: '--:--',
          gamesCompleted: 0,
        });
      }
    }

    const overallAvg = totalCompleted > 0 ? Math.round(totalDurationSum / totalCompleted) : null;

    return {
      chartData: days,
      weeklyTotalGames: totalCompleted,
      weeklyAvgTimeSec: overallAvg,
      weeklyBestTimeSec: fastestTime,
    };
  }, [history, chartDifficulty]);

  // Determine max minutes for chart scale
  const maxMinuteVal = useMemo(() => {
    let max = 5;
    chartData.forEach(d => {
      if (d.avgTimeMinutes && d.avgTimeMinutes > max) max = d.avgTimeMinutes;
      if (d.bestTimeMinutes && d.bestTimeMinutes > max) max = d.bestTimeMinutes;
    });
    return Math.ceil(max * 1.25);
  }, [chartData]);

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

      {/* WEEKLY PERFORMANCE LINE CHART (RECHARTS) */}
      <div
        style={{
          backgroundColor: 'var(--md-sys-color-surface)',
          borderColor: 'var(--md-sys-color-outline-variant)',
        }}
        className="p-4 sm:p-5 rounded-2xl border shadow-xs space-y-4"
      >
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" style={{ color: activePrimary }} />
              <h2
                className="text-base sm:text-lg font-bold"
                style={{ color: 'var(--md-sys-color-on-surface)' }}
              >
                Weekly Performance
              </h2>
            </div>
            <p
              className="text-xs font-medium"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Solve completion times across the last 7 days.
            </p>
          </div>

          {/* Difficulty Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs">
            {['all', 'easy', 'medium', 'hard', 'expert'].map(tab => {
              const isSelected = chartDifficulty === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setChartDifficulty(tab)}
                  style={{
                    backgroundColor: isSelected
                      ? activePrimary
                      : 'var(--md-sys-color-surface-container-high)',
                    color: isSelected
                      ? 'var(--md-sys-color-on-primary)'
                      : 'var(--md-sys-color-on-surface-variant)',
                  }}
                  className="px-2.5 py-1 rounded-lg font-bold capitalize transition-colors text-[11px] shrink-0"
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* View Mode Switcher (Average vs Fastest vs Both) */}
        <div className="flex items-center justify-between text-xs pt-1 border-t" style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}>
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }} className="text-[11px] font-semibold">
              Lines:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMetricView('both')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  metricView === 'both' ? 'font-bold underline' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ color: 'var(--md-sys-color-on-surface)' }}
              >
                Both
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setMetricView('avg')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  metricView === 'avg' ? 'font-bold underline' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ color: activePrimary }}
              >
                Avg Time
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setMetricView('best')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  metricView === 'best' ? 'font-bold underline' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ color: '#F59E0B' }}
              >
                Fastest
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            {(metricView === 'both' || metricView === 'avg') && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: activePrimary }} />
                <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Average</span>
              </span>
            )}
            {(metricView === 'both' || metricView === 'best') && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 rounded-full bg-amber-500" />
                <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Fastest</span>
              </span>
            )}
          </div>
        </div>

        {/* Recharts Chart Container */}
        <div className="w-full h-56 sm:h-64 pt-2 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 15, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
                vertical={false}
              />
              <XAxis
                dataKey="dayLabel"
                stroke="var(--md-sys-color-on-surface-variant)"
                tick={{ fill: 'var(--md-sys-color-on-surface-variant)', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--md-sys-color-outline-variant)' }}
              />
              <YAxis
                domain={[0, maxMinuteVal]}
                stroke="var(--md-sys-color-on-surface-variant)"
                tick={{ fill: 'var(--md-sys-color-on-surface-variant)', fontSize: 11 }}
                tickFormatter={(val: number) => `${val}m`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const data = payload[0].payload as DayDataPoint;
                    return (
                      <div
                        className="p-3 rounded-xl border shadow-xl space-y-1.5 text-xs backdrop-blur-md"
                        style={{
                          backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                          borderColor: 'var(--md-sys-color-outline-variant)',
                          color: 'var(--md-sys-color-on-surface)',
                        }}
                      >
                        <div className="font-bold flex items-center justify-between gap-4 border-b pb-1" style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}>
                          <span>{data.fullDate}</span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                            {data.gamesCompleted} {data.gamesCompleted === 1 ? 'game' : 'games'}
                          </span>
                        </div>
                        {data.gamesCompleted > 0 ? (
                          <div className="space-y-1 pt-0.5 font-mono">
                            <div className="flex items-center justify-between gap-3" style={{ color: activePrimary }}>
                              <span>Average:</span>
                              <span className="font-bold">{data.formattedAvg}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 text-amber-500">
                              <span>Fastest:</span>
                              <span className="font-bold">{data.formattedBest}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] italic" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            No games completed on this day
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {(metricView === 'both' || metricView === 'avg') && (
                <Line
                  type="monotone"
                  dataKey="avgTimeMinutes"
                  name="Average Time"
                  stroke={activePrimary}
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: activePrimary, strokeWidth: 1.5, stroke: '#fff' }}
                  activeDot={{ r: 5, fill: activePrimary, strokeWidth: 2, stroke: '#fff' }}
                  connectNulls
                  isAnimationActive
                />
              )}
              {(metricView === 'both' || metricView === 'best') && (
                <Line
                  type="monotone"
                  dataKey="bestTimeMinutes"
                  name="Fastest Time"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  strokeDasharray={metricView === 'both' ? '4 4' : undefined}
                  dot={{ r: 3.5, fill: '#F59E0B', strokeWidth: 1.5, stroke: '#fff' }}
                  activeDot={{ r: 5, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }}
                  connectNulls
                  isAnimationActive
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 7-Day Performance Metric Highlights */}
        <div
          className="grid grid-cols-3 gap-2 pt-2 border-t text-center"
          style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
        >
          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 space-y-0.5">
            <div className="text-[10px] font-semibold" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              7-Day Solves
            </div>
            <div className="text-sm sm:text-base font-bold font-mono" style={{ color: 'var(--md-sys-color-on-surface)' }}>
              {weeklyTotalGames}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 space-y-0.5">
            <div className="text-[10px] font-semibold" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Weekly Average
            </div>
            <div className="text-sm sm:text-base font-bold font-mono" style={{ color: activePrimary }}>
              {formatSeconds(weeklyAvgTimeSec)}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 space-y-0.5">
            <div className="text-[10px] font-semibold" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Fastest Solve
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-amber-500">
              {formatSeconds(weeklyBestTimeSec)}
            </div>
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
