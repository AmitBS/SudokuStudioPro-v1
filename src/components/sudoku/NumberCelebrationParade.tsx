import React, { useEffect, useRef, useState } from 'react';
import { BoardMatrix } from '../../types/sudoku';
import { playParadeChime, playVictoryFanfare, triggerHaptic } from '../../utils/audio';
import { Sparkles, ArrowRight } from 'lucide-react';

interface NumberCelebrationParadeProps {
  board: BoardMatrix;
  isActive: boolean;
  onNumberStep: (currentAnimatingNum: number | null, completedNumbers: number[]) => void;
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

// Distinct, vibrant colors for each number 1 through 9
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

  // Synchronize mutable refs to make the sequential animation immune to React re-renders
  const boardRef = useRef<BoardMatrix>(board);
  boardRef.current = board;

  const onNumberStepRef = useRef(onNumberStep);
  onNumberStepRef.current = onNumberStep;

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const hapticsEnabledRef = useRef(hapticsEnabled);
  hapticsEnabledRef.current = hapticsEnabled;

  const isCancelledRef = useRef<boolean>(false);
  const isRunningRef = useRef<boolean>(false);

  // Active rendering collections
  const activeDigitsRef = useRef<ActiveDigit[]>([]);
  const stardustRef = useRef<StardustSpark[]>([]);
  const rocketsRef = useRef<FireworkRocket[]>([]);
  const fireworksRef = useRef<FireworkParticle[]>([]);

  // 1. Hardware-Accelerated Canvas Rendering Loop (Motion Trails, Echoes, Firecrackers)
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
      const x = Math.random() * (canvas.width - 160) + 80;
      rocketsRef.current.push({
        x,
        y: canvas.height,
        vy: -(Math.random() * 7 + 13),
        targetY: Math.random() * (canvas.height * 0.45) + 60,
        color: firecrackerColors[Math.floor(Math.random() * firecrackerColors.length)],
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;

      // Launch ambient celebration firecrackers
      if (tick % 24 === 0) {
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
          // Burst firecracker bouquet
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

        // 1. Continuous Luminous Motion Trail Ribbon
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

        // 2. Visible Ghost Echo Afterimages Behind the Traveling Number
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

              ctx.beginPath();
              ctx.roundRect(-badgeSize / 2, -badgeSize / 2, badgeSize, badgeSize, radius);
              ctx.fillStyle = numColor;
              ctx.shadowColor = numColor;
              ctx.shadowBlur = 10;
              ctx.fill();

              ctx.font = 'bold 20px monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#ffffff';
              ctx.fillText(String(digit.num), 0, 1);

              ctx.restore();
            }
          }
        });

        // 3. Lead Number Tile at Head
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

        // Inner crisp white border for high definition
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

  // 2. Strict Sequential Animation Controller (Number 1 -> 2 -> ... -> 9)
  useEffect(() => {
    if (!isActive) return;
    if (isRunningRef.current) return;

    isRunningRef.current = true;
    isCancelledRef.current = false;

    const completedNumbers: number[] = [];

    // Helper to animate one specific number from board into its numpad button
    const animateSingleNumber = (num: number): Promise<void> => {
      return new Promise<void>(resolve => {
        if (isCancelledRef.current) {
          resolve();
          return;
        }

        setCurrentNum(num);
        onNumberStepRef.current(num, completedNumbers);

        // 1. Locate destination number box below the board
        const targetBtn = document.getElementById(`numpad-btn-${num}`);
        const targetRect = targetBtn?.getBoundingClientRect();
        const boardEl = document.querySelector('[role="grid"][aria-label="Sudoku Board"]');
        const boardRect = boardEl?.getBoundingClientRect();

        // 2. Find all 9 occurrences of this number on the board
        const matchingCells: { r: number; c: number; rect: DOMRect }[] = [];
        const currentBoard = boardRef.current;

        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (currentBoard[r][c].value === num) {
              const cellEl = document.getElementById(`sudoku-cell-${r}-${c}`);
              const rect = cellEl?.getBoundingClientRect();
              if (rect && rect.width > 0) {
                matchingCells.push({ r, c, rect });
              } else if (boardRect && boardRect.width > 0) {
                const cellW = boardRect.width / 9;
                const cellH = boardRect.height / 9;
                matchingCells.push({
                  r,
                  c,
                  rect: new DOMRect(
                    boardRect.left + c * cellW,
                    boardRect.top + r * cellH,
                    cellW,
                    cellH
                  ),
                });
              }
            }
          }
        }

        const destX = targetRect && targetRect.width > 0
          ? targetRect.left + targetRect.width / 2
          : window.innerWidth / 2 + (num - 5) * 36;
        const destY = targetRect && targetRect.height > 0
          ? targetRect.top + targetRect.height / 2
          : window.innerHeight - 80;
        const color = DIGIT_COLORS[num] || '#3b82f6';

        // 3. Initialize 9 flying digits at their exact board cell coordinates
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

        // Flight Timings:
        // - 0ms to 280ms: All 9 occurrences move slightly upward from current position (-28px)
        // - 280ms to 1140ms: Slowly travel down into number box below along curved Bézier arc with visible trails
        // - 1140ms: Land in box, pulse box, play harmonic chime
        const startTime = performance.now();
        const LIFT_DURATION = 280;
        const TRAVEL_DURATION = 860;
        const TOTAL_DURATION = LIFT_DURATION + TRAVEL_DURATION; // 1140ms total flight

        let frameId: number;

        const updateFrame = () => {
          if (isCancelledRef.current) {
            activeDigitsRef.current = [];
            resolve();
            return;
          }

          const elapsed = performance.now() - startTime;

          if (elapsed < TOTAL_DURATION) {
            activeDigitsRef.current.forEach(digit => {
              let cx = digit.startX;
              let cy = digit.startY;

              if (elapsed < LIFT_DURATION) {
                // Phase 1: Move slightly upward (-28px)
                const u = easeOutQuad(elapsed / LIFT_DURATION);
                cx = digit.startX;
                cy = digit.startY - 28 * u;
              } else {
                // Phase 2: Slowly travel down into number box with visible motion trails
                const progress = (elapsed - LIFT_DURATION) / TRAVEL_DURATION;
                const s = easeInOutCubic(progress);

                const p0x = digit.startX;
                const p0y = digit.startY - 28;
                const p1x = digit.startX + (digit.targetX - digit.startX) * 0.28;
                const p1y = Math.min(p0y, digit.targetY) - 34;
                const p2x = digit.targetX;
                const p2y = digit.targetY;

                cx = Math.pow(1 - s, 2) * p0x + 2 * (1 - s) * s * p1x + Math.pow(s, 2) * p2x;
                cy = Math.pow(1 - s, 2) * p0y + 2 * (1 - s) * s * p1y + Math.pow(s, 2) * p2y;

                // Emit stardust sparkles along trail
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

              // Prepend to motion trail history
              digit.history.unshift({ x: cx, y: cy, time: performance.now() });
              if (digit.history.length > 22) {
                digit.history.pop();
              }
            });

            frameId = requestAnimationFrame(updateFrame);
          } else {
            // Landing moment: all nine occurrences of this number have completed their movement!
            playParadeChime(num, soundEnabledRef.current);
            triggerHaptic('cell', hapticsEnabledRef.current);

            // Clear active flying digits for this number
            activeDigitsRef.current = [];

            // Add to completed numbers array so board marks this number as fully gathered
            completedNumbers.push(num);
            onNumberStepRef.current(num, completedNumbers);

            // Clean 140ms settling pause before next number starts
            setTimeout(() => {
              resolve();
            }, 140);
          }
        };

        frameId = requestAnimationFrame(updateFrame);
      });
    };

    // Sequential Executor: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9
    const executeEntireSequence = async () => {
      // 100ms pause to ensure completed board layout is measured
      await new Promise(r => setTimeout(r, 100));

      for (let n = 1; n <= 9; n++) {
        if (isCancelledRef.current) break;
        await animateSingleNumber(n);
      }

      if (!isCancelledRef.current) {
        // Only after all nine numbers have finished their animations:
        playVictoryFanfare(soundEnabledRef.current);
        triggerHaptic('celebration', hapticsEnabledRef.current);

        onNumberStepRef.current(null, [1, 2, 3, 4, 5, 6, 7, 8, 9]);

        // Brief celebratory 300ms pause before opening final game completion modal
        setTimeout(() => {
          if (!isCancelledRef.current) {
            onCompleteRef.current();
          }
        }, 300);
      }
    };

    executeEntireSequence();

    return () => {
      isCancelledRef.current = true;
      isRunningRef.current = false;
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden select-none">
      {/* Hardware-Accelerated Canvas for Motion Trails & Firecrackers */}
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
              className="text-base font-mono font-black px-2 py-0.5 rounded-lg text-white shadow-sm"
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
            isCancelledRef.current = true;
            activeDigitsRef.current = [];
            onNumberStepRef.current(null, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
            onCompleteRef.current();
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
