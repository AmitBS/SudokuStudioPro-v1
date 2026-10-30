import React, { useEffect, useState } from 'react';
import { Difficulty } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { Trophy, Sparkles, Home, ArrowRight, RotateCcw, Share2, Check } from 'lucide-react';
import { launchVictoryConfetti, stopVictoryConfetti } from '../../utils/confettiVictory';

interface VictoryModalProps {
  isOpen: boolean;
  onPlayNext: () => void;
  onPlayAgain: () => void;
  onHome: () => void;
  elapsedSeconds: number;
  difficulty: Difficulty;
  mistakes: number;
  score: number;
  isNewBest?: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onPlayNext,
  onPlayAgain,
  onHome,
  elapsedSeconds,
  difficulty,
  mistakes,
  score,
  isNewBest = false,
}) => {
  const { tokens } = useTheme();
  const [copied, setCopied] = useState<boolean>(false);

  // Trigger high-polish particle victory confetti
  useEffect(() => {
    if (isOpen) {
      launchVictoryConfetti();
    }
    return () => {
      stopVictoryConfetti();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const accuracy = Math.max(0, Math.round((81 / (81 + mistakes)) * 100));

  const handleShare = async () => {
    const summary = `🧩 Sudoku Studio Pro\nDifficulty: ${difficulty.toUpperCase()}\n⏱️ Time: ${timeFormatted}\n❌ Mistakes: ${mistakes}\n🎯 Accuracy: ${accuracy}%\n🏆 Score: ${score}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs select-none"
      style={{ backgroundColor: 'rgba(9, 13, 22, 0.8)' }}
    >
      <div
        style={{
          backgroundColor: 'var(--md-sys-color-surface)',
          borderColor: 'var(--md-sys-color-outline-variant)',
        }}
        className="relative z-20 w-full max-w-sm sm:max-w-md rounded-2xl border shadow-2xl p-6 text-center space-y-6 animate-in zoom-in-95 duration-200"
      >
        <div>
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shadow-inner">
            <Trophy className="w-9 h-9" />
          </div>
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: 'var(--md-sys-color-on-surface)' }}
          >
            Puzzle Solved!
          </h2>
          <div
            className="text-xs sm:text-sm font-semibold uppercase tracking-wider mt-1 capitalize"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            {difficulty} Level
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
          className="grid grid-cols-4 gap-2 p-3.5 rounded-xl border text-center"
        >
          <div>
            <div
              className="text-[11px] font-medium"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Time
            </div>
            <div
              className="text-base font-bold font-mono mt-0.5"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              {timeFormatted}
            </div>
          </div>
          <div>
            <div
              className="text-[11px] font-medium"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Mistakes
            </div>
            <div
              className="text-base font-bold font-mono mt-0.5"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              {mistakes}
            </div>
          </div>
          <div>
            <div
              className="text-[11px] font-medium"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Accuracy
            </div>
            <div
              className="text-base font-bold font-mono mt-0.5"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              {accuracy}%
            </div>
          </div>
          <div>
            <div
              className="text-[11px] font-medium"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Score
            </div>
            <div
              className="text-base font-bold font-mono mt-0.5"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              {score}
            </div>
          </div>
        </div>

        {isNewBest && (
          <div className="py-2 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            New Personal Best Record!
          </div>
        )}

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onPlayNext}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 cursor-pointer"
            style={{
              backgroundColor: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-on-primary)',
            }}
          >
            <span>Play Next Puzzle</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onPlayAgain}
              style={{
                backgroundColor: 'var(--md-sys-color-surface-container)',
                borderColor: 'var(--md-sys-color-outline-variant)',
                color: 'var(--md-sys-color-on-surface)',
              }}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 hover:opacity-85 transition-opacity cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Play Again
            </button>

            <button
              type="button"
              onClick={handleShare}
              style={{
                backgroundColor: 'var(--md-sys-color-surface-container)',
                borderColor: 'var(--md-sys-color-outline-variant)',
                color: 'var(--md-sys-color-on-surface)',
              }}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 hover:opacity-85 transition-opacity cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  Share Result
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={onHome}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--md-sys-color-on-surface-variant)',
            }}
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:opacity-85 transition-opacity cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            Return to Home Screen
          </button>
        </div>
      </div>
    </div>
  );
};
