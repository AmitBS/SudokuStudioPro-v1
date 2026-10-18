import React from 'react';
import { LogicStep, SudokuInputMode } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { SudokuSymbol, SudokuColorCircle, getSymbolName, getSudokuColorName, SudokuFruit, getFruitName } from '../../utils/sudokuSymbols';
import { Compass, CheckCircle2, AlertCircle, X, ArrowRight } from 'lucide-react';

interface LogicModalProps {
  step: LogicStep | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyStep: () => void;
  inputMode?: SudokuInputMode;
  customColors?: Record<number, string>;
}

export const LogicModal: React.FC<LogicModalProps> = ({
  step,
  isOpen,
  onClose,
  onApplyStep,
  inputMode = 'numbers',
  customColors,
}) => {
  const { activePrimary, activeOnPrimary } = useTheme();

  if (!isOpen || !step) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logic-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
      style={{ backgroundColor: 'rgba(9, 13, 22, 0.75)' }}
    >
      <div
        style={{
          backgroundColor: 'var(--md-sys-color-surface)',
          borderColor: 'var(--md-sys-color-outline-variant)',
        }}
        className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                Logical Deduction Tutor
              </div>
              <h3
                id="logic-title"
                className="text-lg font-bold"
                style={{ color: 'var(--md-sys-color-on-surface)' }}
              >
                {step.technique}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            className="p-1.5 rounded-lg hover:opacity-75 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Main Explanation */}
          <div
            className="text-base font-medium leading-relaxed"
            style={{ color: 'var(--md-sys-color-on-surface)' }}
          >
            {step.explanation}
          </div>

          {/* Target Coordinates & Candidates */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span
              style={{
                backgroundColor: 'var(--md-sys-color-surface-container-high)',
                color: 'var(--md-sys-color-on-surface)',
                borderColor: 'var(--md-sys-color-outline-variant)',
              }}
              className="px-2.5 py-1 rounded-md border font-semibold"
            >
              Target: Row {step.targetCell.row + 1}, Col {step.targetCell.col + 1}
            </span>
            {step.targetValue && (
              <span
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: '#b45309',
                  borderColor: 'rgba(245, 158, 11, 0.4)',
                }}
                className="px-2.5 py-1 rounded-md font-bold border inline-flex items-center gap-1.5"
              >
                <span>Value:</span>
                {inputMode === 'fruits' ? (
                  <span className="inline-flex items-center gap-1.5">
                    <SudokuFruit value={step.targetValue} size="sm" />
                    <span className="text-[11px] font-normal">({getFruitName(step.targetValue)})</span>
                  </span>
                ) : inputMode === 'colors' ? (
                  <span className="inline-flex items-center gap-1.5">
                    <SudokuColorCircle value={step.targetValue} customColors={customColors} size="sm" />
                    <span className="text-[11px] font-normal">({getSudokuColorName(step.targetValue)})</span>
                  </span>
                ) : inputMode === 'symbols' ? (
                  <span className="inline-flex items-center gap-1">
                    <SudokuSymbol value={step.targetValue} className="w-4 h-4" />
                    <span className="text-[11px] font-normal">({getSymbolName(step.targetValue)})</span>
                  </span>
                ) : (
                  <span>{step.targetValue}</span>
                )}
              </span>
            )}
            {step.involvedCandidates && step.involvedCandidates.length > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--md-sys-color-surface-container-high)',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                }}
                className="px-2.5 py-1 rounded-md border inline-flex items-center gap-1.5"
              >
                <span>Candidates:</span>
                {inputMode === 'fruits' ? (
                  <span className="inline-flex items-center gap-1.5">
                    {step.involvedCandidates.map(c => (
                      <SudokuFruit key={c} value={c} size="xs" title={`Value ${c}, ${getFruitName(c)}`} />
                    ))}
                  </span>
                ) : inputMode === 'colors' ? (
                  <span className="inline-flex items-center gap-1.5">
                    {step.involvedCandidates.map(c => (
                      <SudokuColorCircle key={c} value={c} customColors={customColors} size="xs" title={`Value ${c}, ${getSudokuColorName(c)}`} />
                    ))}
                  </span>
                ) : inputMode === 'symbols' ? (
                  <span className="inline-flex items-center gap-1">
                    {step.involvedCandidates.map(c => (
                      <SudokuSymbol key={c} value={c} className="w-3.5 h-3.5" title={getSymbolName(c)} />
                    ))}
                  </span>
                ) : (
                  <span>[{step.involvedCandidates.join(', ')}]</span>
                )}
              </span>
            )}
          </div>

          {/* Why it works section */}
          <div
            style={{
              backgroundColor: 'var(--md-sys-color-surface-container-low)',
              borderColor: 'var(--md-sys-color-outline-variant)',
            }}
            className="p-4 rounded-xl border"
          >
            <div
              className="flex items-center gap-2 mb-1.5 text-xs font-bold uppercase tracking-wide"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Why this deduction works
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              {step.whyItWorks}
            </p>
          </div>

          {/* What to do section */}
          <div
            style={{
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              borderColor: 'var(--md-sys-color-primary)',
            }}
            className="p-4 rounded-xl border"
          >
            <div
              className="flex items-center gap-2 mb-1.5 text-xs font-bold uppercase tracking-wide"
              style={{ color: 'var(--md-sys-color-primary)' }}
            >
              <AlertCircle className="w-4 h-4" />
              What to do
            </div>
            <p
              className="text-sm font-semibold"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              {step.whatToDo}
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div
          className="px-6 py-4 border-t flex items-center justify-end gap-3"
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-low)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            className="px-4 py-2 text-sm font-semibold rounded-xl hover:opacity-85 transition-opacity"
          >
            Inspect Board
          </button>
          <button
            type="button"
            onClick={() => {
              onApplyStep();
              onClose();
            }}
            className="px-4 py-2 text-sm font-semibold rounded-xl shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
            style={{
              backgroundColor: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-on-primary)',
            }}
          >
            <span>Apply Move</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
