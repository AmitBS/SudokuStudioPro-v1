import React, { useEffect, useRef, useState } from 'react';
import { Difficulty } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { Trophy, Sparkles, Home, ArrowRight, RotateCcw, Share2, Check } from 'lucide-react';

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Confetti Animation Effect
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#f43f5e', '#06b6d4'];
    const particleCount = 120;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.45 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.8) * 18 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      gravity: 0.35,
      drag: 0.98,
    }));

    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      let hasActiveParticles = false;
      particles.forEach(p => {
        if (p.opacity <= 0) return;
        hasActiveParticles = true;

        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (frame > 60) {
          p.opacity -= 0.012;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        // Draw rectangle confetti
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });

      if (hasActiveParticles || frame < 180) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
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
      {/* Background Celebration Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
        aria-hidden="true"
      />

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
