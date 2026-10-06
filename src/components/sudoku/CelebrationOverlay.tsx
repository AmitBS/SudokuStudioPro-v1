import React, { useEffect, useRef } from 'react';
import { Sparkles, Trophy, Star } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  isSparkle?: boolean;
}

interface CelebrationOverlayProps {
  onDismiss: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ onDismiss }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      '#f59e0b', // Gold / Amber
      '#10b981', // Emerald
      '#3b82f6', // Indigo
      '#f43f5e', // Rose
      '#8b5cf6', // Violet
      '#06b6d4', // Cyan
      '#fcd34d', // Warm Yellow
      '#ffffff', // Crisp White
    ];

    const particles: Particle[] = [];

    // Helper to spawn a firework explosion
    const spawnFirework = (centerX: number, centerY: number, count = 45) => {
      const baseColor = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 2;
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color: Math.random() > 0.4 ? baseColor : colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.015 + 0.012,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.2,
          isSparkle: Math.random() > 0.6,
        });
      }
    };

    // Helper to spawn falling celebratory confetti ribbons
    const spawnConfetti = (count = 60) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: -20 - Math.random() * 50,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 3 + 2.5,
          size: Math.random() * 7 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.006 + 0.004,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.1,
          isSparkle: false,
        });
      }
    };

    // Initial bursts
    spawnFirework(width * 0.25, height * 0.35, 55);
    spawnFirework(width * 0.75, height * 0.35, 55);
    spawnFirework(width * 0.5, height * 0.25, 70);
    spawnConfetti(70);

    // Follow-up firework bursts
    const timer1 = setTimeout(() => spawnFirework(width * 0.35, height * 0.2, 50), 350);
    const timer2 = setTimeout(() => spawnFirework(width * 0.65, height * 0.22, 50), 700);
    const timer3 = setTimeout(() => spawnConfetti(40), 900);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.09; // Gravity
        p.vx *= 0.98; // Friction
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > height + 20) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.isSparkle) {
          // Sparkle 4-point star
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.3, -s * 0.3);
          ctx.lineTo(s, 0);
          ctx.lineTo(s * 0.3, s * 0.3);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.3, s * 0.3);
          ctx.lineTo(-s, 0);
          ctx.lineTo(-s * 0.3, -s * 0.3);
          ctx.closePath();
          ctx.fill();
        } else {
          // Fluttering rectangular confetti ribbon
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    // Auto dismiss after 2.4s to show victory dialog
    const autoDismiss = setTimeout(() => {
      onDismiss();
    }, 2400);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(autoDismiss);
    };
  }, [onDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      onClick={onDismiss}
      className="fixed inset-0 z-50 pointer-events-auto cursor-pointer flex flex-col items-center justify-center select-none animate-in fade-in duration-200"
      style={{
        backgroundColor: 'rgba(9, 13, 22, 0.45)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Floating Center Celebration Card */}
      <div
        className="relative z-10 p-6 sm:p-8 rounded-3xl border text-center shadow-2xl space-y-3 max-w-sm mx-4 transform animate-in zoom-in-90 duration-300"
        style={{
          backgroundColor: 'var(--md-sys-color-surface)',
          borderColor: 'var(--md-sys-color-primary)',
          boxShadow: '0 25px 50px -12px rgba(245, 158, 11, 0.35)',
        }}
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center animate-bounce">
          <Trophy className="w-9 h-9" />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-amber-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Flawless Deduction
          </span>
          <Star className="w-4 h-4 fill-current" />
        </div>

        <h2
          className="text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: 'var(--md-sys-color-on-surface)' }}
        >
          Spectacular!
        </h2>

        <p
          className="text-sm font-medium"
          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
        >
          Entire puzzle solved successfully.
        </p>

        <div className="pt-2 text-xs font-semibold opacity-60">
          Tap anywhere to view summary
        </div>
      </div>
    </div>
  );
};
