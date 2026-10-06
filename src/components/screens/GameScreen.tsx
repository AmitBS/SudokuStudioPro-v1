import React, { useState, useEffect, useCallback } from 'react';
import { ActiveGame, CellData, CompletedHighlightCell, Difficulty, GameSettings, LogicStep, Screen } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { SudokuBoard } from '../sudoku/SudokuBoard';
import { SudokuControls } from '../sudoku/SudokuControls';
import { LogicModal } from '../sudoku/LogicModal';
import { PauseModal } from '../sudoku/PauseModal';
import { VictoryModal } from '../sudoku/VictoryModal';
import {
  countPlacedDigits,
  findBoardMistakes,
  findNextLogicStep,
  isBoardSolved,
  isValid,
  calculateCandidates,
  checkUnitCompletion,
  detectNewlyCompletedUnits,
} from '../../utils/sudokuEngine';
import {
  playCellSelectSound,
  playTapSound,
  playNumberEntrySound,
  playNoteEntrySound,
  playEraseSound,
  playErrorSound,
  playHintSound,
  playUnitCompletionSound,
  playCelebrationFanfare,
  playVictoryFanfare,
  triggerHaptic,
} from '../../utils/audio';
import { ArrowLeft, Pause, Play, RotateCcw, AlertTriangle } from 'lucide-react';

interface GameScreenProps {
  game: ActiveGame;
  settings: GameSettings;
  onUpdateGame: (updater: (prev: ActiveGame) => ActiveGame) => void;
  onGameCompleted: (game: ActiveGame) => void;
  onRestartGame: () => void;
  onStartNewGame?: (difficulty: Difficulty) => void;
  onNavigate: (screen: Screen) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  game,
  settings,
  onUpdateGame,
  onGameCompleted,
  onRestartGame,
  onStartNewGame,
  onNavigate,
}) => {
  const { activePrimary, activeOnPrimary, activeAccentText } = useTheme();

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>({ row: 0, col: 0 });
  const [completedHighlightCells, setCompletedHighlightCells] = useState<CompletedHighlightCell[]>([]);
  const [isNotesMode, setIsNotesMode] = useState<boolean>(false);
  const [activeLogicStep, setActiveLogicStep] = useState<LogicStep | null>(null);
  const [isLogicModalOpen, setIsLogicModalOpen] = useState<boolean>(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState<boolean>(false);
  const [showConfirmQuit, setShowConfirmQuit] = useState<boolean>(false);

  // Timer interval
  useEffect(() => {
    if (game.isPaused || game.isCompleted || game.isGameOver) return;
    const interval = setInterval(() => {
      onUpdateGame(prev => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [game.isPaused, game.isCompleted, game.isGameOver, onUpdateGame]);

  // Mistakes calculation
  const mistakes = settings.mistakesMode !== 'off'
    ? findBoardMistakes(game.board, game.solution)
    : [];

  const digitCounts = countPlacedDigits(game.board);

  // Cell Selection
  const handleSelectCell = (row: number, col: number) => {
    setSelectedCell({ row, col });
    playCellSelectSound(settings.soundEnabled);
    triggerHaptic('cell', settings.hapticsEnabled);
  };

  // Find next empty cell for auto advance
  const findNextEmptyCell = (startR: number, startC: number): { row: number; col: number } | null => {
    for (let i = 1; i <= 81; i++) {
      const idx = (startR * 9 + startC + i) % 81;
      const r = Math.floor(idx / 9);
      const c = idx % 9;
      if (game.board[r][c].value === 0) {
        return { row: r, col: c };
      }
    }
    return null;
  };

  // Placing number / note
  const handleNumberInput = useCallback((num: number) => {
    if (!selectedCell || game.isPaused || game.isCompleted || game.isGameOver) return;
    const { row, col } = selectedCell;
    const targetCell = game.board[row][col];
    if (targetCell.given) return;

    if (isNotesMode) {
      // Toggle note
      const prevNotes = [...targetCell.notes];
      const isRemoval = prevNotes.includes(num);
      const newNotes = isRemoval
        ? prevNotes.filter(n => n !== num)
        : [...prevNotes, num].sort((a, b) => a - b);

      onUpdateGame(prev => {
        const newBoard = prev.board.map(r => r.map(c => ({ ...c, notes: [...c.notes] })));
        newBoard[row][col].notes = newNotes;
        return {
          ...prev,
          board: newBoard,
          moveHistory: [
            ...prev.moveHistory,
            {
              row,
              col,
              prevValue: targetCell.value,
              newValue: targetCell.value,
              prevNotes,
              newNotes,
              isNoteMove: true,
            },
          ],
        };
      });
      playNoteEntrySound(settings.soundEnabled, isRemoval);
      triggerHaptic('note', settings.hapticsEnabled);
    } else {
      // Place number
      const isCorrect = game.solution ? game.solution[row][col] === num : true;
      const prevVal = targetCell.value;

      if (!isCorrect && settings.mistakesMode !== 'off') {
        // Record mistake
        const newMistakes = game.mistakes + 1;
        const isGameOver = settings.mistakesMode === 'three' && newMistakes >= 3;

        onUpdateGame(prev => ({
          ...prev,
          mistakes: newMistakes,
          isGameOver,
        }));
        playErrorSound(settings.soundEnabled);
        triggerHaptic('error', settings.hapticsEnabled);
        return;
      }

      // Check unit completions before placement
      const prevUnits = checkUnitCompletion(game.board, game.solution);

      const newBoard = game.board.map(r => r.map(c => ({ ...c, notes: [...c.notes] })));
      newBoard[row][col].value = num;
      newBoard[row][col].notes = [];

      // If autoNotes is on, remove this candidate from peer cells
      if (settings.autoNotes) {
        for (let i = 0; i < 9; i++) {
          newBoard[row][i].notes = newBoard[row][i].notes.filter(n => n !== num);
          newBoard[i][col].notes = newBoard[i][col].notes.filter(n => n !== num);
        }
        const startR = Math.floor(row / 3) * 3;
        const startC = Math.floor(col / 3) * 3;
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            newBoard[startR + r][startC + c].notes =
              newBoard[startR + r][startC + c].notes.filter(n => n !== num);
          }
        }
      }

      const solved = isBoardSolved(newBoard, game.solution);
      const nextUnits = checkUnitCompletion(newBoard, game.solution);
      const newlyCompleted = detectNewlyCompletedUnits(prevUnits, nextUnits);

      const updatedGame: ActiveGame = {
        ...game,
        board: newBoard,
        isCompleted: solved,
        score: game.score + (isCorrect ? 100 : 0),
        moveHistory: [
          ...game.moveHistory,
          {
            row,
            col,
            prevValue: prevVal,
            newValue: num,
            prevNotes: [...targetCell.notes],
            newNotes: [],
            isNoteMove: false,
          },
        ],
      };

      onUpdateGame(() => updatedGame);

      if (solved) {
        playCelebrationFanfare(settings.soundEnabled);
        triggerHaptic('celebration', settings.hapticsEnabled);
        onGameCompleted(updatedGame);
      } else if (newlyCompleted.count > 0) {
        playUnitCompletionSound(newlyCompleted.count, settings.soundEnabled);
        triggerHaptic(newlyCompleted.count > 1 ? 'multiUnit' : 'unit', settings.hapticsEnabled);
        setCompletedHighlightCells(newlyCompleted.highlightCells);
        setTimeout(() => {
          setCompletedHighlightCells([]);
        }, 900);
      } else {
        playNumberEntrySound(settings.soundEnabled);
        triggerHaptic('number', settings.hapticsEnabled);
      }

      // Auto advance
      if (settings.autoAdvance) {
        const nextCell = findNextEmptyCell(row, col);
        if (nextCell) {
          setSelectedCell(nextCell);
        }
      }
    }
  }, [selectedCell, game, isNotesMode, settings, onUpdateGame, onGameCompleted]);

  // Erase
  const handleErase = useCallback(() => {
    if (!selectedCell || game.isPaused || game.isCompleted || game.isGameOver) return;
    const { row, col } = selectedCell;
    const targetCell = game.board[row][col];
    if (targetCell.given) return;
    if (targetCell.value === 0 && targetCell.notes.length === 0) return;

    onUpdateGame(prev => {
      const newBoard = prev.board.map(r => r.map(c => ({ ...c, notes: [...c.notes] })));
      newBoard[row][col].value = 0;
      newBoard[row][col].notes = [];
      return {
        ...prev,
        board: newBoard,
        moveHistory: [
          ...prev.moveHistory,
          {
            row,
            col,
            prevValue: targetCell.value,
            newValue: 0,
            prevNotes: [...targetCell.notes],
            newNotes: [],
            isNoteMove: false,
          },
        ],
      };
    });
    playEraseSound(settings.soundEnabled);
    triggerHaptic('cell', settings.hapticsEnabled);
  }, [selectedCell, game, settings.soundEnabled, settings.hapticsEnabled, onUpdateGame]);

  // Undo
  const handleUndo = useCallback(() => {
    if (game.moveHistory.length === 0 || game.isPaused || game.isCompleted || game.isGameOver) return;
    const lastMove = game.moveHistory[game.moveHistory.length - 1];

    onUpdateGame(prev => {
      const newBoard = prev.board.map(r => r.map(c => ({ ...c, notes: [...c.notes] })));
      newBoard[lastMove.row][lastMove.col].value = lastMove.prevValue;
      newBoard[lastMove.row][lastMove.col].notes = [...lastMove.prevNotes];

      return {
        ...prev,
        board: newBoard,
        moveHistory: prev.moveHistory.slice(0, -1),
      };
    });
    setSelectedCell({ row: lastMove.row, col: lastMove.col });
    playTapSound(settings.soundEnabled);
    triggerHaptic('light', settings.hapticsEnabled);
  }, [game.moveHistory, game.isPaused, game.isCompleted, game.isGameOver, settings.soundEnabled, settings.hapticsEnabled, onUpdateGame]);

  // Quick Hint
  const handleHint = () => {
    if (game.isPaused || game.isCompleted || game.isGameOver) return;
    if (settings.hintsMode === 'logic') {
      handleAskLogic();
      return;
    }

    // Direct Reveal Hint
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const targetCell = game.board[row][col];
    if (targetCell.given || targetCell.value !== 0) {
      // Find first empty cell
      const nextCell = findNextEmptyCell(0, 0);
      if (nextCell) {
        setSelectedCell(nextCell);
        const correctVal = game.solution[nextCell.row][nextCell.col];
        applyCellHint(nextCell.row, nextCell.col, correctVal);
      }
    } else {
      const correctVal = game.solution[row][col];
      applyCellHint(row, col, correctVal);
    }
  };

  const applyCellHint = (row: number, col: number, val: number) => {
    playHintSound(settings.soundEnabled);
    triggerHaptic('medium', settings.hapticsEnabled);

    const newBoard = game.board.map(r => r.map(c => ({ ...c, notes: [...c.notes] })));
    newBoard[row][col].value = val;
    newBoard[row][col].notes = [];

    const solved = isBoardSolved(newBoard, game.solution);
    const updatedGame: ActiveGame = {
      ...game,
      board: newBoard,
      hintsUsed: game.hintsUsed + 1,
      isCompleted: solved,
    };

    onUpdateGame(() => updatedGame);

    if (solved) {
      playVictoryFanfare(settings.soundEnabled);
      onGameCompleted(updatedGame);
    }
  };

  // Ask Logic / Deductive Tutor
  const handleAskLogic = () => {
    const nextStep = findNextLogicStep(game.board, game.solution);
    if (nextStep) {
      setActiveLogicStep(nextStep);
      setIsLogicModalOpen(true);
      setSelectedCell(nextStep.targetCell);
      playHintSound(settings.soundEnabled);
    }
  };

  const handleApplyLogicStep = () => {
    if (!activeLogicStep) return;
    if (activeLogicStep.action === 'place' && activeLogicStep.targetValue) {
      applyCellHint(
        activeLogicStep.targetCell.row,
        activeLogicStep.targetCell.col,
        activeLogicStep.targetValue
      );
    } else if (activeLogicStep.action === 'eliminate' && activeLogicStep.eliminatedCandidates) {
      onUpdateGame(prev => {
        const newBoard = prev.board.map(r => r.map(c => ({ ...c, notes: [...c.notes] })));
        activeLogicStep.eliminatedCandidates?.forEach(elim => {
          newBoard[elim.row][elim.col].notes = newBoard[elim.row][elim.col].notes.filter(
            n => n !== elim.value
          );
        });
        return {
          ...prev,
          board: newBoard,
          logicHintsUsed: prev.logicHintsUsed + 1,
        };
      });
      playTapSound(settings.soundEnabled);
    }
    setActiveLogicStep(null);
  };

  // Keyboard navigation & inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPauseModalOpen || isLogicModalOpen || showConfirmQuit) return;

      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
      } else if (e.key === 'ArrowUp' && selectedCell) {
        setSelectedCell(prev => prev && { row: Math.max(0, prev.row - 1), col: prev.col });
      } else if (e.key === 'ArrowDown' && selectedCell) {
        setSelectedCell(prev => prev && { row: Math.min(8, prev.row + 1), col: prev.col });
      } else if (e.key === 'ArrowLeft' && selectedCell) {
        setSelectedCell(prev => prev && { row: prev.row, col: Math.max(0, prev.col - 1) });
      } else if (e.key === 'ArrowRight' && selectedCell) {
        setSelectedCell(prev => prev && { row: prev.row, col: Math.min(8, prev.col + 1) });
      } else if (e.key.toLowerCase() === 'n') {
        setIsNotesMode(prev => !prev);
      } else if (e.key.toLowerCase() === 'u') {
        handleUndo();
      } else if (e.key.toLowerCase() === 'h') {
        handleHint();
      } else if (e.key.toLowerCase() === 'l') {
        handleAskLogic();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
        onUpdateGame(prev => ({ ...prev, isPaused: !prev.isPaused }));
        setIsPauseModalOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberInput, handleErase, handleUndo, selectedCell, isPauseModalOpen, isLogicModalOpen, showConfirmQuit, onUpdateGame]);

  const handleBackToHome = () => {
    if (settings.confirmNewGame && !game.isCompleted && !game.isGameOver) {
      setShowConfirmQuit(true);
    } else {
      onNavigate('home');
    }
  };

  const minutes = Math.floor(game.elapsedSeconds / 60);
  const seconds = game.elapsedSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4 sm:py-6 space-y-4 animate-in fade-in duration-150">
      {/* Game Header HUD */}
      <div
        className="flex items-center justify-between gap-2 pb-3 border-b"
        style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
      >
        <button
          type="button"
          onClick={handleBackToHome}
          aria-label="Back"
          style={{ color: 'var(--md-sys-color-on-background)' }}
          className="p-2 -ml-2 rounded-xl hover:opacity-75 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Difficulty badge */}
        <div
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            color: 'var(--md-sys-color-on-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
          className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border capitalize"
        >
          {game.difficulty}
        </div>

        {/* Mistakes counter */}
        {settings.mistakesMode !== 'off' && (
          <div
            className="text-xs font-semibold"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Mistakes:{' '}
            <span
              className="font-mono font-bold"
              style={{
                color: game.mistakes > 0
                  ? 'var(--md-sys-color-error)'
                  : 'var(--md-sys-color-on-surface)',
              }}
            >
              {game.mistakes}
              {settings.mistakesMode === 'three' ? '/3' : ''}
            </span>
          </div>
        )}

        {/* Timer & Pause */}
        <div
          className="flex items-center gap-1.5 font-mono text-sm font-bold"
          style={{ color: 'var(--md-sys-color-on-surface)' }}
        >
          <span>{timeFormatted}</span>
          <button
            type="button"
            onClick={() => {
              onUpdateGame(prev => ({ ...prev, isPaused: true }));
              setIsPauseModalOpen(true);
            }}
            aria-label="Pause Game"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            className="p-1 rounded-lg hover:opacity-75"
          >
            <Pause className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* SUDOKU BOARD */}
      <SudokuBoard
        board={game.board}
        selectedCell={selectedCell}
        onSelectCell={handleSelectCell}
        settings={settings}
        activeLogicStep={activeLogicStep}
        mistakeCells={mistakes}
        completedHighlightCells={completedHighlightCells}
        isPaused={game.isPaused}
      />

      {/* CONTROLS & NUMPAD */}
      <SudokuControls
        onNumberClick={handleNumberInput}
        onUndo={handleUndo}
        onErase={handleErase}
        isNotesMode={isNotesMode}
        onToggleNotesMode={() => setIsNotesMode(prev => !prev)}
        onHint={handleHint}
        onAskLogic={handleAskLogic}
        digitCounts={digitCounts}
        canUndo={game.moveHistory.length > 0}
        disabled={game.isPaused || game.isCompleted || game.isGameOver}
      />

      {/* Game Over Modal (Mistakes Limit Reached) */}
      {game.isGameOver && (
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
            className="w-full max-w-sm rounded-2xl border shadow-2xl p-6 text-center space-y-4"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/15 text-red-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2
              className="text-xl font-bold"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              3 Mistakes Made
            </h2>
            <p
              className="text-sm"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              You reached the 3 mistakes limit for this game. You can restart the puzzle or return to the main menu.
            </p>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={onRestartGame}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-bold shadow-sm"
                style={{
                  backgroundColor: 'var(--md-sys-color-primary)',
                  color: 'var(--md-sys-color-on-primary)',
                }}
              >
                Restart Puzzle
              </button>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                className="w-full py-2 px-4 rounded-xl text-sm font-semibold hover:opacity-85"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Quit Dialog */}
      {showConfirmQuit && (
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
            className="w-full max-w-sm rounded-2xl border shadow-2xl p-6 text-center space-y-4"
          >
            <h2
              className="text-lg font-bold"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            >
              Exit Game?
            </h2>
            <p
              className="text-sm"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              Your puzzle progress will be saved in your session so you can resume anytime.
            </p>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmQuit(false)}
                style={{
                  borderColor: 'var(--md-sys-color-outline-variant)',
                  color: 'var(--md-sys-color-on-surface)',
                }}
                className="flex-1 py-2 px-4 rounded-xl text-sm font-semibold border"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmQuit(false);
                  onNavigate('home');
                }}
                className="flex-1 py-2 px-4 rounded-xl text-sm font-bold"
                style={{
                  backgroundColor: 'var(--md-sys-color-primary)',
                  color: 'var(--md-sys-color-on-primary)',
                }}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logic Modal */}
      <LogicModal
        step={activeLogicStep}
        isOpen={isLogicModalOpen}
        onClose={() => setIsLogicModalOpen(false)}
        onApplyStep={handleApplyLogicStep}
      />

      {/* Pause Modal */}
      <PauseModal
        isOpen={isPauseModalOpen}
        onResume={() => {
          setIsPauseModalOpen(false);
          onUpdateGame(prev => ({ ...prev, isPaused: false }));
        }}
        onRestart={() => {
          setIsPauseModalOpen(false);
          onRestartGame();
        }}
        onQuitToHome={() => {
          setIsPauseModalOpen(false);
          onNavigate('home');
        }}
        elapsedSeconds={game.elapsedSeconds}
        difficulty={game.difficulty}
      />

      {/* Victory Modal */}
      <VictoryModal
        isOpen={game.isCompleted}
        onPlayNext={() => (onStartNewGame ? onStartNewGame(game.difficulty) : onRestartGame())}
        onPlayAgain={onRestartGame}
        onHome={() => onNavigate('home')}
        elapsedSeconds={game.elapsedSeconds}
        difficulty={game.difficulty}
        mistakes={game.mistakes}
        score={game.score}
      />
    </div>
  );
};
