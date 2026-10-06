import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/themeContext';
import {
  Download,
  Smartphone,
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
  AlertTriangle,
  Info,
  Check,
  PackageCheck,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: BeforeInstallPromptEvent | null;
  onInstalled?: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalled,
}) => {
  const { activePrimary, activeOnPrimary } = useTheme();
  const [copiedDev, setCopiedDev] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallSuccess(true);
        if (onInstalled) onInstalled();
      }
    } catch (err) {
      console.warn('Install prompt error:', err);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
    >
      <div
        className="w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border my-auto space-y-6 relative transition-all"
        style={{
          backgroundColor: 'var(--md-sys-color-surface)',
          borderColor: 'var(--md-sys-color-outline-variant)',
          color: 'var(--md-sys-color-on-surface)',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-xl hover:opacity-75 transition-opacity"
          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pr-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
            style={{
              backgroundColor: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-on-primary)',
            }}
          >
            <Smartphone className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h2 id="install-modal-title" className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Download / Install Android App
            </h2>
            <p
              className="text-xs sm:text-sm font-medium mt-0.5"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Get Sudoku Studio Pro directly on your Android phone as a native WebAPK.
            </p>
          </div>
        </div>

        {/* SECTION 1: INSTANT 1-CLICK WEBAPK INSTALL IF PROMPT READY */}
        {deferredPrompt ? (
          <div
            className="p-4 rounded-2xl border space-y-3"
            style={{
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              borderColor: 'var(--md-sys-color-primary)',
            }}
          >
            <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--md-sys-color-primary)' }}>
              <PackageCheck className="w-5 h-5" />
              <span>Direct Android WebAPK Installation Ready</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--md-sys-color-on-surface)' }}>
              Your browser supports direct installation. Tap below to automatically compile and install the native Android WebAPK with offline support.
            </p>
            <button
              type="button"
              disabled={isInstalling || installSuccess}
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
              style={{
                backgroundColor: 'var(--md-sys-color-primary)',
                color: 'var(--md-sys-color-on-primary)',
              }}
            >
              {installSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Installed to Android Home Screen!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isInstalling ? 'Installing…' : 'Install Native Android WebAPK Now'}</span>
                </>
              )}
            </button>
          </div>
        ) : null}

        {/* SECTION 2: STEP-BY-STEP ANDROID INSTALL IN CHROME (100% RELIABLE) */}
        <div
          className="p-4 rounded-2xl border space-y-3.5"
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            <span>Recommended: Install via Chrome on Android</span>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--md-sys-color-on-surface)' }}>
            Google Chrome on Android automatically packages this app into an official <strong>WebAPK</strong> that installs like any Google Play app without needing third-party converters.
          </p>

          <ol className="space-y-2 text-xs" style={{ color: 'var(--md-sys-color-on-surface)' }}>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
              <span>Open this app in <strong>Google Chrome</strong> on your Android phone.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
              <span>Tap the <strong>three dots (⋮)</strong> menu at the top-right corner of Chrome.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
              <span>Select <strong>"Install app"</strong> (or <strong>"Add to Home screen"</strong>).</span>
            </li>
          </ol>

          {/* Copy URL Box */}
          <div className="pt-1">
            <div className="text-[11px] font-semibold mb-1" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              App URL to open on your phone:
            </div>
            <div
              className="flex items-center gap-2 p-2 rounded-xl border text-xs font-mono break-all"
              style={{
                backgroundColor: 'var(--md-sys-color-surface)',
                borderColor: 'var(--md-sys-color-outline-variant)',
              }}
            >
              <span className="truncate flex-1">{currentUrl}</span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: 'var(--md-sys-color-primary)',
                  color: 'var(--md-sys-color-on-primary)',
                }}
              >
                {copiedDev ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDev ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: EXPLANATION OF WHY THE EXTERNAL ERROR HAPPENED */}
        <div
          className="p-4 rounded-2xl border space-y-2 text-xs"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            borderColor: 'rgba(239, 68, 68, 0.25)',
          }}
        >
          <div className="font-bold flex items-center gap-1.5 text-rose-500">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Why external APK builders showed "404 / Failed"</span>
          </div>
          <p className="leading-relaxed" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            1. <strong>Cloud Run 404</strong>: The Shared App URL is only accessible to outside tools once you click the <strong>"Share"</strong> button in the AI Studio editor header.
          </p>
          <p className="leading-relaxed" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            2. <strong>Google Auth Guard</strong>: The Development URL requires Google account authentication, so external bots like PWABuilder get redirected and cannot download the manifest.
          </p>
          <p className="leading-relaxed font-semibold text-emerald-500">
            ✓ Installing directly through Chrome on Android (Method 2 above) bypasses all of this and installs immediately!
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-80"
            style={{
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              color: 'var(--md-sys-color-on-surface)',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
