import React from 'react';
import { ActiveGame, Difficulty, PlayerStats, Screen } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { Play, Calendar, Camera, BookmarkCheck, ArrowRight, Trophy, Flame } from 'lucide-react';

interface HomeScreenProps {
  activeGame: ActiveGame | null;
  playerStats: PlayerStats;
  onStartNewGame: (difficulty: Difficulty) => void;
  onResumeGame: () => void;
  onNavigate: (screen: Screen) => void;
  onOpenInstallApp?: () => void;
}

const DIFFICULTY_THEMES: Record<
  Difficulty,
  {
    lightBg: string;
    darkBg: string;
    lightBorder: string;
    darkBorder: string;
    accentColor: string;
    darkAccentColor: string;
    badgeBg: string;
    darkBadgeBg: string;
    badgeText: string;
    darkBadgeText: string;
  }
> = {
  easy: {
    lightBg: '#F0FDF4', // Light gentle green
    darkBg: 'rgba(16, 185, 129, 0.12)',
    lightBorder: '#BBF7D0',
    darkBorder: 'rgba(16, 185, 129, 0.35)',
    accentColor: '#15803D',
    darkAccentColor: '#34D399',
    badgeBg: '#DCFCE7',
    darkBadgeBg: 'rgba(16, 185, 129, 0.22)',
    badgeText: '#166534',
    darkBadgeText: '#6EE7B7',
  },
  medium: {
    lightBg: '#FFFBEB', // Light gentle amber / yellow-gold
    darkBg: 'rgba(245, 158, 11, 0.12)',
    lightBorder: '#FDE68A',
    darkBorder: 'rgba(245, 158, 11, 0.35)',
    accentColor: '#B45309',
    darkAccentColor: '#FBBF24',
    badgeBg: '#FEF3C7',
    darkBadgeBg: 'rgba(245, 158, 11, 0.22)',
    badgeText: '#92400E',
    darkBadgeText: '#FDE68A',
  },
  hard: {
    lightBg: '#FFF7ED', // Light gentle orange / coral
    darkBg: 'rgba(249, 115, 22, 0.12)',
    lightBorder: '#FED7AA',
    darkBorder: 'rgba(249, 115, 22, 0.35)',
    accentColor: '#C2410C',
    darkAccentColor: '#FB923C',
    badgeBg: '#FFEDD5',
    darkBadgeBg: 'rgba(249, 115, 22, 0.22)',
    badgeText: '#9A3412',
    darkBadgeText: '#FDBA74',
  },
  expert: {
    lightBg: '#FAF5FF', // Light gentle purple / royal violet
    darkBg: 'rgba(168, 85, 247, 0.12)',
    lightBorder: '#E9D5FF',
    darkBorder: 'rgba(168, 85, 247, 0.35)',
    accentColor: '#7E22CE',
    darkAccentColor: '#C084FC',
    badgeBg: '#F3E8FF',
    darkBadgeBg: 'rgba(168, 85, 247, 0.22)',
    badgeText: '#6B21A8',
    darkBadgeText: '#E9D5FF',
  },
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  activeGame,
  playerStats,
  onStartNewGame,
  onResumeGame,
  onNavigate,
}) => {
  const { activePrimary, activeOnPrimary, isDark } = useTheme();

  const difficulties: {
    level: Difficulty;
    title: string;
    description: string;
    clues: string;
    avgTime: string;
  }[] = [
    {
      level: 'easy',
      title: 'Easy',
      description: 'Generous clues and straightforward naked singles for a relaxed session.',
      clues: '38 clues',
      avgTime: '4–7 min',
    },
    {
      level: 'medium',
      title: 'Medium',
      description: 'Balanced challenge requiring hidden singles and intersection logic.',
      clues: '32 clues',
      avgTime: '8–14 min',
    },
    {
      level: 'hard',
      title: 'Hard',
      description: 'Complex puzzle demanding naked pairs, pointing lines, and candidate tracking.',
      clues: '28 clues',
      avgTime: '15–25 min',
    },
    {
      level: 'expert',
      title: 'Expert',
      description: 'Master tier with minimal starting clues and multi-step deduction chains.',
      clues: '24 clues',
      avgTime: '25+ min',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-in fade-in duration-150">
      {/* Hero Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b"
        style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
      >
        <div className="flex items-center gap-3.5">
          <img
            src="/pwa-192x192.png"
            alt="Sudoku Studio Pro"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-md object-cover ring-2 ring-indigo-500/20"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: 'var(--md-sys-color-on-background)' }}
            >
              Sudoku Studio Pro
            </h1>
            <p
              className="text-xs sm:text-sm font-medium mt-0.5"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Pure deductive reasoning with Material 3 design and high-contrast precision.
            </p>
          </div>
        </div>
      </div>

      {/* ACTIVE GAME BANNER OR EMPTY STATE */}
      {activeGame && !activeGame.isCompleted && !activeGame.isGameOver ? (
        <div
          className="p-5 sm:p-6 rounded-2xl border-2 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-primary)',
          }}
        >
          <div className="space-y-1">
            <div
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: 'var(--md-sys-color-primary)' }}
            >
              In Progress
            </div>
            <h2
              className="text-xl font-bold capitalize"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              {activeGame.difficulty} Puzzle
            </h2>
            <div
              className="flex items-center gap-2 text-xs font-medium"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              <span>Time: {Math.floor(activeGame.elapsedSeconds / 60)}m {activeGame.elapsedSeconds % 60}s</span>
              <span>·</span>
              <span>Mistakes: {activeGame.mistakes}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onResumeGame}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition-transform active:scale-95"
            style={{
              backgroundColor: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-on-primary)',
            }}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Continue Playing</span>
          </button>
        </div>
      ) : (
        /* The Exact Empty State */
        <div
          className="p-6 sm:p-8 rounded-2xl border border-dashed text-center space-y-1.5"
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            borderColor: 'var(--md-sys-color-outline)',
          }}
        >
          <p
            className="text-base sm:text-lg font-bold"
            style={{ color: 'var(--md-sys-color-on-surface)' }}
          >
            No game in progress.
          </p>
          <p
            className="text-sm font-medium"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Start a new game to begin playing.
          </p>
        </div>
      )}

      {/* CHOOSE DIFFICULTY SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            className="text-xl font-bold"
            style={{ color: 'var(--md-sys-color-on-background)' }}
          >
            Choose difficulty
          </h2>
          <span
            className="text-xs font-medium"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Select tier to start
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {difficulties.map(diff => {
            const theme = DIFFICULTY_THEMES[diff.level];
            const cardBg = isDark ? theme.darkBg : theme.lightBg;
            const cardBorder = isDark ? theme.darkBorder : theme.lightBorder;
            const accent = isDark ? theme.darkAccentColor : theme.accentColor;
            const badgeBg = isDark ? theme.darkBadgeBg : theme.badgeBg;
            const badgeText = isDark ? theme.darkBadgeText : theme.badgeText;

            return (
              <button
                key={diff.level}
                type="button"
                onClick={() => onStartNewGame(diff.level)}
                style={{
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                }}
                className="group p-5 rounded-2xl border-2 hover:shadow-md transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
                      style={{
                        backgroundColor: badgeBg,
                        color: badgeText,
                      }}
                    >
                      {diff.title}
                    </span>
                    <div
                      className="flex items-center gap-2 text-xs font-mono font-medium"
                      style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                      <span>{diff.clues}</span>
                      <span>·</span>
                      <span>{diff.avgTime}</span>
                    </div>
                  </div>

                  <h3
                    className="text-lg font-bold mb-1 transition-colors"
                    style={{ color: accent }}
                  >
                    {diff.title} Sudoku
                  </h3>

                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                  >
                    {diff.description}
                  </p>
                </div>

                <div
                  className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold"
                  style={{
                    borderColor: cardBorder,
                    color: accent,
                  }}
                >
                  <span>Start {diff.title} Puzzle</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* PLAY MODES SECTION */}
      <section className="space-y-4">
        <h2
          className="text-xl font-bold"
          style={{ color: 'var(--md-sys-color-on-background)' }}
        >
          Play modes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Daily Sudoku */}
          <button
            type="button"
            onClick={() => onNavigate('daily')}
            style={{
              backgroundColor: 'var(--md-sys-color-surface)',
              borderColor: 'var(--md-sys-color-outline-variant)',
            }}
            className="p-5 rounded-2xl border transition-all text-left group hover:opacity-90 shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <div
              className="text-base font-bold mb-1"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              Daily Sudoku
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Curated daily puzzles with streak tracking and global parity.
            </p>
          </button>

          {/* Capture Sudoku */}
          <button
            type="button"
            onClick={() => onNavigate('capture')}
            style={{
              backgroundColor: 'var(--md-sys-color-surface)',
              borderColor: 'var(--md-sys-color-outline-variant)',
            }}
            className="p-5 rounded-2xl border transition-all text-left group hover:opacity-90 shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center mb-3">
              <Camera className="w-5 h-5" />
            </div>
            <div
              className="text-base font-bold mb-1"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              Capture Sudoku
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Import paper puzzles with photo OCR and interactive verification.
            </p>
          </button>

          {/* Saved Sudoku */}
          <button
            type="button"
            onClick={() => onNavigate('history')}
            style={{
              backgroundColor: 'var(--md-sys-color-surface)',
              borderColor: 'var(--md-sys-color-outline-variant)',
            }}
            className="p-5 rounded-2xl border transition-all text-left group hover:opacity-90 shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center mb-3">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div
              className="text-base font-bold mb-1"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              Saved Sudoku
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Review completed game archives, match statistics, and bookmarks.
            </p>
          </button>
        </div>
      </section>

      {/* INSIGHTS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            className="text-xl font-bold"
            style={{ color: 'var(--md-sys-color-on-background)' }}
          >
            Insights & Performance
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('stats')}
            style={{ color: 'var(--md-sys-color-primary)' }}
            className="text-xs font-bold hover:underline flex items-center gap-1"
          >
            <span>Full Stats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

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
              Games Played
            </div>
            <div
              className="text-2xl font-bold font-mono"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              {playerStats.gamesPlayed}
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
              {playerStats.gamesPlayed > 0
                ? `${Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100)}%`
                : '0%'}
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
              <span>Current Streak</span>
            </div>
            <div
              className="text-2xl font-bold font-mono"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              {playerStats.currentStreak}
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
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Best Streak</span>
            </div>
            <div
              className="text-2xl font-bold font-mono"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              {playerStats.bestStreak}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
