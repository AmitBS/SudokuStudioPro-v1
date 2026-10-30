import confetti from 'canvas-confetti';

let confettiAnimationTimer: number | null = null;
let cascadeInterval: number | null = null;

const VICTORY_COLORS = [
  '#F59E0B', // Warm Amber Gold
  '#10B981', // Vibrant Emerald
  '#3B82F6', // Crisp Royal Blue
  '#8B5CF6', // Radiant Violet
  '#EC4899', // Brilliant Rose
  '#06B6D4', // Electric Cyan
  '#EAB308', // Radiant Sun Gold
  '#F43F5E', // Vivid Coral
];

/**
 * Triggers a multi-stage, high-energy particle celebration using canvas-confetti.
 * Includes cannon salvos, center star fountains, and a cascading fireworks finale.
 */
export function launchVictoryConfetti(): void {
  stopVictoryConfetti();

  try {
    // 1. Initial Side Cannons Salvo (Left & Right)
    confetti({
      particleCount: 90,
      angle: 60,
      spread: 75,
      origin: { x: 0, y: 0.8 },
      colors: VICTORY_COLORS,
      startVelocity: 55,
      gravity: 0.85,
      scalar: 1.15,
      ticks: 350,
      zIndex: 9999,
    });

    confetti({
      particleCount: 90,
      angle: 120,
      spread: 75,
      origin: { x: 1, y: 0.8 },
      colors: VICTORY_COLORS,
      startVelocity: 55,
      gravity: 0.85,
      scalar: 1.15,
      ticks: 350,
      zIndex: 9999,
    });

    // 2. Center Star & Ring Burst (+220ms)
    setTimeout(() => {
      confetti({
        particleCount: 75,
        spread: 100,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#00E5FF', '#76FF03'],
        shapes: ['circle', 'square'],
        startVelocity: 42,
        gravity: 0.7,
        scalar: 1.25,
        ticks: 320,
        zIndex: 9999,
      });
    }, 220);

    // 3. Cascading Firework Bursts (over next 2.2 seconds)
    const duration = 2200;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 260, zIndex: 9999 };

    cascadeInterval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        if (cascadeInterval !== null) {
          clearInterval(cascadeInterval);
          cascadeInterval = null;
        }
        return;
      }

      const particleCount = 35 * (timeLeft / duration);

      // Random burst across the top screen
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.15, 0.4), y: Math.random() * 0.4 + 0.15 },
        colors: VICTORY_COLORS,
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.6, 0.85), y: Math.random() * 0.4 + 0.15 },
        colors: VICTORY_COLORS,
      });
    }, 280);

    // 4. Grand Golden Shimmer Finish (+1200ms)
    confettiAnimationTimer = window.setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 90,
        spread: 120,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#F59E0B', '#FBBF24', '#FCD34D', '#FFFBEB'],
        startVelocity: 35,
        gravity: 0.5,
        ticks: 280,
        scalar: 1.1,
        zIndex: 9999,
      });
    }, 1200);
  } catch (err) {
    console.error('Confetti animation error:', err);
  }
}

/**
 * Clean up active confetti intervals and timers.
 */
export function stopVictoryConfetti(): void {
  if (cascadeInterval !== null) {
    clearInterval(cascadeInterval);
    cascadeInterval = null;
  }
  if (confettiAnimationTimer !== null) {
    clearTimeout(confettiAnimationTimer);
    confettiAnimationTimer = null;
  }
  try {
    confetti.reset();
  } catch {
    // Ignore
  }
}

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
