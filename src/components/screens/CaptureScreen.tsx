import React, { useState, useRef, useEffect } from 'react';
import { Difficulty, Screen } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { countSolutions, cloneGrid, isValid } from '../../utils/sudokuEngine';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Play,
  Camera,
  Upload,
  Trash2,
  Sparkles,
  RefreshCw,
  Eye,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface CaptureScreenProps {
  onStartCustomGame: (puzzle: number[][], difficulty: Difficulty) => void;
  onNavigate: (screen: Screen) => void;
}

const SAMPLE_PRESETS: { name: string; difficulty: Difficulty; grid: number[][] }[] = [
  {
    name: 'Morning Newspaper (Medium)',
    difficulty: 'medium',
    grid: [
      [0, 2, 0, 6, 0, 8, 0, 0, 0],
      [5, 8, 0, 0, 0, 9, 7, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0, 0],
      [3, 7, 0, 0, 0, 0, 5, 0, 0],
      [6, 0, 0, 0, 0, 0, 0, 0, 4],
      [0, 0, 8, 0, 0, 0, 0, 1, 3],
      [0, 0, 0, 0, 2, 0, 0, 0, 0],
      [0, 0, 9, 8, 0, 0, 0, 3, 6],
      [0, 0, 0, 3, 0, 6, 0, 9, 0],
    ],
  },
  {
    name: 'Coffee Shop Sudoku Book (Hard)',
    difficulty: 'hard',
    grid: [
      [0, 0, 0, 0, 0, 0, 2, 0, 0],
      [0, 8, 0, 0, 0, 7, 0, 9, 0],
      [6, 0, 2, 0, 0, 0, 5, 0, 0],
      [0, 7, 0, 0, 6, 0, 0, 0, 0],
      [0, 0, 0, 9, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 2, 0, 0, 4, 0],
      [0, 0, 5, 0, 0, 0, 6, 0, 3],
      [0, 9, 0, 4, 0, 0, 0, 7, 0],
      [0, 0, 6, 0, 0, 0, 0, 0, 0],
    ],
  },
  {
    name: 'Classic Tournament (Expert)',
    difficulty: 'expert',
    grid: [
      [8, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 3, 6, 0, 0, 0, 0, 0],
      [0, 7, 0, 0, 9, 0, 2, 0, 0],
      [0, 5, 0, 0, 0, 7, 0, 0, 0],
      [0, 0, 0, 0, 4, 5, 7, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 3, 0],
      [0, 0, 1, 0, 0, 0, 0, 6, 8],
      [0, 0, 8, 5, 0, 0, 0, 1, 0],
      [0, 9, 0, 0, 0, 0, 4, 0, 0],
    ],
  },
];

export const CaptureScreen: React.FC<CaptureScreenProps> = ({
  onStartCustomGame,
  onNavigate,
}) => {
  const { isDark } = useTheme();

  const [grid, setGrid] = useState<number[][]>(() => cloneGrid(SAMPLE_PRESETS[0].grid));
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>({ row: 0, col: 0 });
  const [selectedPreset, setSelectedPreset] = useState<number | null>(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [isScanError, setIsScanError] = useState(false);
  const [justScanned, setJustScanned] = useState(false);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Helper to optimize image size before sending to backend
  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 1200;
          let width = img.width;
          let height = img.height;

          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.88));
        };
        img.onerror = () => resolve(reader.result as string);
        img.src = reader.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Keyboard navigation & digit entry
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (!selectedCell) return;

      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key, 10));
      } else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') {
        handleNumberInput(0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCell(prev => (prev ? { row: Math.max(0, prev.row - 1), col: prev.col } : { row: 0, col: 0 }));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCell(prev => (prev ? { row: Math.min(8, prev.row + 1), col: prev.col } : { row: 0, col: 0 }));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedCell(prev => (prev ? { row: prev.row, col: Math.max(0, prev.col - 1) } : { row: 0, col: 0 }));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedCell(prev => (prev ? { row: prev.row, col: Math.min(8, prev.col + 1) } : { row: 0, col: 0 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, grid]);

  // Find any conflicting cells (duplicate in same row, column, or 3x3 block)
  const conflictingCellKeys = new Set<string>();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = grid[r][c];
      if (val !== 0) {
        if (!isValid(grid, r, c, val)) {
          conflictingCellKeys.add(`${r}-${c}`);
        }
      }
    }
  }

  // Count clues and verify uniqueness
  const clueCount = grid.flat().filter(v => v > 0).length;
  const testGrid = cloneGrid(grid);
  const solCount = clueCount > 0 ? countSolutions(testGrid, { value: 0 }) : 0;
  const isUnique = clueCount >= 17 && conflictingCellKeys.size === 0 && solCount === 1;
  const isSolvable = conflictingCellKeys.size === 0 && solCount >= 1;

  const handleCellClick = (r: number, c: number) => {
    setSelectedCell({ row: r, col: c });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const next = cloneGrid(grid);
    next[row][col] = next[row][col] === num ? 0 : num;
    setGrid(next);
  };

  const handleClearBoard = () => {
    setGrid(Array.from({ length: 9 }, () => Array(9).fill(0)));
    setSelectedPreset(null);
    setSelectedCell({ row: 0, col: 0 });
    setScanMessage(null);
    setIsScanError(false);
  };

  const handleSelectPreset = (idx: number) => {
    setSelectedPreset(idx);
    setGrid(cloneGrid(SAMPLE_PRESETS[idx].grid));
    setDifficulty(SAMPLE_PRESETS[idx].difficulty);
    setUploadedImage(null);
    setScanMessage(null);
    setIsScanError(false);
    setSelectedCell({ row: 0, col: 0 });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanMessage('Optimizing image for fast AI analysis…');
    setIsScanning(true);
    setIsScanError(false);

    try {
      const optimizedDataUrl = await optimizeImage(file);
      setUploadedImage(optimizedDataUrl);
      setSelectedPreset(null);
      performScan(optimizedDataUrl);
    } catch {
      setIsScanning(false);
      setScanMessage('Failed to load image. Please try another file.');
      setIsScanError(true);
    }

    e.target.value = '';
  };

  // Robust multi-attempt scan runner
  const performScan = async (imageDataUrl: string) => {
    setIsScanning(true);
    setIsScanError(false);
    setScanMessage('Scanning Sudoku image with AI vision…');

    const maxClientAttempts = 2;
    let attempt = 1;
    let succeeded = false;

    while (attempt <= maxClientAttempts && !succeeded) {
      try {
        if (attempt > 1) {
          setScanMessage(`Retrying AI vision scan (attempt ${attempt} of ${maxClientAttempts})…`);
        }

        const res = await fetch('/api/scan-sudoku', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageDataUrl }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success || !data.grid) {
          const errMsg = data.error || 'Unable to scan grid';
          throw new Error(errMsg);
        }

        const extractedGrid: number[][] = data.grid;
        setGrid(extractedGrid);
        setSelectedPreset(null);
        setModelUsed(data.modelUsed || null);

        const detectedClues = extractedGrid.flat().filter(v => v > 0).length;
        setScanMessage(
          `✓ Success! Extracted ${detectedClues} numbers from your photo into the 9×9 table below. Check against your photo and tap any cell to adjust.`
        );
        setIsScanError(false);
        setJustScanned(true);
        setTimeout(() => setJustScanned(false), 2500);
        succeeded = true;
        break;
      } catch (err: any) {
        console.warn(`Scan attempt ${attempt} failed:`, err);
        if (attempt < maxClientAttempts) {
          setScanMessage('AI vision model temporarily busy; retrying with backup model in 1 second…');
          await new Promise(r => setTimeout(r, 1200));
          attempt++;
        } else {
          setIsScanError(true);
          // Clean up error message to ensure no raw JSON is exposed to the user
          let friendly = 'Could not read all numbers automatically. Please tap "Retry AI Scan" or tap cells in the 9×9 table below to enter numbers manually.';
          const raw = typeof err?.message === 'string' ? err.message : '';
          if (raw.includes('503') || raw.includes('high demand') || raw.includes('UNAVAILABLE') || raw.includes('capacity') || raw.includes('busy')) {
            friendly = 'The AI vision service is currently handling high demand. Tap "Retry AI Scan" below, or tap any cell in the table to input numbers directly.';
          } else if (raw.includes('boundary') || raw.includes('recognize') || raw.includes('clear')) {
            friendly = 'Could not clearly detect the Sudoku boundaries. Please ensure the puzzle is centered and clearly lit, or tap cells to enter numbers.';
          }
          setScanMessage(friendly);
          break;
        }
      }
    }

    setIsScanning(false);
  };

  const handleStartGame = () => {
    if (!isSolvable) return;
    onStartCustomGame(grid, difficulty);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div
        className="flex items-center gap-3 pb-3 border-b"
        style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
      >
        <button
          type="button"
          onClick={() => onNavigate('home')}
          aria-label="Back"
          style={{ color: 'var(--md-sys-color-on-background)' }}
          className="p-2 -ml-2 rounded-xl hover:opacity-75 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: 'var(--md-sys-color-on-background)' }}
          >
            Capture & Verify Sudoku
          </h1>
          <p
            className="text-xs sm:text-sm font-medium mt-0.5"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Upload a photo, capture via camera, or use presets to digitize and solve.
          </p>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* PHOTO CAPTURE & UPLOAD SECTION */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: 'var(--md-sys-color-surface)',
          borderColor: 'var(--md-sys-color-outline-variant)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-500 flex items-center gap-1.5">
            <Camera className="w-4 h-4" />
            <span>Import Paper or Digital Sudoku</span>
          </div>
          {uploadedImage && (
            <button
              type="button"
              onClick={() => {
                setUploadedImage(null);
                setScanMessage(null);
                setIsScanError(false);
              }}
              className="text-xs text-rose-500 flex items-center gap-1 hover:underline font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Photo</span>
            </button>
          )}
        </div>

        {/* Upload Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="p-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2.5 transition-all hover:opacity-90 active:scale-98"
            style={{
              borderColor: 'var(--md-sys-color-primary)',
              backgroundColor: isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(37, 99, 235, 0.06)',
              color: 'var(--md-sys-color-on-surface)',
            }}
          >
            <Camera className="w-5 h-5 text-sky-500 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold">Take Camera Photo</div>
              <div className="text-[11px]" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                Point at newspaper or book
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2.5 transition-all hover:opacity-90 active:scale-98"
            style={{
              borderColor: 'var(--md-sys-color-outline-variant)',
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              color: 'var(--md-sys-color-on-surface)',
            }}
          >
            <Upload className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold">Upload Image / Screenshot</div>
              <div className="text-[11px]" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                JPG, PNG, WebP supported
              </div>
            </div>
          </button>
        </div>

        {/* Photo Reference Preview */}
        {uploadedImage && (
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                <span>Uploaded Puzzle Reference</span>
                {modelUsed && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-500 font-mono font-medium">
                    {modelUsed}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="text-xs font-medium text-sky-500 flex items-center gap-1 hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Enlarge</span>
                </button>
                <button
                  type="button"
                  disabled={isScanning}
                  onClick={() => uploadedImage && performScan(uploadedImage)}
                  className="text-xs font-bold text-sky-500 flex items-center gap-1 hover:underline disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>Rescan</span>
                </button>
              </div>
            </div>
            <div
              onClick={() => setShowPhotoModal(true)}
              className="max-h-48 overflow-hidden rounded-xl border flex items-center justify-center bg-black/30 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <img
                src={uploadedImage}
                alt="Uploaded Sudoku Puzzle"
                className="max-h-48 object-contain w-auto"
              />
            </div>
          </div>
        )}

        {/* Scan Message & Status */}
        {scanMessage && (
          <div
            className="p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in"
            style={{
              backgroundColor: isScanError
                ? 'rgba(245, 158, 11, 0.12)'
                : isScanning
                ? 'rgba(56, 189, 248, 0.12)'
                : 'rgba(16, 185, 129, 0.12)',
              borderColor: isScanError
                ? 'rgba(245, 158, 11, 0.4)'
                : isScanning
                ? 'rgba(56, 189, 248, 0.3)'
                : 'rgba(16, 185, 129, 0.35)',
              color: 'var(--md-sys-color-on-surface)',
            }}
          >
            <div className="flex items-center gap-2.5">
              {isScanError ? (
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              ) : isScanning ? (
                <RefreshCw className="w-4 h-4 text-sky-500 animate-spin shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
              <span className="leading-relaxed">{scanMessage}</span>
            </div>

            {uploadedImage && !isScanning && (
              <button
                type="button"
                onClick={() => performScan(uploadedImage)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 self-start sm:self-auto flex items-center gap-1.5 shadow-xs transition-opacity hover:opacity-85"
                style={{
                  backgroundColor: 'var(--md-sys-color-primary)',
                  color: 'var(--md-sys-color-on-primary)',
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry AI Scan</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Presets Selector */}
      <div className="space-y-2">
        <div
          className="text-xs font-bold uppercase tracking-wider flex items-center justify-between"
          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
        >
          <span>Or Load Sample Puzzle Presets</span>
          {selectedPreset !== null && (
            <span className="text-[11px] font-normal text-sky-500">Preset Active</span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleSelectPreset(idx)}
              style={{
                backgroundColor:
                  selectedPreset === idx
                    ? 'var(--md-sys-color-surface-container-high)'
                    : 'var(--md-sys-color-surface)',
                borderColor:
                  selectedPreset === idx
                    ? 'var(--md-sys-color-primary)'
                    : 'var(--md-sys-color-outline-variant)',
              }}
              className="p-3 rounded-xl border text-left transition-all shadow-xs"
            >
              <div
                className="text-xs font-bold truncate"
                style={{ color: 'var(--md-sys-color-on-surface)' }}
              >
                {preset.name}
              </div>
              <div
                className="text-[11px] mt-0.5 capitalize"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                {preset.difficulty} Level
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 9x9 Verification Table */}
      <div
        style={{
          backgroundColor: 'var(--md-sys-color-surface)',
          borderColor: 'var(--md-sys-color-outline-variant)',
        }}
        className="p-4 sm:p-6 rounded-2xl border shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-bold"
                style={{ color: 'var(--md-sys-color-on-surface)' }}
              >
                Extracted 9×9 Matrix
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  clueCount > 0 ? 'bg-sky-500/15 text-sky-500' : 'bg-zinc-500/15 text-zinc-500'
                }`}
              >
                {clueCount} numbers
              </span>
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Tap any cell then press 1-9 (or use keyboard arrows & digits)
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearBoard}
            className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Matrix</span>
          </button>
        </div>

        {/* 9x9 Grid Display */}
        <div
          style={{
            borderColor: 'var(--md-sys-color-grid-border-major)',
            backgroundColor: 'var(--md-sys-color-surface)',
          }}
          className={`w-full max-w-[360px] mx-auto aspect-square grid grid-cols-9 grid-rows-9 border-2 rounded-lg overflow-hidden shadow-xs transition-all ${
            justScanned ? 'ring-4 ring-sky-400 ring-offset-2' : ''
          }`}
        >
          {grid.map((row, r) =>
            row.map((val, c) => {
              const isSelected = selectedCell?.row === r && selectedCell?.col === c;
              const hasConflict = conflictingCellKeys.has(`${r}-${c}`);
              const isBlockR = (c + 1) % 3 === 0 && c < 8;
              const isBlockB = (r + 1) % 3 === 0 && r < 8;

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => handleCellClick(r, c)}
                  style={{
                    backgroundColor: isSelected
                      ? 'var(--md-sys-color-cell-selected-bg)'
                      : hasConflict
                      ? 'rgba(239, 68, 68, 0.18)'
                      : val !== 0
                      ? 'var(--md-sys-color-surface-container-low)'
                      : 'var(--md-sys-color-surface)',
                    color: hasConflict
                      ? '#ef4444'
                      : val !== 0
                      ? 'var(--md-sys-color-on-surface)'
                      : 'transparent',
                    borderRightWidth: c < 8 ? (isBlockR ? '2px' : '1px') : '0',
                    borderRightColor: isBlockR
                      ? 'var(--md-sys-color-grid-border-major)'
                      : 'var(--md-sys-color-grid-border-minor)',
                    borderBottomWidth: r < 8 ? (isBlockB ? '2px' : '1px') : '0',
                    borderBottomColor: isBlockB
                      ? 'var(--md-sys-color-grid-border-major)'
                      : 'var(--md-sys-color-grid-border-minor)',
                  }}
                  className={`flex items-center justify-center font-mono font-extrabold text-base sm:text-lg transition-colors relative select-none ${
                    isSelected
                      ? 'ring-2 ring-inset ring-amber-500 z-10'
                      : hasConflict
                      ? 'ring-1 ring-inset ring-rose-500 z-5'
                      : ''
                  }`}
                >
                  {val !== 0 ? val : ''}
                </button>
              );
            })
          )}
        </div>

        {/* Number buttons for editing cells */}
        <div className="space-y-2">
          <div className="grid grid-cols-10 gap-1.5 max-w-[420px] mx-auto">
            <button
              type="button"
              onClick={() => handleNumberInput(0)}
              style={{
                borderColor: 'var(--md-sys-color-outline-variant)',
                backgroundColor: 'var(--md-sys-color-surface)',
              }}
              className="py-2.5 rounded-lg border text-xs font-bold text-rose-500 hover:opacity-85 active:scale-95"
            >
              Clear
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumberInput(num)}
                style={{
                  borderColor: 'var(--md-sys-color-outline-variant)',
                  backgroundColor: 'var(--md-sys-color-surface)',
                  color: 'var(--md-sys-color-on-surface)',
                }}
                className="py-2.5 rounded-lg border text-base font-bold font-mono hover:opacity-85 active:scale-95 shadow-xs"
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Level Selection */}
        <div className="pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2" style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}>
          <span className="text-xs font-bold" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            Play Difficulty Tag:
          </span>
          <div className="flex items-center gap-1.5">
            {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                style={{
                  backgroundColor:
                    difficulty === d
                      ? 'var(--md-sys-color-primary)'
                      : 'var(--md-sys-color-surface)',
                  color:
                    difficulty === d
                      ? 'var(--md-sys-color-on-primary)'
                      : 'var(--md-sys-color-on-surface)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                }}
                className="px-2.5 py-1 text-xs rounded-lg border capitalize font-semibold transition-colors"
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Validation Status Indicator */}
        <div
          style={{
            backgroundColor: isUnique
              ? 'rgba(16, 185, 129, 0.15)'
              : conflictingCellKeys.size > 0
              ? 'rgba(239, 68, 68, 0.15)'
              : clueCount === 0
              ? 'rgba(100, 116, 139, 0.15)'
              : 'rgba(245, 158, 11, 0.15)',
            borderColor: isUnique
              ? 'rgba(16, 185, 129, 0.4)'
              : conflictingCellKeys.size > 0
              ? 'rgba(239, 68, 68, 0.4)'
              : clueCount === 0
              ? 'rgba(100, 116, 139, 0.3)'
              : 'rgba(245, 158, 11, 0.4)',
            color: 'var(--md-sys-color-on-surface)',
          }}
          className="p-3.5 rounded-xl border flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            {isUnique ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : conflictingCellKeys.size > 0 ? (
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            )}
            <div className="text-xs font-medium leading-relaxed">
              {isUnique
                ? 'Valid puzzle verified: Exactly 1 unique solution found.'
                : conflictingCellKeys.size > 0
                ? `${conflictingCellKeys.size} duplicate conflict(s) detected in red. Tap cell to adjust.`
                : clueCount === 0
                ? 'Matrix is empty. Upload a photo or select a sample preset above.'
                : solCount === 0
                ? 'No valid solution found. Check digits against your original photo.'
                : `Solvable (${solCount > 1 ? 'Multiple solutions' : '1 solution'}). Enter more clues for strict uniqueness.`}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          disabled={!isSolvable || clueCount < 10}
          onClick={handleStartGame}
          className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-transform ${
            isSolvable && clueCount >= 10
              ? 'active:scale-98 cursor-pointer'
              : 'opacity-40 cursor-not-allowed'
          }`}
          style={{
            backgroundColor: 'var(--md-sys-color-primary)',
            color: 'var(--md-sys-color-on-primary)',
          }}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Solving Digitized Puzzle</span>
        </button>
      </div>

      {/* Photo Enlarge Modal */}
      {showPhotoModal && uploadedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowPhotoModal(false)}
        >
          <div
            className="max-w-xl max-h-[85vh] overflow-hidden rounded-2xl border bg-black p-2 flex flex-col items-center justify-center relative"
            style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90"
            >
              ✕
            </button>
            <img
              src={uploadedImage}
              alt="Enlarged Sudoku Reference"
              className="max-h-[80vh] w-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
