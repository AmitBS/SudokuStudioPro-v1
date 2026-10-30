import React from 'react';
import { Difficulty } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { Play, RotateCcw, Home, Bookmark, BookmarkCheck, HelpCircle } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuitToHome: () => void;
  elapsedSeconds: number;
  difficulty: Difficulty;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onOpenHowToGuide?: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onQuitToHome,
  elapsedSeconds,
  difficulty,
  isBookmarked,
  onToggleBookmark,
  onOpenHowToGuide,
}) => {
  const { activePrimary, activeOnPrimary } = useTheme();

  if (!isOpen) return null;

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
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
        className="w-full max-w-sm rounded-2xl border shadow-2xl p-6 text-center space-y-6"
      >
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: 'var(--md-sys-color-on-surface)' }}
          >
            Game Paused
          </h2>
          <div
            className="flex items-center justify-center gap-3 mt-2 text-sm font-medium"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            <span className="capitalize font-semibold">{difficulty}</span>
            <span>·</span>
            <span className="font-mono tabular-nums">{timeFormatted}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
            style={{
              backgroundColor: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-on-primary)',
            }}
          >
            <Play className="w-4 h-4 fill-current" />
            Resume Game
          </button>

          {onToggleBookmark && (
            <button
              type="button"
              onClick={onToggleBookmark}
              style={{
                backgroundColor: isBookmarked ? 'rgba(245, 158, 11, 0.15)' : 'var(--md-sys-color-surface-container-high)',
                borderColor: isBookmarked ? '#F59E0B' : 'var(--md-sys-color-outline-variant)',
                color: isBookmarked ? '#F59E0B' : 'var(--md-sys-color-on-surface)',
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 hover:opacity-85 transition-all"
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 fill-current" />
                  <span>Bookmarked in Saved Puzzles</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Bookmark Puzzle for Later</span>
                </>
              )}
            </button>
          )}

          {onOpenHowToGuide && (
            <button
              type="button"
              onClick={onOpenHowToGuide}
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                borderColor: 'rgba(245, 158, 11, 0.35)',
                color: '#F59E0B',
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 hover:opacity-85 transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Notes & Candidate Guide</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRestart}
            style={{
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              borderColor: 'var(--md-sys-color-outline-variant)',
              color: 'var(--md-sys-color-on-surface)',
            }}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 hover:opacity-85 transition-opacity"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Puzzle
          </button>

          <button
            type="button"
            onClick={onQuitToHome}
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold hover:opacity-85 flex items-center justify-center gap-2 transition-opacity"
          >
            <Home className="w-4 h-4" />
            Exit to Home
          </button>
        </div>
      </div>
    </div>
  );
};
