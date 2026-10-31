import React, { useState, useEffect, useMemo } from 'react';
import { Difficulty, GameSettings, SavedPuzzle, Screen } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Play,
  Trash2,
  Edit2,
  Check,
  X,
  Clock,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import {
  loadSavedPuzzles,
  removeSavedPuzzle,
  renameSavedPuzzle,
} from '../../utils/savedPuzzles';
import { DifficultyBadge, getDifficultyConfig } from '../common/DifficultyBadge';

interface SavedPuzzlesScreenProps {
  onLoadSavedPuzzle: (puzzle: SavedPuzzle) => void;
  onNavigate: (screen: Screen) => void;
  onStartNewGame: (difficulty: Difficulty) => void;
  settings: GameSettings;
}

const DIFFICULTY_STYLES: Record<
  Difficulty,
  {
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  easy: {
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.28)',
    badgeBg: 'rgba(16, 185, 129, 0.18)',
    badgeText: '#10B981',
  },
  medium: {
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.28)',
    badgeBg: 'rgba(245, 158, 11, 0.18)',
    badgeText: '#F59E0B',
  },
  hard: {
    bg: 'rgba(249, 115, 22, 0.08)',
    border: 'rgba(249, 115, 22, 0.28)',
    badgeBg: 'rgba(249, 115, 22, 0.18)',
    badgeText: '#F97316',
  },
  expert: {
    bg: 'rgba(168, 85, 247, 0.08)',
    border: 'rgba(168, 85, 247, 0.28)',
    badgeBg: 'rgba(168, 85, 247, 0.18)',
    badgeText: '#A855F7',
  },
};

export const SavedPuzzlesScreen: React.FC<SavedPuzzlesScreenProps> = ({
  onLoadSavedPuzzle,
  onNavigate,
  onStartNewGame,
}) => {
  const { isDark, activePrimary, activeOnPrimary } = useTheme();
  const [puzzles, setPuzzles] = useState<SavedPuzzle[]>(() => loadSavedPuzzles());
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Sync when storage event is fired
  useEffect(() => {
    const handleUpdate = () => {
      setPuzzles(loadSavedPuzzles());
    };
    window.addEventListener('sudoku_saved_puzzles_updated', handleUpdate);
    return () => window.removeEventListener('sudoku_saved_puzzles_updated', handleUpdate);
  }, []);

  const filteredPuzzles = useMemo(() => {
    if (selectedDifficulty === 'all') return puzzles;
    return puzzles.filter(p => p.difficulty === selectedDifficulty);
  }, [puzzles, selectedDifficulty]);

  const handleDelete = (id: string) => {
    removeSavedPuzzle(id);
    setPuzzles(loadSavedPuzzles());
    setConfirmDeleteId(null);
  };

  const handleStartRename = (puzzle: SavedPuzzle) => {
    setEditingId(puzzle.id);
    setEditingTitle(puzzle.title || `${puzzle.difficulty} Puzzle`);
  };

  const handleSaveRename = (id: string) => {
    if (editingTitle.trim()) {
      renameSavedPuzzle(id, editingTitle.trim());
      setPuzzles(loadSavedPuzzles());
    }
    setEditingId(null);
  };

  const formatSavedDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently saved';
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div
        className="flex items-center justify-between gap-4 pb-4 border-b"
        style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            aria-label="Back to Home"
            style={{ color: 'var(--md-sys-color-on-background)' }}
            className="p-2 -ml-2 rounded-xl hover:opacity-75 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1
                className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                style={{ color: 'var(--md-sys-color-on-background)' }}
              >
                Saved Puzzles
              </h1>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: 'var(--md-sys-color-surface-container-high)',
                  color: 'var(--md-sys-color-on-surface)',
                }}
              >
                {puzzles.length}
              </span>
            </div>
            <p
              className="text-xs sm:text-sm font-medium mt-0.5"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Bookmarked game boards to replay, analyze, or conquer later.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['all', 'easy', 'medium', 'hard', 'expert'].map(tab => {
          const isSelected = selectedDifficulty === tab;
          const count =
            tab === 'all' ? puzzles.length : puzzles.filter(p => p.difficulty === tab).length;
          const diffConfig = tab !== 'all' ? getDifficultyConfig(tab) : null;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedDifficulty(tab)}
              style={{
                backgroundColor: isSelected
                  ? activePrimary
                  : 'var(--md-sys-color-surface-container)',
                color: isSelected
                  ? activeOnPrimary
                  : 'var(--md-sys-color-on-surface-variant)',
              }}
              className="px-3.5 py-1.5 rounded-full font-bold capitalize transition-all shrink-0 hover:opacity-90 flex items-center gap-1.5"
            >
              {diffConfig && (
                <span
                  className="w-2 h-2 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: diffConfig.dotColor }}
                />
              )}
              <span>{tab}</span>
              <span
                className="text-[10px] px-1.5 py-0.2 rounded-full font-mono"
                style={{
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {filteredPuzzles.length === 0 ? (
        <div
          className="p-8 sm:p-12 rounded-3xl border border-dashed text-center flex flex-col items-center justify-center space-y-4 shadow-xs"
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner"
            style={{
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              color: activePrimary,
            }}
          >
            <Bookmark className="w-8 h-8" />
          </div>

          <div className="max-w-md space-y-1.5">
            <h2
              className="text-lg sm:text-xl font-bold"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              {puzzles.length === 0 ? 'No Saved Puzzles Yet' : `No ${selectedDifficulty} Puzzles Found`}
            </h2>
            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              {puzzles.length === 0
                ? 'Whenever you face an interesting or difficult puzzle, tap the Bookmark icon in the top header during gameplay to save your board state here.'
                : 'Try selecting "All" or bookmark a puzzle in this difficulty tier.'}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => onStartNewGame('easy')}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-2"
              style={{
                backgroundColor: activePrimary,
                color: activeOnPrimary,
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Start an Easy Game</span>
            </button>
            <button
              type="button"
              onClick={() => onStartNewGame('hard')}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all hover:opacity-85"
              style={{
                backgroundColor: 'var(--md-sys-color-surface-container-high)',
                color: 'var(--md-sys-color-on-surface)',
                borderColor: 'var(--md-sys-color-outline-variant)',
              }}
            >
              <span>Start Hard Game</span>
            </button>
          </div>
        </div>
      ) : (
        /* SAVED PUZZLE CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPuzzles.map(puzzle => {
            const diffConfig = getDifficultyConfig(puzzle.difficulty);
            const isEditing = editingId === puzzle.id;
            const isConfirmingDelete = confirmDeleteId === puzzle.id;

            return (
              <div
                key={puzzle.id}
                className="p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-4 shadow-xs hover:shadow-md"
                style={{
                  backgroundColor: 'var(--md-sys-color-surface)',
                  borderColor: isDark ? diffConfig.darkBorder : 'var(--md-sys-color-outline-variant)',
                  borderLeftColor: diffConfig.accentBorder,
                  borderLeftWidth: '4px',
                }}
              >
                {/* Top card row: Title, Difficulty Badge, & Options */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Visual Indicator: Color-coded Difficulty Badge */}
                      <DifficultyBadge
                        difficulty={puzzle.difficulty}
                        size="sm"
                        showIndicatorDot
                        showLevelBars
                      />
                      {puzzle.isDaily && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border border-amber-500/30"
                          style={{
                            backgroundColor: 'rgba(234, 179, 8, 0.15)',
                            color: '#EAB308',
                          }}
                        >
                          Daily
                        </span>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={e => setEditingTitle(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveRename(puzzle.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="px-2 py-1 rounded-lg text-sm font-bold border w-full max-w-xs focus:outline-none"
                          style={{
                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                            color: 'var(--md-sys-color-on-surface)',
                            borderColor: activePrimary,
                          }}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRename(puzzle.id)}
                          aria-label="Save Title"
                          className="p-1 rounded-lg hover:opacity-75"
                          style={{ color: activePrimary }}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          aria-label="Cancel Rename"
                          className="p-1 rounded-lg hover:opacity-75"
                          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group">
                        <h2
                          className="text-base sm:text-lg font-bold truncate cursor-pointer hover:underline"
                          style={{ color: 'var(--md-sys-color-on-surface)' }}
                          onClick={() => handleStartRename(puzzle)}
                          title="Click to rename puzzle"
                        >
                          {puzzle.title || `${puzzle.difficulty} Puzzle`}
                        </h2>
                        <button
                          type="button"
                          onClick={() => handleStartRename(puzzle)}
                          aria-label="Rename"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
                          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div
                      className="text-[11px] font-medium"
                      style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                      {formatSavedDate(puzzle.savedAt)}
                    </div>
                  </div>

                  {/* Bookmark tag visual */}
                  <div
                    className="p-2 rounded-xl"
                    style={{
                      backgroundColor: 'rgba(234, 179, 8, 0.12)',
                      color: '#EAB308',
                    }}
                    title="Bookmarked"
                  >
                    <BookmarkCheck className="w-5 h-5 fill-current" />
                  </div>
                </div>

                {/* Middle row: Mini 9x9 preview and Stats */}
                <div className="flex items-center gap-4 py-1">
                  {/* Mini Sudoku Grid Preview */}
                  <div
                    className="w-20 h-20 shrink-0 grid grid-cols-9 grid-rows-9 p-0.5 rounded-lg border shadow-xs"
                    style={{
                      backgroundColor: isDark ? '#1E232A' : '#F8FAFC',
                      borderColor: 'var(--md-sys-color-outline-variant)',
                    }}
                    title="Mini Board Preview"
                  >
                    {puzzle.board.map((row, r) =>
                      row.map((cell, c) => {
                        const isGiven = cell.given;
                        const isFilled = cell.value !== 0;
                        const isBoxBorderRight = (c + 1) % 3 === 0 && c !== 8;
                        const isBoxBorderBottom = (r + 1) % 3 === 0 && r !== 8;

                        let cellBg = 'transparent';
                        if (isGiven) {
                          cellBg = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.6)';
                        } else if (isFilled) {
                          cellBg = activePrimary;
                        }

                        return (
                          <div
                            key={`${r}-${c}`}
                            className="flex items-center justify-center relative"
                            style={{
                              borderRight: isBoxBorderRight ? '1px solid rgba(148, 163, 184, 0.4)' : undefined,
                              borderBottom: isBoxBorderBottom ? '1px solid rgba(148, 163, 184, 0.4)' : undefined,
                            }}
                          >
                            {isFilled && (
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: cellBg }}
                              />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Metrics & Progress Details */}
                  <div className="flex-1 space-y-2.5 min-w-0">
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                          Solved
                        </span>
                        <span
                          className="font-mono font-bold"
                          style={{ color: 'var(--md-sys-color-on-surface)' }}
                        >
                          {puzzle.progressPercent}% ({puzzle.solvedCells}/81)
                        </span>
                      </div>
                      <div
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${puzzle.progressPercent}%`,
                            backgroundColor: puzzle.progressPercent === 100 ? '#22C55E' : activePrimary,
                          }}
                        />
                      </div>
                    </div>

                    {/* Stats Pill Badges */}
                    <div
                      className="flex flex-wrap items-center gap-2 text-xs font-medium"
                      style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDuration(puzzle.elapsedSeconds)}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>{puzzle.mistakes} mistakes</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span>{puzzle.hintsUsed} hints</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div
                  className="pt-3 border-t flex items-center justify-between gap-2"
                  style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
                >
                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-2 w-full justify-between animate-in fade-in">
                      <span className="text-xs font-bold text-rose-500">
                        Confirm delete?
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDelete(puzzle.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold border"
                          style={{
                            backgroundColor: 'var(--md-sys-color-surface-container)',
                            color: 'var(--md-sys-color-on-surface)',
                            borderColor: 'var(--md-sys-color-outline-variant)',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(puzzle.id)}
                        className="p-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-1.5"
                        title="Remove from saved puzzles"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onLoadSavedPuzzle(puzzle)}
                        className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-2"
                        style={{
                          backgroundColor: activePrimary,
                          color: activeOnPrimary,
                        }}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Resume Game</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
