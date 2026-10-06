// Centralized Sound & Haptic Manager for Sudoku Studio Pro
// Uses Web Audio API for offline, latency-free, warm acoustic sound synthesis.

export type SoundPriority =
  | 'GAME_COMPLETION' // Priority 1
  | 'MULTI_UNIT'      // Priority 2
  | 'SINGLE_UNIT'     // Priority 3
  | 'NUMBER_ENTRY'    // Priority 4
  | 'NOTE_ENTRY'      // Priority 5
  | 'CELL_SELECT';    // Priority 6

const PRIORITY_LEVELS: Record<SoundPriority, number> = {
  GAME_COMPLETION: 1,
  MULTI_UNIT: 2,
  SINGLE_UNIT: 3,
  NUMBER_ENTRY: 4,
  NOTE_ENTRY: 5,
  CELL_SELECT: 6,
};

let audioCtx: AudioContext | null = null;
let lastSoundTime = 0;
let lastSoundPriority = 999;
let activeCelebrationTimeout: number | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Helper to check priority and rate limit
function canPlaySound(priority: SoundPriority, minIntervalMs = 40): boolean {
  const now = performance.now();
  const level = PRIORITY_LEVELS[priority];

  // If a celebration is actively playing, suppress lower priority sounds
  if (lastSoundPriority === 1 && level > 1 && now - lastSoundTime < 3000) {
    return false;
  }

  // Prevent machine gunning of same or lower priority sounds
  if (level >= lastSoundPriority && now - lastSoundTime < minIntervalMs) {
    return false;
  }

  lastSoundTime = now;
  lastSoundPriority = level;
  return true;
}

// 1. CELL CLICK SOUND (Subtle, warm wooden click ~25ms)
export function playCellSelectSound(enabled = true): void {
  if (!enabled) return;
  if (!canPlaySound('CELL_SELECT', 50)) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    // Gentle natural wooden pitch drop
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.025);

    // Warm low-pass to eliminate harsh clicking
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    // Soft envelope: 2ms attack, 23ms decay
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  } catch {
    // Ignore audio errors
  }
}

// 2. NUMBER ENTRY SOUND (Warm Vibraphone / Rhodes bell confirmation ~80ms)
export function playNumberEntrySound(enabled = true): void {
  if (!enabled) return;
  if (!canPlaySound('NUMBER_ENTRY', 40)) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Dual-tone harmonic vibraphone timbre (D5 587.33Hz + overtone A5 880Hz)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(592, now + 0.08);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now); // A5 overtone

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);

    // Smooth bell curve envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.09);
    osc2.stop(now + 0.09);
  } catch {
    // Ignore
  }
}

// 3. NOTE / PENCIL MARK SOUND (Light, crisp, gentle paper-tick ~35ms)
export function playNoteEntrySound(enabled = true, isRemoval = false): void {
  if (!enabled) return;
  if (!canPlaySound('NOTE_ENTRY', 35)) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    const startFreq = isRemoval ? 740 : 880;
    const endFreq = isRemoval ? 520 : 920;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.035);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    filter.Q.setValueAtTime(1.5, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.025, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    // Ignore
  }
}

// 4.5 HINT SOUND (Gentle inquisitive chime ~60ms)
export function playHintSound(enabled = true): void {
  if (!enabled) return;
  if (!canPlaySound('NOTE_ENTRY', 50)) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.08); // C6

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    // Ignore
  }
}

// Aliases for seamless compatibility
export const playTapSound = playCellSelectSound;
export const playPlaceNumberSound = playNumberEntrySound;
export const playNoteSound = playNoteEntrySound;
export const playVictoryFanfare = playCelebrationFanfare;

export function playEraseSound(enabled = true): void {
  if (!enabled) return;
  if (!canPlaySound('NOTE_ENTRY', 40)) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch {
    // Ignore
  }
}

// 5. ERROR SOUND (Soft low buzz - not jarring)
export function playErrorSound(enabled = true): void {
  if (!enabled) return;
  if (!canPlaySound('NUMBER_ENTRY', 60)) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.setValueAtTime(150, now + 0.06);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch {
    // Ignore
  }
}

// 6. UNIT COMPLETION SOUND (1, 2, or 3 simultaneous rows/columns/boxes)
// Uses a short, rewarding musical sequence with ascending tones
export function playUnitCompletionSound(unitCount: number, enabled = true): void {
  if (!enabled) return;
  const count = Math.min(3, Math.max(1, unitCount));
  const priority: SoundPriority = count > 1 ? 'MULTI_UNIT' : 'SINGLE_UNIT';

  if (!canPlaySound(priority, 100)) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Harmonic chords per completed unit
    // Unit 1: F5 (698.46Hz) + C6 (1046.5Hz)
    // Unit 2: A5 (880Hz) + E6 (1318.5Hz)
    // Unit 3: C6 (1046.5Hz) + G6 (1567.98Hz) + shimmer
    const chordFrequencies = [
      [698.46, 1046.5],
      [880.0, 1318.5],
      [1046.5, 1567.98],
    ];

    for (let u = 0; u < count; u++) {
      const delay = u * 0.11; // 110ms spacing between units
      const [f1, f2] = chordFrequencies[u];

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(f1, now + delay);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(f2, now + delay);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600 + u * 400, now + delay);

      const unitGain = 0.07 + u * 0.015;
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.linearRampToValueAtTime(unitGain, now + delay + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.22);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now + delay);
      osc2.start(now + delay);
      osc1.stop(now + delay + 0.25);
      osc2.stop(now + delay + 0.25);
    }
  } catch {
    // Ignore
  }
}

// 7. GAME COMPLETION CELEBRATION FANFARE
// A warm, rich, human-like celebratory musical arpeggio + chime sparkle cascade
export function playCelebrationFanfare(enabled = true): void {
  if (!enabled) return;
  if (!canPlaySound('GAME_COMPLETION', 500)) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Ascending melody: C5 -> E5 -> G5 -> B5 -> C6 -> E6 (Triumphant Acoustic Arpeggio)
    const melody = [
      { freq: 523.25, time: 0.0, dur: 0.28, vol: 0.09 }, // C5
      { freq: 659.25, time: 0.12, dur: 0.28, vol: 0.10 }, // E5
      { freq: 783.99, time: 0.24, dur: 0.32, vol: 0.11 }, // G5
      { freq: 987.77, time: 0.38, dur: 0.35, vol: 0.12 }, // B5
      { freq: 1046.50, time: 0.52, dur: 0.55, vol: 0.14 }, // C6
      { freq: 1318.51, time: 0.68, dur: 0.75, vol: 0.13 }, // E6 Harmonic Peak
    ];

    melody.forEach(({ freq, time, dur, vol }) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now + time);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 1.002, now + time); // Faint organic chorus

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, now + time);

      gain.gain.setValueAtTime(0.0001, now + time);
      gain.gain.linearRampToValueAtTime(vol, now + time + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now + time);
      osc2.start(now + time);
      osc1.stop(now + time + dur + 0.05);
      osc2.stop(now + time + dur + 0.05);
    });

    // Sparkle flourishes in background (Celesta chimes at 0.9s)
    const sparkles = [1567.98, 1760.0, 2093.0, 2349.32];
    sparkles.forEach((sFreq, sIdx) => {
      const sTime = 0.85 + sIdx * 0.08;
      const sOsc = ctx.createOscillator();
      const sGain = ctx.createGain();

      sOsc.type = 'sine';
      sOsc.frequency.setValueAtTime(sFreq, now + sTime);

      sGain.gain.setValueAtTime(0.0001, now + sTime);
      sGain.gain.linearRampToValueAtTime(0.04, now + sTime + 0.005);
      sGain.gain.exponentialRampToValueAtTime(0.0001, now + sTime + 0.3);

      sOsc.connect(sGain);
      sGain.connect(ctx.destination);

      sOsc.start(now + sTime);
      sOsc.stop(now + sTime + 0.35);
    });
  } catch {
    // Ignore
  }
}

// 8. HAPTIC FEEDBACK ENGINE (Completely independent of Sound)
export function triggerHaptic(
  type: 'cell' | 'number' | 'note' | 'unit' | 'multiUnit' | 'error' | 'celebration' | 'light' | 'medium' | 'success',
  enabled = true
): void {
  if (!enabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
  try {
    switch (type) {
      case 'cell':
      case 'light':
        navigator.vibrate(8);
        break;
      case 'number':
      case 'medium':
        navigator.vibrate(18);
        break;
      case 'note':
        navigator.vibrate(8);
        break;
      case 'unit':
        navigator.vibrate([25, 35, 25]);
        break;
      case 'multiUnit':
        navigator.vibrate([30, 40, 30, 40, 50]);
        break;
      case 'error':
        navigator.vibrate([30, 40, 30]);
        break;
      case 'celebration':
      case 'success':
        // Rhythmic celebratory pulse
        navigator.vibrate([40, 60, 40, 60, 80, 100, 120]);
        break;
    }
  } catch {
    // Ignore
  }
}
