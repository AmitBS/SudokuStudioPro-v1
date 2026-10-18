import React, { useEffect, useRef, useState } from 'react';
import { BoardMatrix, CompletionAnimationStyle, SudokuInputMode } from '../../types/sudoku';
import { playParadeChime, playVictoryFanfare, triggerHaptic } from '../../utils/audio';
import { drawSymbolOnCanvas, drawColorCircleOnCanvas, drawFruitOnCanvas, getSudokuColor, SudokuValueDisplay } from '../../utils/sudokuSymbols';
import { Sparkles, ArrowRight, Layers, Hash } from 'lucide-react';

interface NumberCelebrationParadeProps {
  board: BoardMatrix;
  isActive: boolean;
  onNumberStep: (currentAnimatingNum: number | null, completedNumbers: number[]) => void;
  onComplete: () => void;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  animationStyle?: CompletionAnimationStyle;
  onToggleAnimationStyle?: () => void;
  inputMode?: SudokuInputMode;
  customColors?: Record<number, string>;
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
  animationStyle = 'ribbon',
  onToggleAnimationStyle,
  inputMode = 'numbers',
  customColors,
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

  const animationStyleRef = useRef<CompletionAnimationStyle>(animationStyle);
  animationStyleRef.current = animationStyle;

  const inputModeRef = useRef<SudokuInputMode>(inputMode);
  inputModeRef.current = inputMode;

  const customColorsRef = useRef<Record<number, string> | undefined>(customColors);
  customColorsRef.current = customColors;

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

      // --- D. Render Traveling Numbers with Motion Trails ---
      const isRibbon = (animationStyleRef.current || 'ribbon') === 'ribbon';

      activeDigitsRef.current.forEach(digit => {
        const history = digit.history;
        if (history.length === 0) return;

        const head = history[0];
        const numColor = digit.color;

        if (isRibbon) {
          // ----------------------------------------------------
          // ANIMATION STYLE 1: RIBBON STYLE
          // "Display motion trail ribbons filled with the moving number, using its existing color."
          // ----------------------------------------------------

          // 1. Smooth, luminous ribbon band in existing number color
          if (history.length > 2) {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let i = 0; i < history.length - 1; i++) {
              const p1 = history[i];
              const p2 = history[i + 1];
              const ratio = 1 - i / history.length;
              const alpha = Math.max(0, Math.min(0.85, ratio * 0.85));
              const lineWidth = Math.max(3, ratio * 24);

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

            // 2. Motion trail ribbons FILLED with the moving number or symbol along the ribbon path!
            for (let i = 2; i < history.length - 1; i += 3) {
              const pt = history[i];
              const ratio = 1 - i / history.length;
              const alpha = Math.max(0.2, ratio * 0.95);
              const fontSize = Math.max(10, Math.round(11 + ratio * 5));

              ctx.save();
              ctx.globalAlpha = alpha;
              ctx.translate(pt.x, pt.y);

              // Orient with the tangent angle of the ribbon motion
              const prevPt = history[Math.max(0, i - 1)];
              const angle = Math.atan2(prevPt.y - pt.y, prevPt.x - pt.x);
              ctx.rotate(angle);

              if (inputModeRef.current === 'fruits') {
                drawFruitOnCanvas(ctx, digit.num, 0, 0, fontSize * 1.35);
              } else if (inputModeRef.current === 'colors') {
                drawColorCircleOnCanvas(ctx, digit.num, 0, 0, fontSize * 1.3, customColorsRef.current);
              } else if (inputModeRef.current === 'symbols') {
                drawSymbolOnCanvas(ctx, digit.num, 0, 0, fontSize * 1.15, '#ffffff');
              } else {
                ctx.font = `900 ${fontSize}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
                ctx.shadowBlur = 3;
                ctx.fillText(String(digit.num), 0, 0);
              }
              ctx.restore();
            }
          }

          // 3. Ghost Echo Afterimages Behind Head
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

                if (inputModeRef.current === 'fruits') {
                  drawFruitOnCanvas(ctx, digit.num, 0, 0, 24);
                } else if (inputModeRef.current === 'colors') {
                  drawColorCircleOnCanvas(ctx, digit.num, 0, 0, 22, customColorsRef.current);
                } else if (inputModeRef.current === 'symbols') {
                  drawSymbolOnCanvas(ctx, digit.num, 0, 0, 18, '#ffffff');
                } else {
                  ctx.font = 'bold 20px monospace';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = '#ffffff';
                  ctx.fillText(String(digit.num), 0, 1);
                }

                ctx.restore();
              }
            }
          });
        } else {
          // ----------------------------------------------------
          // ANIMATION STYLE 2: NUMBERS / SYMBOLS / COLORS ONLY
          // "Display only the moving numbers along their paths, without ribbon shapes."
          // ----------------------------------------------------
          // Absolutely NO ribbon shapes or strokes drawn! Only distinct moving tiles along the path.
          const numberStreamIndices = [3, 6, 9, 12, 15, 18];
          numberStreamIndices.forEach((idx, step) => {
            if (idx < history.length) {
              const streamPt = history[idx];
              const ratio = 1 - (step + 1) * 0.14;
              const alpha = Math.max(0.12, ratio * 0.85);
              const badgeSize = Math.max(18, Math.round(34 * ratio));
              const radius = Math.max(4, Math.round(badgeSize * 0.26));

              ctx.save();
              ctx.globalAlpha = alpha;
              ctx.translate(streamPt.x, streamPt.y);

              // Discrete glowing tile without ribbon shape
              ctx.beginPath();
              ctx.roundRect(-badgeSize / 2, -badgeSize / 2, badgeSize, badgeSize, radius);
              ctx.fillStyle = numColor;
              ctx.shadowColor = numColor;
              ctx.shadowBlur = 8;
              ctx.fill();

              ctx.lineWidth = 1.5;
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.shadowBlur = 0;
              ctx.stroke();

              if (inputModeRef.current === 'fruits') {
                drawFruitOnCanvas(ctx, digit.num, 0, 0, Math.round(badgeSize * 0.72));
              } else if (inputModeRef.current === 'colors') {
                drawColorCircleOnCanvas(ctx, digit.num, 0, 0, Math.round(badgeSize * 0.68), customColorsRef.current);
              } else if (inputModeRef.current === 'symbols') {
                drawSymbolOnCanvas(ctx, digit.num, 0, 0, Math.round(badgeSize * 0.58), '#ffffff');
              } else {
                const fontSize = Math.max(11, Math.round(badgeSize * 0.58));
                ctx.font = `bold ${fontSize}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(String(digit.num), 0, 1);
              }

              ctx.restore();
            }
          });
        }

        // 4. Lead Number/Symbol/Color/Fruit Tile at Head (Active in both styles)
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

        if (inputModeRef.current === 'fruits') {
          drawFruitOnCanvas(ctx, digit.num, 0, 0, 28);
        } else if (inputModeRef.current === 'colors') {
          drawColorCircleOnCanvas(ctx, digit.num, 0, 0, 26, customColorsRef.current);
        } else if (inputModeRef.current === 'symbols') {
          drawSymbolOnCanvas(ctx, digit.num, 0, 0, 22, '#ffffff');
        } else {
          // Bold white numeral
          ctx.font = '900 22px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(String(digit.num), 0, 1);
        }

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
        const color = inputModeRef.current === 'colors'
          ? getSudokuColor(num, customColorsRef.current)
          : (DIGIT_COLORS[num] || '#3b82f6');

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
          <span className="text-xs sm:text-sm font-extrabold tracking-tight flex items-center gap-1.5">
            Gathering {inputMode === 'fruits' ? 'Fruit' : inputMode === 'colors' ? 'Color' : inputMode === 'symbols' ? 'Symbol' : 'Number'}{' '}
            <span
              className="inline-flex items-center justify-center font-mono font-black px-2 py-0.5 rounded-lg text-white shadow-sm"
              style={{
                backgroundColor:
                  inputMode === 'colors'
                    ? getSudokuColor(currentNum, customColors)
                    : (DIGIT_COLORS[currentNum] || 'var(--md-sys-color-primary)'),
              }}
            >
              <SudokuValueDisplay value={currentNum} inputMode={inputMode} customColors={customColors} size="sm" />
            </span>{' '}
            of 9
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onToggleAnimationStyle && (
            <button
              type="button"
              onClick={onToggleAnimationStyle}
              title={`Toggle between Ribbon Style and ${inputMode === 'fruits' ? 'Fruits Only' : inputMode === 'colors' ? 'Colors Only' : inputMode === 'symbols' ? 'Symbols Only' : 'Numbers Only'}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-md hover:opacity-90 active:scale-95 transition-all"
              style={{
                backgroundColor: 'var(--md-sys-color-surface)',
                borderColor: 'var(--md-sys-color-outline-variant)',
                color: 'var(--md-sys-color-on-surface)',
              }}
            >
              {animationStyle === 'numbers_only' ? (
                <>
                  <Hash className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">
                    {inputMode === 'fruits' ? 'Fruits Only' : inputMode === 'colors' ? 'Colors Only' : inputMode === 'symbols' ? 'Symbols Only' : 'Numbers Only'}
                  </span>
                  <span className="sm:hidden">
                    {inputMode === 'fruits' ? 'Fruits' : inputMode === 'colors' ? 'Colors' : inputMode === 'symbols' ? 'Symbols' : 'Numbers'}
                  </span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">Show Ribbon</span>
                  <span className="sm:hidden">Ribbon</span>
                </>
              )}
            </button>
          )}

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
    </div>
  );
};
