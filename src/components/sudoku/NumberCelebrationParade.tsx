import React, { useEffect, useRef, useState } from 'react';
import { BoardMatrix } from '../../types/sudoku';
import { playParadeChime, triggerHaptic } from '../../utils/audio';
import { Sparkles, ArrowRight } from 'lucide-react';

interface NumberCelebrationParadeProps {
  board: BoardMatrix;
  isActive: boolean;
  onNumberStep: (num: number | null) => void;
  onComplete: () => void;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

interface ActiveDigit {
  id: string;
  num: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  color: string;
  history: TrailPoint[];
}

interface StardustSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface FireworkRocket {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
}

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  gravity: number;
  decay: number;
}

// Vibrant theme colors for each number 1 to 9
const DIGIT_COLORS: Record<number, string> = {
  1: '#f59e0b', // Amber Gold
  2: '#0284c7', // Sky Azure
  3: '#10b981', // Emerald Jade
  4: '#f43f5e', // Rose Coral
  5: '#8b5cf6', // Royal Violet
  6: '#06b6d4', // Cyan Electric
  7: '#d946ef', // Fuchsia Neon
  8: '#14b8a6', // Teal Mint
  9: '#eab308', // Brilliant Sunlight Gold
};

function easeOutQuad(t: number): number {
  return t * (2 - t);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export const NumberCelebrationParade: React.FC<NumberCelebrationParadeProps> = ({
  board,
  isActive,
  onNumberStep,
  onComplete,
  soundEnabled,
  hapticsEnabled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentNum, setCurrentNum] = useState<number>(1);
  const isFinishedRef = useRef(false);

  // References for active animation loop
  const activeDigitsRef = useRef<ActiveDigit[]>([]);
  const stardustRef = useRef<StardustSpark[]>([]);
  const rocketsRef = useRef<FireworkRocket[]>([]);
  const fireworksRef = useRef<FireworkParticle[]>([]);
  const currentStepNumRef = useRef<number>(1);

  // 1. Master Canvas Loop for Motion Trails, Floating Numbers & Firecrackers
  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId: number;
    let tick = 0;

    const firecrackerColors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#f43f5e', '#06b6d4', '#eab308'];

    const spawnFirecracker = () => {
      const x = Math.random() * (canvas.width - 200) + 100;
      rocketsRef.current.push({
        x,
        y: canvas.height,
        vy: -(Math.random() * 7 + 13),
        targetY: Math.random() * (canvas.height * 0.4) + 60,
        color: firecrackerColors[Math.floor(Math.random() * firecrackerColors.length)],
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;
      const now = performance.now();

      // Spawn ambient firecracker rockets periodically
      if (tick % 28 === 0) {
        spawnFirecracker();
      }

      // --- A. Render Firecracker Rockets ---
      rocketsRef.current = rocketsRef.current.filter(r => {
        r.y += r.vy;
        r.vy *= 0.98;

        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (r.y <= r.targetY || r.vy >= -1) {
          // Burst firecracker
          for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5.5 + 1.5;
            fireworksRef.current.push({
              x: r.x,
              y: r.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: Math.random() * 3.5 + 1.8,
              color: firecrackerColors[Math.floor(Math.random() * firecrackerColors.length)],
              alpha: 1,
              gravity: 0.12,
              decay: Math.random() * 0.015 + 0.012,
            });
          }
          return false;
        }
        return true;
      });

      // --- B. Render Firecracker Explosion Particles ---
      fireworksRef.current = fireworksRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();

        return true;
      });

      // --- C. Render Stardust Trail Sparks ---
      stardustRef.current = stardustRef.current.filter(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy *= 0.96;
        s.alpha -= s.decay;

        if (s.alpha <= 0) return false;

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        return true;
      });

      // --- D. Render Traveling Numbers with Visible Motion Trails ---
      activeDigitsRef.current.forEach(digit => {
        const history = digit.history;
        if (history.length === 0) return;

        const head = history[0];
        const numColor = digit.color;

        // 1. Draw Continuous Luminous Motion Trail Ribbon
        if (history.length > 2) {
          ctx.save();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          for (let i = 0; i < history.length - 1; i++) {
            const p1 = history[i];
            const p2 = history[i + 1];
            const ratio = 1 - i / history.length;
            const alpha = Math.max(0, Math.min(0.85, ratio * 0.85));
            const lineWidth = Math.max(2, ratio * 20);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = numColor;
            ctx.globalAlpha = alpha;
            ctx.shadowColor = numColor;
            ctx.shadowBlur = 14;
            ctx.stroke();
          }
          ctx.restore();
        }

        // 2. Draw Multiple Visible Ghost Echo Afterimages Behind the Number
        // Echo points at index 4, 8, 12, 16 for unmistakable motion trail visibility
        const echoIndices = [4, 8, 12, 16];
        echoIndices.forEach((idx, step) => {
          if (idx < history.length) {
            const echoPt = history[idx];
            const echoAlpha = (1 - (step + 1) * 0.22) * 0.55;
            const echoScale = 1 - (step + 1) * 0.12;

            if (echoAlpha > 0.05) {
              ctx.save();
              ctx.globalAlpha = echoAlpha;
              ctx.translate(echoPt.x, echoPt.y);
              ctx.scale(echoScale, echoScale);

              const badgeSize = 34;
              const radius = 9;

              // Ghost badge backdrop
              ctx.beginPath();
              ctx.roundRect(-badgeSize / 2, -badgeSize / 2, badgeSize, badgeSize, radius);
              ctx.fillStyle = numColor;
              ctx.shadowColor = numColor;
              ctx.shadowBlur = 10;
              ctx.fill();

              // Ghost numeral text
              ctx.font = 'bold 20px monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#ffffff';
              ctx.fillText(String(digit.num), 0, 1);

              ctx.restore();
            }
          }
        });

        // 3. Draw the Lead Number Tile at Head
        ctx.save();
        ctx.translate(head.x, head.y);
        ctx.globalAlpha = 1;

        const mainBadgeSize = 38;
        const mainRadius = 10;

        // Outer neon glow
        ctx.shadowColor = numColor;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.roundRect(-mainBadgeSize / 2, -mainBadgeSize / 2, mainBadgeSize, mainBadgeSize, mainRadius);
        ctx.fillStyle = numColor;
        ctx.fill();

        // Inner crisp white border for pop
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = 0;
        ctx.stroke();

        // Bold white numeral
        ctx.font = '900 22px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(String(digit.num), 0, 1);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
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
  }, [isActive]);

  // 2. Sequential Ascending 1 through 9 Flight Controller with Visible Motion Trails
  useEffect(() => {
    if (!isActive) return;
    isFinishedRef.current = false;

    let isCancelled = false;
    let animFrameLoop: number;

    const runNumberSequence = (num: number) => {
      if (isCancelled) return;

      if (num > 9) {
        if (!isFinishedRef.current) {
          isFinishedRef.current = true;
          activeDigitsRef.current = [];
          onNumberStep(null);
          onComplete();
        }
        return;
      }

      setCurrentNum(num);
      currentStepNumRef.current = num;
      onNumberStep(num);

      // 1. Locate destination numpad button for this number
      const targetBtn = document.getElementById(`numpad-btn-${num}`);
      const targetRect = targetBtn?.getBoundingClientRect();

      // 2. Find all 9 occurrences of this number on the board
      const matchingCells: { r: number; c: number; rect: DOMRect }[] = [];
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c].value === num) {
            const cellEl = document.getElementById(`sudoku-cell-${r}-${c}`);
            if (cellEl) {
              matchingCells.push({ r, c, rect: cellEl.getBoundingClientRect() });
            }
          }
        }
      }

      const destX = targetRect ? targetRect.left + targetRect.width / 2 : window.innerWidth / 2;
      const destY = targetRect ? targetRect.top + targetRect.height / 2 : window.innerHeight - 80;
      const color = DIGIT_COLORS[num] || '#3b82f6';

      // 3. Initialize digits starting at their exact board positions
      const digits: ActiveDigit[] = matchingCells.map(({ r, c, rect }) => {
        const sx = rect.left + rect.width / 2;
        const sy = rect.top + rect.height / 2;
        return {
          id: `${num}-${r}-${c}`,
          num,
          startX: sx,
          startY: sy,
          targetX: destX,
          targetY: destY,
          color,
          history: [{ x: sx, y: sy, time: performance.now() }],
        };
      });

      activeDigitsRef.current = digits;

      // Animation Timing:
      // - 0ms to 320ms: Moves slightly upward from current cell position
      // - 320ms to 1250ms: Slowly travels downward along curved arc into the numpad button below
      // - 1250ms: Lands into button, plays chime, pulses numpad button
      const startTime = performance.now();
      const LIFT_DURATION = 320;
      const TRAVEL_DURATION = 930;
      const TOTAL_DURATION = LIFT_DURATION + TRAVEL_DURATION; // 1250ms total flight

      const updateFrame = () => {
        if (isCancelled) return;
        const elapsed = performance.now() - startTime;

        if (elapsed < TOTAL_DURATION) {
          activeDigitsRef.current.forEach(digit => {
            let cx = digit.startX;
            let cy = digit.startY;

            if (elapsed < LIFT_DURATION) {
              // Phase 1: Slowly move slightly upward (-30px)
              const u = easeOutQuad(elapsed / LIFT_DURATION);
              cx = digit.startX;
              cy = digit.startY - 30 * u;
            } else {
              // Phase 2: Slowly travel along smooth Bézier curve down to numpad button
              const progress = (elapsed - LIFT_DURATION) / TRAVEL_DURATION;
              const s = easeInOutCubic(progress);

              // Lofted control point for natural graceful arc
              const p0x = digit.startX;
              const p0y = digit.startY - 30;
              const p1x = digit.startX + (digit.targetX - digit.startX) * 0.28;
              const p1y = Math.min(p0y, digit.targetY) - 36;
              const p2x = digit.targetX;
              const p2y = digit.targetY;

              cx = Math.pow(1 - s, 2) * p0x + 2 * (1 - s) * s * p1x + Math.pow(s, 2) * p2x;
              cy = Math.pow(1 - s, 2) * p0y + 2 * (1 - s) * s * p1y + Math.pow(s, 2) * p2y;

              // Emit stardust sparkles along the trail for visual richness
              if (Math.random() < 0.45) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2 + 0.5;
                stardustRef.current.push({
                  x: cx + (Math.random() - 0.5) * 8,
                  y: cy + (Math.random() - 0.5) * 8,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  size: Math.random() * 2.8 + 1.2,
                  color: digit.color,
                  alpha: 0.9,
                  decay: Math.random() * 0.03 + 0.02,
                });
              }
            }

            // Append current point to history and prune points older than 22 frames
            digit.history.unshift({ x: cx, y: cy, time: performance.now() });
            if (digit.history.length > 22) {
              digit.history.pop();
            }
          });

          animFrameLoop = requestAnimationFrame(updateFrame);
        } else {
          // Landing moment: numbers have fully returned to the numpad button below!
          playParadeChime(num, soundEnabled);
          triggerHaptic('cell', hapticsEnabled);

          // Clear flying digits for this number
          activeDigitsRef.current = [];

          // Pause 120ms then proceed to next number in ascending order
          setTimeout(() => {
            if (!isCancelled) {
              runNumberSequence(num + 1);
            }
          }, 120);
        }
      };

      animFrameLoop = requestAnimationFrame(updateFrame);
    };

    // Kick off starting with number 1
    const timer = setTimeout(() => {
      runNumberSequence(1);
    }, 120);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      cancelAnimationFrame(animFrameLoop);
    };
  }, [isActive, board, soundEnabled, hapticsEnabled, onNumberStep, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden select-none">
      {/* Full-Screen Hardware-Accelerated Canvas for Motion Trails & Firecrackers */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Top Floating Celebration Status Banner with Skip Option */}
      <div className="absolute top-4 inset-x-0 flex items-center justify-between px-4 sm:px-6 pointer-events-auto">
        <div
          className="flex items-center gap-2.5 px-4 py-2 rounded-2xl shadow-xl border backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300"
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
            color: 'var(--md-sys-color-on-surface)',
          }}
        >
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <span className="text-xs sm:text-sm font-extrabold tracking-tight">
            Gathering Number{' '}
            <span
              className="text-base font-mono font-black px-1.5 py-0.5 rounded-lg text-white shadow-sm"
              style={{ backgroundColor: DIGIT_COLORS[currentNum] || 'var(--md-sys-color-primary)' }}
            >
              {currentNum}
            </span>{' '}
            of 9
          </span>
        </div>

        {/* Skip Button */}
        <button
          type="button"
          onClick={() => {
            isFinishedRef.current = true;
            activeDigitsRef.current = [];
            onNumberStep(null);
            onComplete();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border shadow-md hover:opacity-90 active:scale-95 transition-all"
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
            color: 'var(--md-sys-color-on-surface)',
          }}
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
