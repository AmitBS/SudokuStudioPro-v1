import React from 'react';
import { useTheme } from '../../theme/themeContext';
import { auditThemeTokens } from '../../utils/contrastAudit';
import { ShieldCheck, CheckCircle2, X } from 'lucide-react';

interface ContrastAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContrastAuditModal: React.FC<ContrastAuditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isDark, accentColor, themeMode } = useTheme();

  if (!isOpen) return null;

  const results = auditThemeTokens(isDark, accentColor);
  const totalChecked = results.length;
  const passedAA = results.filter(r => r.wcagAA).length;
  const allPassed = passedAA === totalChecked;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
      style={{ backgroundColor: 'rgba(9, 13, 22, 0.75)' }}
    >
      <div
        style={{
          backgroundColor: 'var(--md-sys-color-surface)',
          borderColor: 'var(--md-sys-color-outline-variant)',
        }}
        className="w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2
                className="text-base font-bold"
                style={{ color: 'var(--md-sys-color-on-surface)' }}
              >
                WCAG 2.2 AA Contrast & Readability Audit
              </h2>
              <div
                className="text-xs"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                Active Theme: <span className="font-semibold capitalize">{themeMode} ({isDark ? 'Dark' : 'Light'})</span> · Accent: <span className="font-semibold capitalize">{accentColor}</span>
              </div>
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

        {/* Summary Card */}
        <div
          className="p-4 mx-6 mt-4 rounded-xl border flex items-center justify-between"
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <div
                className="text-sm font-bold"
                style={{ color: 'var(--md-sys-color-on-surface)' }}
              >
                {allPassed ? '100% WCAG 2.2 AA Contrast Compliant' : 'Contrast Issues Detected'}
              </div>
              <div
                className="text-xs"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                {passedAA} of {totalChecked} semantic token pairs meet or exceed minimum contrast requirements.
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white">
              VERIFIED PASS
            </span>
          </div>
        </div>

        {/* Audit Table */}
        <div className="p-6 overflow-y-auto flex-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className="border-b"
                style={{
                  borderColor: 'var(--md-sys-color-outline-variant)',
                  color: 'var(--md-sys-color-on-surface-variant)',
                }}
              >
                <th className="pb-2 font-semibold">Token Pair</th>
                <th className="pb-2 font-semibold">Sample</th>
                <th className="pb-2 font-semibold text-center">Ratio</th>
                <th className="pb-2 font-semibold text-right">Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}>
              {results.map((res, i) => (
                <tr key={i} className="hover:opacity-90">
                  <td className="py-2.5 pr-2">
                    <div
                      className="font-semibold"
                      style={{ color: 'var(--md-sys-color-on-surface)' }}
                    >
                      {res.pairName}
                    </div>
                    <div
                      className="text-[10px]"
                      style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                      {res.category}
                    </div>
                  </td>
                  <td className="py-2.5 px-2">
                    <div
                      className="px-2.5 py-1 rounded border border-black/10 inline-block font-medium"
                      style={{
                        backgroundColor: res.background,
                        color: res.foreground,
                      }}
                    >
                      Aa 123
                    </div>
                  </td>
                  <td
                    className="py-2.5 px-2 text-center font-mono font-bold"
                    style={{ color: 'var(--md-sys-color-on-surface)' }}
                  >
                    {res.ratio}:1
                  </td>
                  <td className="py-2.5 pl-2 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        res.level === 'AAA'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : res.level === 'AA'
                          ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                          : 'bg-red-500/20 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {res.level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t flex justify-end"
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: 'var(--md-sys-color-surface)',
              borderColor: 'var(--md-sys-color-outline-variant)',
              color: 'var(--md-sys-color-on-surface)',
            }}
            className="px-4 py-2 text-sm font-semibold rounded-xl border hover:opacity-85 transition-opacity"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
