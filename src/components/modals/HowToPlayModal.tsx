import React, { useState } from 'react';
import { useTheme } from '../../theme/themeContext';
import { SudokuInputMode } from '../../types/sudoku';
import { SudokuValueDisplay } from '../../utils/sudokuSymbols';
import {
  Pencil,
  Pen,
  Compass,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MousePointerClick,
  Timer,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  playNoteEntrySound,
  playNumberEntrySound,
  playTapSound,
  triggerHaptic,
} from '../../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled?: boolean;
  hapticsEnabled?: boolean;
  inputMode?: SudokuInputMode;
  customColors?: Record<number, string>;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  soundEnabled = true,
  hapticsEnabled = true,
  inputMode = 'numbers',
  customColors,
}) => {
  const { isDark, activePrimary, activeOnPrimary } = useTheme();
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Interactive Sandbox state for Step 2
  const [sandboxMode, setSandboxMode] = useState<'normal' | 'pencil'>('pencil');
  const [sandboxCellValue, setSandboxCellValue] = useState<number | null>(null);
  const [sandboxNotes, setSandboxNotes] = useState<number[]>([1, 4, 7]);

  if (!isOpen) return null;

  const totalSteps = 4;

  const handleNext = () => {
    playTapSound(soundEnabled);
    triggerHaptic('light', hapticsEnabled);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    playTapSound(soundEnabled);
    triggerHaptic('light', hapticsEnabled);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Sandbox interactions
  const handleSandboxNumClick = (num: number) => {
    if (sandboxMode === 'pencil') {
      setSandboxNotes(prev => {
        const exists = prev.includes(num);
        const next = exists ? prev.filter(n => n !== num) : [...prev, num].sort((a, b) => a - b);
        playNoteEntrySound(soundEnabled, exists);
        triggerHaptic('note', hapticsEnabled);
        return next;
      });
      setSandboxCellValue(null);
    } else {
      playNumberEntrySound(soundEnabled);
      triggerHaptic('number', hapticsEnabled);
      setSandboxCellValue(prev => (prev === num ? null : num));
    }
  };

  const handleSandboxToggleMode = () => {
    playTapSound(soundEnabled);
    triggerHaptic('light', hapticsEnabled);
    setSandboxMode(prev => (prev === 'normal' ? 'pencil' : 'normal'));
  };

  const handleSandboxClear = () => {
    playTapSound(soundEnabled);
    setSandboxNotes([]);
    setSandboxCellValue(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="howto-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs select-none"
      style={{ backgroundColor: 'rgba(9, 13, 22, 0.78)' }}
    >
      <div
        style={{
          backgroundColor: 'var(--md-sys-color-surface)',
          borderColor: 'var(--md-sys-color-outline-variant)',
        }}
        className="w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Bar */}
        <div
          className="px-5 py-3.5 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.16)',
                color: '#F59E0B',
              }}
            >
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <div
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                Sudoku Studio Pro Guide
              </div>
              <h2
                id="howto-modal-title"
                className="text-base font-extrabold tracking-tight"
                style={{ color: 'var(--md-sys-color-on-surface)' }}
              >
                Notes & Candidate Features
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Guide"
            className="p-1.5 rounded-xl hover:opacity-75 transition-opacity"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Tabs */}
        <div
          className="flex items-center justify-between px-5 py-2 border-b text-xs font-semibold"
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
        >
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map(stepIdx => (
              <button
                key={stepIdx}
                type="button"
                onClick={() => setCurrentStep(stepIdx)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === stepIdx
                    ? 'w-7 bg-amber-500'
                    : currentStep > stepIdx
                    ? 'w-3 bg-amber-500/50'
                    : 'w-3 bg-black/15 dark:bg-white/15'
                }`}
                title={`Go to step ${stepIdx + 1}`}
              />
            ))}
          </div>
          <span
            className="text-[11px] font-mono font-bold"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-left flex-1">
          {/* STEP 1: PENCIL MODE VS NORMAL MODE */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: 'var(--md-sys-color-on-surface)' }}
                  >
                    1. Pencil Mode vs Normal Mode
                  </h3>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                  >
                    Draft possibilities without committing final answers.
                  </p>
                </div>
              </div>

              <div
                className="p-4 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: 'var(--md-sys-color-surface-container)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/15 text-blue-500 shrink-0">
                    <Pen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: 'var(--md-sys-color-on-surface)' }}
                    >
                      Normal Mode (Pen)
                    </h4>
                    <p
                      className="text-xs mt-0.5 leading-relaxed"
                      style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                      Places final numbers in the selected cell. If mistake checking is enabled, wrong numbers count against your 3 mistakes limit.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 shrink-0">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className="text-xs font-bold uppercase tracking-wide text-amber-500"
                    >
                      Pencil Mode (Notes)
                    </h4>
                    <p
                      className="text-xs mt-0.5 leading-relaxed"
                      style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                      Adds or removes miniature candidate marks inside the 3x3 cell matrix. <strong>No mistake penalties are given</strong> for candidate notes.
                    </p>
                  </div>
                </div>
              </div>

              {/* How to toggle */}
              <div
                className="p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium"
                style={{
                  backgroundColor: 'var(--md-sys-color-surface-container-high)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                  color: 'var(--md-sys-color-on-surface)',
                }}
              >
                <span>💡 <strong>Quick Toggle:</strong> Press <strong>P</strong> or <strong>N</strong> on your keyboard, or tap the Pencil button above the keypad.</span>
              </div>
            </div>
          )}

          {/* STEP 2: INTERACTIVE SANDBOX (TRY IT NOW!) */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                  <MousePointerClick className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: 'var(--md-sys-color-on-surface)' }}
                  >
                    2. Interactive Sandbox: Try It!
                  </h3>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                  >
                    Tap numbers below to see notes appear live in the cell.
                  </p>
                </div>
              </div>

              {/* Live Sandbox Workspace */}
              <div
                className="p-4 rounded-2xl border flex flex-col items-center justify-center gap-4"
                style={{
                  backgroundColor: 'var(--md-sys-color-surface-container)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                }}
              >
                {/* Mode Switcher inside Sandbox */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSandboxToggleMode}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      sandboxMode === 'pencil'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'border-slate-300 dark:border-slate-700 hover:opacity-85'
                    }`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Pencil Mode ({sandboxMode === 'pencil' ? 'ON' : 'OFF'})</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSandboxClear}
                    className="text-xs px-2.5 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 font-semibold text-rose-500"
                  >
                    Clear Cell
                  </button>
                </div>

                {/* Simulated 1-Cell Sudoku Box */}
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 flex items-center justify-center relative shadow-sm transition-all"
                  style={{
                    backgroundColor: isDark ? '#1E232A' : '#FFFFFF',
                    borderColor: sandboxMode === 'pencil' ? '#F59E0B' : activePrimary,
                  }}
                >
                  {sandboxCellValue !== null ? (
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-primary animate-in zoom-in-75">
                      <SudokuValueDisplay value={sandboxCellValue} inputMode={inputMode} customColors={customColors} size="lg" />
                    </span>
                  ) : (
                    /* 3x3 Notes Grid inside Sandbox */
                    <div className="w-full h-full p-1 grid grid-cols-3 grid-rows-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
                        const has = sandboxNotes.includes(n);
                        return (
                          <div
                            key={n}
                            className="flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold"
                            style={{
                              color: has ? '#F59E0B' : 'transparent',
                            }}
                          >
                            {n}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Corner indicator */}
                  <span className="absolute top-1 right-1 text-[9px] font-mono text-muted uppercase font-bold opacity-40">
                    {sandboxMode === 'pencil' ? 'Notes' : 'Placed'}
                  </span>
                </div>

                {/* Sandbox Numpad 1-9 */}
                <div className="grid grid-cols-9 gap-1 sm:gap-1.5 w-full max-w-sm">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSandboxNumClick(num)}
                      className={`h-9 sm:h-10 rounded-xl font-bold font-mono text-xs sm:text-sm border transition-all active:scale-90 flex items-center justify-center ${
                        sandboxMode === 'pencil' && sandboxNotes.includes(num)
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-surface hover:opacity-90'
                      }`}
                      style={{
                        backgroundColor:
                          sandboxMode === 'pencil' && sandboxNotes.includes(num)
                            ? '#F59E0B'
                            : 'var(--md-sys-color-surface)',
                        color:
                          sandboxMode === 'pencil' && sandboxNotes.includes(num)
                            ? '#FFFFFF'
                            : 'var(--md-sys-color-on-surface)',
                        borderColor: 'var(--md-sys-color-outline-variant)',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <p
                  className="text-[11px] text-center"
                  style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                >
                  {sandboxMode === 'pencil'
                    ? '✏️ In Pencil Mode, tapping numbers toggles candidate marks in the 3x3 positions.'
                    : '🖊️ In Normal Mode, tapping a number places it as the final answer.'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: AUTOMATIC CANDIDATE ELIMINATION */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: 'var(--md-sys-color-on-surface)' }}
                  >
                    3. Smart Candidate Calculation
                  </h3>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                  >
                    Self-cleaning notes that update as you solve.
                  </p>
                </div>
              </div>

              <div
                className="p-4 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: 'var(--md-sys-color-surface-container)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                }}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4
                      className="text-xs font-bold"
                      style={{ color: 'var(--md-sys-color-on-surface)' }}
                    >
                      Automatic Peer Note Removal
                    </h4>
                    <p
                      className="text-xs mt-0.5 leading-relaxed"
                      style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                      Whenever a correct number is entered, that number is <strong>automatically eliminated</strong> from the candidate notes of all other cells in the same <strong>row</strong>, <strong>column</strong>, and <strong>3×3 box</strong>.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4
                      className="text-xs font-bold"
                      style={{ color: 'var(--md-sys-color-on-surface)' }}
                    >
                      Full Board Auto-Candidate Notes
                    </h4>
                    <p
                      className="text-xs mt-0.5 leading-relaxed"
                      style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                      Prefer not to fill candidate notes manually? Open <strong>Settings</strong> anytime and toggle <strong>Auto-Notes</strong> to calculate and display all valid candidate possibilities across the entire puzzle instantly.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl border text-xs"
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  borderColor: 'rgba(59, 130, 246, 0.25)',
                  color: 'var(--md-sys-color-on-surface)',
                }}
              >
                ⚡ <strong>Undo Protection:</strong> Made an accidental move? The <strong>Undo</strong> button restores both your previous cell value and all peer candidate notes that were cleared.
              </div>
            </div>
          )}

          {/* STEP 4: QUICK LONG-PRESS & LOGIC TUTOR */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: 'var(--md-sys-color-on-surface)' }}
                  >
                    4. Quick Hold & Deductive Tutor
                  </h3>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                  >
                    Advanced speed controls and logical deduction hints.
                  </p>
                </div>
              </div>

              <div
                className="p-4 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: 'var(--md-sys-color-surface-container)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/15 text-purple-500 shrink-0">
                    <Timer className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className="text-xs font-bold"
                      style={{ color: 'var(--md-sys-color-on-surface)' }}
                    >
                      2-Second Hold: Quick Notes Pad
                    </h4>
                    <p
                      className="text-xs mt-0.5 leading-relaxed"
                      style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                      Long-press any empty cell for <strong>2 seconds</strong> to open a floating 3x3 notes pad directly beneath your finger, allowing rapid multi-candidate drafting without changing modes.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-500 shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className="text-xs font-bold"
                      style={{ color: 'var(--md-sys-color-on-surface)' }}
                    >
                      Ask Logic (Deductive Tutor)
                    </h4>
                    <p
                      className="text-xs mt-0.5 leading-relaxed"
                      style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                      Stuck? Tap <strong>"Ask Logic"</strong> on the toolbar. The engine analyzes candidates to teach you the next deduction technique (Naked Singles, Hidden Singles, Pointing Lines) rather than just giving away the solution.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl border flex items-center justify-between text-xs"
                style={{
                  backgroundColor: 'var(--md-sys-color-surface-container-high)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                  color: 'var(--md-sys-color-on-surface)',
                }}
              >
                <span>💡 You can re-open this guide anytime by tapping the <strong>? (Help)</strong> icon in the game header.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div
          className="p-4 sm:p-5 border-t flex items-center justify-between gap-3"
          style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
        >
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-1.5 transition-all hover:opacity-85"
              style={{
                backgroundColor: 'var(--md-sys-color-surface-container)',
                color: 'var(--md-sys-color-on-surface)',
                borderColor: 'var(--md-sys-color-outline-variant)',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold hover:opacity-75"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Skip
            </button>
          )}

          <div className="flex items-center gap-2">
            {currentStep < totalSteps - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                style={{
                  backgroundColor: activePrimary,
                  color: activeOnPrimary,
                }}
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Got It! Let's Play</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
