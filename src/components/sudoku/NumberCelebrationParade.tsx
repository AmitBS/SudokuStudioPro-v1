import React, { useEffect, useRef, useState } from 'react';
import { BoardMatrix, CompletionAnimationStyle, SudokuInputMode } from '../../types/sudoku';
import { playParadeChime, playParadeOccurrenceArrival, playVictoryFanfare, triggerHaptic } from '../../utils/audio';
import {
  drawSymbolOnCanvas,
  drawColorCircleOnCanvas,
  drawFruitOnCanvas,
  getConfiguredNumberColor,
  SudokuValueDisplay,
} from '../../utils/sudokuSymbols';
import { Sparkles, ArrowRight, Layers, Hash } from 'lucide-react';

interface NumberCelebrationParadeProps {
  board: BoardMatrix;
  isActive: boolean;
  onNumberStep: (currentAnimatingNum: number | null, completedNumbers: number[]) => void;
  onOccurrenceArrival?: (num: number, count: number) => void;
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

interface ActiveOccurrence {
  id: string;
  num: number;
  index: number; // 0 to 8 (occurrence 1 through 9)
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  color: string;
  startTime: number;
  flightDuration: number;
  endTime: number;
  hasArrived: boolean;
  history: TrailPoint[];
  curveSide: number;
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

interface ArrivalRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  decay: number;
  lineWidth: number;
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
  onOccurrenceArrival,
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
  const [currentCount, setCurrentCount] = useState<number>(0);

  // Synchronize mutable refs to make the sequential animation immune to React re-renders
  const boardRef = useRef<BoardMatrix>(board);
  boardRef.current = board;

  const onNumberStepRef = useRef(onNumberStep);
  onNumberStepRef.current = onNumberStep;

  const onOccurrenceArrivalRef = useRef(onOccurrenceArrival);
  onOccurrenceArrivalRef.current = onOccurrenceArrival;

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
  const activeOccurrencesRef = useRef<ActiveOccurrence[]>([]);
  const arrivalRingsRef = useRef<ArrivalRing[]>([]);
  const stardustRef = useRef<StardustSpark[]>([]);
  const rocketsRef = useRef<FireworkRocket[]>([]);
  const fireworksRef = useRef<FireworkParticle[]>([]);

  // 1. Hardware-Accelerated Canvas Rendering Loop (Motion Trails, Echoes, Arrival Bursts, Firecrackers)
  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina & High-DPI Display Sharpness
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    updateCanvasSize();

    let animationFrameId: number;
    let tick = 0;

    const firecrackerColors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#f43f5e', '#06b6d4', '#eab308'];

    const spawnFirecracker = () => {
      const x = Math.random() * (window.innerWidth - 160) + 80;
      rocketsRef.current.push({
        x,
        y: window.innerHeight,
        vy: -(Math.random() * 6 + 12),
        targetY: Math.random() * (window.innerHeight * 0.4) + 60,
        color: firecrackerColors[Math.floor(Math.random() * firecrackerColors.length)],
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      tick++;

      // Launch ambient celebration firecrackers
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
          // Burst firecracker bouquet
          for (let i = 0; i < 36; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 1.5;
            fireworksRef.current.push({
              x: r.x,
              y: r.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: Math.random() * 3.2 + 1.8,
              color: firecrackerColors[Math.floor(Math.random() * firecrackerColors.length)],
              alpha: 1,
              gravity: 0.12,
              decay: Math.random() * 0.016 + 0.012,
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

      // --- C. Render Destination Arrival Shockwave Rings ---
      arrivalRingsRef.current = arrivalRingsRef.current.filter(r => {
        r.radius += 1.4;
        r.alpha -= r.decay;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) return false;

        ctx.save();
        ctx.globalAlpha = Math.max(0, r.alpha);
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.lineWidth = r.lineWidth;
        ctx.strokeStyle = r.color;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();

        return true;
      });

      // --- D. Render Stardust Trail & Burst Sparks ---
      stardustRef.current = stardustRef.current.filter(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.975;
        s.vy *= 0.975;
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

      // --- E. Render Flying Occurrences with High-Fidelity Motion Trails ---
      const isRibbon = (animationStyleRef.current || 'ribbon') === 'ribbon';

      activeOccurrencesRef.current.forEach(occ => {
        const history = occ.history;
        if (history.length === 0 || occ.hasArrived) return;

        const head = history[0];
        const numColor = occ.color;

        if (isRibbon) {
          // ----------------------------------------------------
          // ANIMATION STYLE 1: HIGH-POLISH SILK RIBBON STYLE
          // "Display motion trail ribbons filled with the moving number, using its existing color."
          // ----------------------------------------------------

          if (history.length > 2) {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Pass 1: Outer soft luminous aura
            for (let i = 0; i < history.length - 1; i++) {
              const p1 = history[i];
              const p2 = history[i + 1];
              const ratio = 1 - i / history.length;
              const alpha = Math.max(0, Math.min(0.45, ratio * 0.45));
              const lineWidth = Math.max(4, ratio * 28);

              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = numColor;
              ctx.globalAlpha = alpha;
              ctx.shadowColor = numColor;
              ctx.shadowBlur = 16;
              ctx.stroke();
            }

            // Pass 2: Saturated body ribbon with fluid opacity taper
            for (let i = 0; i < history.length - 1; i++) {
              const p1 = history[i];
              const p2 = history[i + 1];
              const ratio = 1 - i / history.length;
              const alpha = Math.max(0, Math.min(0.88, ratio * 0.88));
              const lineWidth = Math.max(2.5, ratio * 16);

              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = numColor;
              ctx.globalAlpha = alpha;
              ctx.shadowColor = numColor;
              ctx.shadowBlur = 6;
              ctx.stroke();
            }

            // Pass 3: Crisp white specular energy core line down the center
            for (let i = 0; i < history.length - 1; i++) {
              const p1 = history[i];
              const p2 = history[i + 1];
              const ratio = 1 - i / history.length;
              const alpha = Math.max(0, Math.min(0.75, ratio * 0.75));
              const lineWidth = Math.max(1, ratio * 2.8);

              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = '#ffffff';
              ctx.globalAlpha = alpha;
              ctx.shadowBlur = 0;
              ctx.stroke();
            }
            ctx.restore();

            // Repeating numbers / symbols along the ribbon path
            for (let i = 4; i < history.length - 1; i += 6) {
              const pt = history[i];
              const ratio = 1 - i / history.length;
              const alpha = Math.max(0.2, ratio * 0.95);
              const fontSize = Math.max(9, Math.round(10 + ratio * 5));

              ctx.save();
              ctx.globalAlpha = alpha;
              ctx.translate(pt.x, pt.y);

              // Orient with the tangent angle of the ribbon motion
              const prevPt = history[Math.max(0, i - 1)];
              const angle = Math.atan2(prevPt.y - pt.y, prevPt.x - pt.x);
              ctx.rotate(angle);

              if (inputModeRef.current === 'fruits') {
                drawFruitOnCanvas(ctx, occ.num, 0, 0, fontSize * 1.35);
              } else if (inputModeRef.current === 'colors') {
                drawColorCircleOnCanvas(ctx, occ.num, 0, 0, fontSize * 1.3, customColorsRef.current);
              } else if (inputModeRef.current === 'symbols') {
                drawSymbolOnCanvas(ctx, occ.num, 0, 0, fontSize * 1.15, '#ffffff');
              } else {
                ctx.font = `900 ${fontSize}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
                ctx.shadowBlur = 3;
                ctx.fillText(String(occ.num), 0, 0);
              }
              ctx.restore();
            }
          }

          // Ghost Echo Afterimages Behind Head
          const echoIndices = [5, 12, 19];
          echoIndices.forEach((idx, step) => {
            if (idx < history.length) {
              const echoPt = history[idx];
              const echoAlpha = (1 - (step + 1) * 0.25) * 0.5;
              const echoScale = 1 - (step + 1) * 0.12;

              if (echoAlpha > 0.05) {
                ctx.save();
                ctx.globalAlpha = echoAlpha;
                ctx.translate(echoPt.x, echoPt.y);
                ctx.scale(echoScale, echoScale);

                const badgeSize = 32;
                const radius = 8;

                ctx.beginPath();
                ctx.roundRect(-badgeSize / 2, -badgeSize / 2, badgeSize, badgeSize, radius);
                ctx.fillStyle = numColor;
                ctx.shadowColor = numColor;
                ctx.shadowBlur = 10;
                ctx.fill();

                if (inputModeRef.current === 'fruits') {
                  drawFruitOnCanvas(ctx, occ.num, 0, 0, 22);
                } else if (inputModeRef.current === 'colors') {
                  drawColorCircleOnCanvas(ctx, occ.num, 0, 0, 20, customColorsRef.current);
                } else if (inputModeRef.current === 'symbols') {
                  drawSymbolOnCanvas(ctx, occ.num, 0, 0, 16, '#ffffff');
                } else {
                  ctx.font = 'bold 18px monospace';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = '#ffffff';
                  ctx.fillText(String(occ.num), 0, 1);
                }

                ctx.restore();
              }
            }
          });
        } else {
          // ----------------------------------------------------
          // ANIMATION STYLE 2: CRISP NUMBERS / SYMBOLS / FRUITS ONLY
          // "Display only the moving numbers along their paths, without ribbon shapes."
          // ----------------------------------------------------
          // Strictly ZERO ribbon shapes or strokes drawn!
          const streamIndices = [5, 11, 17, 23];
          streamIndices.forEach((idx, step) => {
            if (idx < history.length) {
              const streamPt = history[idx];
              const ratio = 1 - (step + 1) * 0.18;
              const alpha = Math.max(0.12, ratio * 0.8);
              const badgeSize = Math.max(16, Math.round(32 * ratio));
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
                drawFruitOnCanvas(ctx, occ.num, 0, 0, Math.round(badgeSize * 0.72));
              } else if (inputModeRef.current === 'colors') {
                drawColorCircleOnCanvas(ctx, occ.num, 0, 0, Math.round(badgeSize * 0.68), customColorsRef.current);
              } else if (inputModeRef.current === 'symbols') {
                drawSymbolOnCanvas(ctx, occ.num, 0, 0, Math.round(badgeSize * 0.58), '#ffffff');
              } else {
                const fontSize = Math.max(10, Math.round(badgeSize * 0.58));
                ctx.font = `bold ${fontSize}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(String(occ.num), 0, 1);
              }

              ctx.restore();
            }
          });
        }

        // Lead Tile at Head (Active in both styles)
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
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.shadowBlur = 0;
        ctx.stroke();

        if (inputModeRef.current === 'fruits') {
          drawFruitOnCanvas(ctx, occ.num, 0, 0, 28);
        } else if (inputModeRef.current === 'colors') {
          drawColorCircleOnCanvas(ctx, occ.num, 0, 0, 26, customColorsRef.current);
        } else if (inputModeRef.current === 'symbols') {
          drawSymbolOnCanvas(ctx, occ.num, 0, 0, 22, '#ffffff');
        } else {
          // Bold white numeral
          ctx.font = '900 22px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(String(occ.num), 0, 1);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      updateCanvasSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive]);

  // 2. Strict Sequential Animation Controller (Number 1 -> 2 -> ... -> 9)
  // Each number animates all 9 occurrences one by one into its destination box.
  useEffect(() => {
    if (!isActive) return;
    if (isRunningRef.current) return;

    isRunningRef.current = true;
    isCancelledRef.current = false;

    const completedNumbers: number[] = [];

    // Helper to animate all 9 occurrences of one specific number into its numpad button
    const animateSingleNumber = (num: number): Promise<void> => {
      return new Promise<void>(resolve => {
        if (isCancelledRef.current) {
          resolve();
          return;
        }

        setCurrentNum(num);
        setCurrentCount(0);
        onNumberStepRef.current(num, completedNumbers);

        // 1. Locate destination number box below the board
        const targetBtn = document.getElementById(`numpad-btn-${num}`);
        const targetRect = targetBtn?.getBoundingClientRect();
        const boardEl = document.querySelector('[role="grid"][aria-label="Sudoku Board"]');
        const boardRect = boardEl?.getBoundingClientRect();

        // 2. Find all 9 occurrences of this number on the board in standard reading order
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

        const color = getConfiguredNumberColor(num, inputModeRef.current, customColorsRef.current);

        // 3. Staggered Flight Configuration:
        // Each of the 9 occurrences takes flight with a rhythmic interval (160ms).
        // Each occurrence flies along an arching Bézier path with motion trails and lands in the box.
        // Arrival events trigger counter increments (0/9 -> 9/9) and progressive color transitions.
        const STAGGER_MS = 160;
        const FLIGHT_DURATION = 720;

        const occurrences: ActiveOccurrence[] = matchingCells.map(({ r, c, rect }, index) => {
          const sx = rect.left + rect.width / 2;
          const sy = rect.top + rect.height / 2;
          const startTime = index * STAGGER_MS;
          const curveSide = ((index % 3) - 1) * 24;

          return {
            id: `${num}-${r}-${c}-${index}`,
            num,
            index,
            startX: sx,
            startY: sy,
            targetX: destX,
            targetY: destY,
            color,
            startTime,
            flightDuration: FLIGHT_DURATION,
            endTime: startTime + FLIGHT_DURATION,
            hasArrived: false,
            history: [{ x: sx, y: sy, time: performance.now() }],
            curveSide,
          };
        });

        activeOccurrencesRef.current = occurrences;
        const sequenceStartTime = performance.now();
        let frameId: number;

        const updateFrame = () => {
          if (isCancelledRef.current) {
            activeOccurrencesRef.current = [];
            resolve();
            return;
          }

          const elapsed = performance.now() - sequenceStartTime;
          let allOccurrencesArrived = true;

          activeOccurrencesRef.current.forEach(occ => {
            if (occ.hasArrived) return;

            if (elapsed < occ.startTime) {
              // Not started moving yet
              allOccurrencesArrived = false;
              return;
            }

            if (elapsed < occ.endTime) {
              allOccurrencesArrived = false;
              const localElapsed = elapsed - occ.startTime;
              const progress = localElapsed / occ.flightDuration;

              let cx = occ.startX;
              let cy = occ.startY;

              if (progress < 0.22) {
                // Phase 1: Gentle lift off the board cell (-22px)
                const u = easeOutQuad(progress / 0.22);
                cx = occ.startX;
                cy = occ.startY - 22 * u;
              } else {
                // Phase 2: Travel down into destination box along curved Bézier arc
                const s = easeInOutCubic((progress - 0.22) / 0.78);

                const p0x = occ.startX;
                const p0y = occ.startY - 22;
                const p1x = occ.startX + (occ.targetX - occ.startX) * 0.35 + occ.curveSide;
                const p1y = Math.min(p0y, occ.targetY) - 38;
                const p2x = occ.targetX;
                const p2y = occ.targetY;

                cx = Math.pow(1 - s, 2) * p0x + 2 * (1 - s) * s * p1x + Math.pow(s, 2) * p2x;
                cy = Math.pow(1 - s, 2) * p0y + 2 * (1 - s) * s * p1y + Math.pow(s, 2) * p2y;

                // Emit stardust sparkles along trail
                if (Math.random() < 0.38) {
                  const angle = Math.random() * Math.PI * 2;
                  const speed = Math.random() * 1.6 + 0.4;
                  stardustRef.current.push({
                    x: cx + (Math.random() - 0.5) * 6,
                    y: cy + (Math.random() - 0.5) * 6,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 2.6 + 1.2,
                    color: occ.color,
                    alpha: 0.9,
                    decay: Math.random() * 0.02 + 0.012,
                  });
                }
              }

              occ.history.unshift({ x: cx, y: cy, time: performance.now() });
              if (occ.history.length > 36) {
                occ.history.pop();
              }
            } else {
              // EXACT ARRIVAL MOMENT: occurrence enters the destination box!
              occ.hasArrived = true;
              occ.history = [];
              const arrivalCount = occ.index + 1; // 1 to 9!

              setCurrentCount(arrivalCount);
              onOccurrenceArrivalRef.current?.(num, arrivalCount);

              // 1. Emit arrival shockwave ring
              arrivalRingsRef.current.push({
                x: occ.targetX,
                y: occ.targetY,
                radius: 8,
                maxRadius: 42,
                color: occ.color,
                alpha: 0.95,
                decay: 0.025,
                lineWidth: 2.5,
              });

              // 2. Emit radial arrival spark burst (12 particles)
              for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.2;
                const speed = Math.random() * 2.2 + 0.9;
                stardustRef.current.push({
                  x: occ.targetX,
                  y: occ.targetY,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  size: Math.random() * 2.8 + 1.5,
                  color: occ.color,
                  alpha: 1,
                  decay: Math.random() * 0.025 + 0.018,
                });
              }

              // 3. Audio & Haptics synchronized with exact arrival
              playParadeOccurrenceArrival(num, arrivalCount, soundEnabledRef.current);
              triggerHaptic(arrivalCount === 9 ? 'medium' : 'light', hapticsEnabledRef.current);
            }
          });

          if (!allOccurrencesArrived) {
            frameId = requestAnimationFrame(updateFrame);
          } else {
            // All 9 occurrences of this number have reached the box!
            playParadeChime(num, soundEnabledRef.current);
            triggerHaptic('cell', hapticsEnabledRef.current);

            // Clear active occurrences for this number
            activeOccurrencesRef.current = [];

            // Mark number as fully completed
            completedNumbers.push(num);
            onNumberStepRef.current(num, completedNumbers);

            // Clean 320ms settling pause before next number starts
            setTimeout(() => {
              resolve();
            }, 320);
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

        // Celebratory 500ms pause before opening final game completion modal
        setTimeout(() => {
          if (!isCancelledRef.current) {
            onCompleteRef.current();
          }
        }, 500);
      }
    };

    executeEntireSequence();

    return () => {
      isCancelledRef.current = true;
      isRunningRef.current = false;
    };
  }, [isActive]);

  if (!isActive) return null;

  const activeColor = getConfiguredNumberColor(currentNum, inputMode, customColors);

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
              className="inline-flex items-center justify-center font-mono font-black px-2 py-0.5 rounded-lg text-white shadow-sm transition-colors duration-200"
              style={{
                backgroundColor: activeColor,
              }}
            >
              <SudokuValueDisplay value={currentNum} inputMode={inputMode} customColors={customColors} size="sm" />
            </span>{' '}
            of 9
            <span className="ml-1 text-[11px] sm:text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/25">
              {currentCount}/9
            </span>
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
              activeOccurrencesRef.current = [];
              for (let n = 1; n <= 9; n++) {
                onOccurrenceArrivalRef.current?.(n, 9);
              }
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
