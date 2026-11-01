import React, { useState, useEffect, useCallback } from 'react';
import { ActiveGame, CellData, CompletedHighlightCell, Difficulty, GameSettings, LogicStep, MoveRecord, Screen } from '../../types/sudoku';
import { useTheme } from '../../theme/themeContext';
import { SudokuBoard } from '../sudoku/SudokuBoard';
import { SudokuControls } from '../sudoku/SudokuControls';
import { LogicModal } from '../sudoku/LogicModal';
import { PauseModal } from '../sudoku/PauseModal';
import { VictoryModal } from '../sudoku/VictoryModal';
import { NumberCelebrationParade } from '../sudoku/NumberCelebrationParade';
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
  playCriticalErrorBuzz,
  playHintSound,
  playUnitCompletionSound,
  playCelebrationFanfare,
  playVictoryFanfare,
  playSuccessSound,
  triggerHaptic,
} from '../../utils/audio';
import { ArrowLeft, Pause, Play, RotateCcw, AlertTriangle, Bookmark, BookmarkCheck, HelpCircle } from 'lucide-react';
import {
  isPuzzleSaved,
  savePuzzleToStorage,
  removeSavedPuzzle,
  convertActiveGameToSavedPuzzle,
} from '../../utils/savedPuzzles';
import { launchVictoryConfetti, stopVictoryConfetti } from '../../utils/confettiVictory';
import { GameTimer, formatElapsedTime } from '../sudoku/GameTimer';
import { HowToPlayModal } from '../modals/HowToPlayModal';

interface GameScreenProps {
  game: ActiveGame;
  settings: GameSettings;
  onUpdateGame: (updater: (prev: ActiveGame) => ActiveGame) => void;
  onGameCompleted: (game: ActiveGame) => void;
  onRestartGame: () => void;
  onStartNewGame?: (difficulty: Difficulty) => void;
  onNavigate: (screen: Screen) => void;
  onUpdateSettings?: (newSettings: Partial<GameSettings>) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  game,
  settings,
  onUpdateGame,
  onGameCompleted,
  onRestartGame,
  onStartNewGame,
  onNavigate,
  onUpdateSettings,
}) => {
  const { activePrimary, activeOnPrimary, activeAccentText } = useTheme();

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>({ row: 0, col: 0 });
  const [completedHighlightCells, setCompletedHighlightCells] = useState<CompletedHighlightCell[]>([]);
  const [isNotesMode, setIsNotesMode] = useState<boolean>(false);
  const [selectedNoteValue, setSelectedNoteValue] = useState<number | null>(null);
  const [activeLogicStep, setActiveLogicStep] = useState<LogicStep | null>(null);
  const [isLogicModalOpen, setIsLogicModalOpen] = useState<boolean>(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState<boolean>(false);
  const [showConfirmQuit, setShowConfirmQuit] = useState<boolean>(false);
  const [isNumberParadeActive, setIsNumberParadeActive] = useState<boolean>(false);
  const [celebratingNumber, setCelebratingNumber] = useState<number | null>(null);
  const [completedParadeNumbers, setCompletedParadeNumbers] = useState<number[]>([]);
  const [paradeCollectionCounts, setParadeCollectionCounts] = useState<Record<number, number> | undefined>(undefined);
  const [arrivingBoxPulse, setArrivingBoxPulse] = useState<{ num: number; count: number } | null>(null);
  const [isVictoryModalVisible, setIsVictoryModalVisible] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => isPuzzleSaved(game.id));
  const [bookmarkToast, setBookmarkToast] = useState<string | null>(null);

  useEffect(() => {
    setIsBookmarked(isPuzzleSaved(game.id));
  }, [game.id]);

  // Keep saved puzzle in sync with current moves if it is bookmarked
  useEffect(() => {
    if (isPuzzleSaved(game.id) && !game.isCompleted && !game.isGameOver) {
      savePuzzleToStorage(convertActiveGameToSavedPuzzle(game));
    }
  }, [game.board, game.elapsedSeconds, game.mistakes, game.hintsUsed, game.id, game.isCompleted, game.isGameOver]);

  const handleToggleBookmark = useCallback(() => {
    if (isBookmarked) {
      removeSavedPuzzle(game.id);
      setIsBookmarked(false);
      setBookmarkToast('Removed from Saved Puzzles');
      playTapSound(settings.soundEnabled);
      triggerHaptic('light', settings.hapticsEnabled);
    } else {
      const saved = convertActiveGameToSavedPuzzle(game);
      savePuzzleToStorage(saved);
      setIsBookmarked(true);
      setBookmarkToast('Puzzle bookmarked to Saved Puzzles!');
      playSuccessSound(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
    }

    const timer = setTimeout(() => {
      setBookmarkToast(null);
    }, 2400);
    return () => clearTimeout(timer);
  }, [isBookmarked, game, settings.soundEnabled, settings.hapticsEnabled]);

  // First game onboarding How-To modal state
  const [isHowToModalOpen, setIsHowToModalOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const hasSeen = localStorage.getItem('sudoku_has_seen_howto_guide');
      return !hasSeen;
    } catch {
      return false;
    }
  });

  // When starting their first game, ensure game is paused while guide is open
  useEffect(() => {
    if (isHowToModalOpen && !game.isPaused) {
      onUpdateGame(prev => ({ ...prev, isPaused: true }));
    }
  }, [isHowToModalOpen, onUpdateGame]);

  const handleCloseHowToModal = useCallback(() => {
    try {
      localStorage.setItem('sudoku_has_seen_howto_guide', 'true');
    } catch {
      // Ignore
    }
    setIsHowToModalOpen(false);
    onUpdateGame(prev => ({ ...prev, isPaused: false }));
  }, [onUpdateGame]);

  // Real-time Timer interval (pauses when game is paused, completed, or window hidden)
  useEffect(() => {
    if (game.isPaused || game.isCompleted || game.isGameOver) return;
    const interval = setInterval(() => {
      // Guard against background tab ticking
      if (typeof document !== 'undefined' && (document.hidden || document.visibilityState === 'hidden')) {
        return;
      }
      onUpdateGame(prev => {
        if (prev.isPaused || prev.isCompleted || prev.isGameOver) return prev;
        return {
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [game.isPaused, game.isCompleted, game.isGameOver, onUpdateGame]);

  // Auto-pause when user minimizes the game, switches tabs/windows, or navigates away
  useEffect(() => {
    const handlePauseOnBackground = () => {
      if (!game.isCompleted && !game.isGameOver) {
        onUpdateGame(prev => {
          if (!prev.isPaused) {
            const pausedGame = { ...prev, isPaused: true };
            try {
              localStorage.setItem('sudoku_active_game', JSON.stringify(pausedGame));
            } catch {
              // Ignore
            }
            return pausedGame;
          }
          return prev;
        });
        setIsPauseModalOpen(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        handlePauseOnBackground();
      }
    };

    const handleWindowBlur = () => {
      handlePauseOnBackground();
    };

    const handlePageHide = () => {
      handlePauseOnBackground();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [game.isCompleted, game.isGameOver, onUpdateGame]);

  // Auto-pause when navigating away from GameScreen (component unmount)
  useEffect(() => {
    return () => {
      onUpdateGame(prev => {
        if (!prev.isPaused && !prev.isCompleted && !prev.isGameOver) {
          const pausedGame = { ...prev, isPaused: true };
          try {
            localStorage.setItem('sudoku_active_game', JSON.stringify(pausedGame));
          } catch {
            // Ignore
          }
          return pausedGame;
        }
        return prev;
      });
    };
  }, [onUpdateGame]);

  // Mistakes calculation
  const mistakes = settings.mistakesMode !== 'off'
    ? findBoardMistakes(game.board, game.solution)
    : [];

  const digitCounts = countPlacedDigits(game.board);

  // Completion progress calculation (percentage of 81 cells correctly placed)
  const totalCells = 81;
  let correctPlacedCount = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = game.board[r][c];
      if (cell.value !== 0 && cell.value === game.solution[r][c]) {
        correctPlacedCount++;
      }
    }
  }
  const progressPercent = Math.min(100, Math.round((correctPlacedCount / totalCells) * 100));
  const showProgressBar = settings.showProgressBar ?? true;

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
        playCriticalErrorBuzz(settings.soundEnabled);
        triggerHaptic('error', settings.hapticsEnabled);
        return;
      }

      // Check unit completions before placement
      const prevUnits = checkUnitCompletion(game.board, game.solution);

      const newBoard = game.board.map(r => r.map(c => ({ ...c, notes: [...c.notes] })));
      newBoard[row][col].value = num;
      newBoard[row][col].notes = [];

      // Automatic Notes Removal:
      // When a correct number is entered, automatically remove that number from the Notes of
      // all other cells in the same horizontal row, vertical column, and 3x3 box.
      const clearedNotes: { row: number; col: number; notes: number[] }[] = [];
      if (isCorrect) {
        const peerCoords = new Set<string>();
        for (let i = 0; i < 9; i++) {
          if (i !== col) peerCoords.add(`${row},${i}`);
          if (i !== row) peerCoords.add(`${i},${col}`);
        }
        const startR = Math.floor(row / 3) * 3;
        const startC = Math.floor(col / 3) * 3;
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const curR = startR + r;
            const curC = startC + c;
            if (curR !== row || curC !== col) {
              peerCoords.add(`${curR},${curC}`);
            }
          }
        }

        peerCoords.forEach(coord => {
          const [rStr, cStr] = coord.split(',');
          const r = parseInt(rStr, 10);
          const c = parseInt(cStr, 10);
          const peer = newBoard[r][c];
          if (peer.notes && peer.notes.includes(num)) {
            clearedNotes.push({ row: r, col: c, notes: [...peer.notes] });
            peer.notes = peer.notes.filter(n => n !== num);
          }
        });
      }

      const moveRecord: MoveRecord = {
        row,
        col,
        prevValue: prevVal,
        newValue: num,
        prevNotes: [...targetCell.notes],
        newNotes: [],
        isNoteMove: false,
        clearedNotes,
      };

      const solved = isBoardSolved(newBoard, game.solution);
      const nextUnits = checkUnitCompletion(newBoard, game.solution);
      const newlyCompleted = detectNewlyCompletedUnits(prevUnits, nextUnits);

      if (solved) {
        // 1. Immediately display the completed Sudoku matrix exactly as it is for 1 second
        const boardWithFinalMove: ActiveGame = {
          ...game,
          board: newBoard,
          isCompleted: false,
          score: game.score + (isCorrect ? 100 : 0),
          moveHistory: [...game.moveHistory, moveRecord],
        };

        onUpdateGame(() => boardWithFinalMove);
        playNumberEntrySound(settings.soundEnabled);
        triggerHaptic('number', settings.hapticsEnabled);

        // Prepare initial collection counts (0/9 for all boxes, default color retained)
        setParadeCollectionCounts({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 });

        // 2. After exactly 1 second, trigger the firecracker celebration & ascending number animation
        setTimeout(() => {
          playCelebrationFanfare(settings.soundEnabled);
          triggerHaptic('celebration', settings.hapticsEnabled);
          setIsNumberParadeActive(true);
          launchVictoryConfetti();
        }, 1000);
        return;
      }

      const updatedGame: ActiveGame = {
        ...game,
        board: newBoard,
        isCompleted: false,
        score: game.score + (isCorrect ? 100 : 0),
        moveHistory: [...game.moveHistory, moveRecord],
      };

      onUpdateGame(() => updatedGame);

      if (newlyCompleted.count > 0) {
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

      // Restore any peer notes that were automatically removed by this move
      if (lastMove.clearedNotes && lastMove.clearedNotes.length > 0) {
        lastMove.clearedNotes.forEach(item => {
          newBoard[item.row][item.col].notes = [...item.notes];
        });
      }

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

  // Dedicated note toggle handler for 2-second long-press 3x3 notes popup
  const handleToggleCellNote = useCallback((row: number, col: number, num: number) => {
    if (game.isPaused || game.isCompleted || game.isGameOver) return;
    const targetCell = game.board[row]?.[col];
    if (!targetCell || targetCell.given || targetCell.value !== 0) return;

    setSelectedCell({ row, col });
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
  }, [game.isPaused, game.isCompleted, game.isGameOver, game.board, onUpdateGame, settings.soundEnabled, settings.hapticsEnabled]);

  // Track active number and all gathered numbers during the ascending 1-9 parade
  const handleNumberStep = useCallback((currentNum: number | null, completed: number[]) => {
    setCelebratingNumber(currentNum);
    setCompletedParadeNumbers([...completed]);
  }, []);

  // Live collection arrival handler: updates counter 0/9 -> 9/9 and triggers box glow pulse
  const handleOccurrenceArrival = useCallback((num: number, count: number) => {
    setParadeCollectionCounts(prev => ({
      ...(prev || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }),
      [num]: count,
    }));
    setArrivingBoxPulse({ num, count });
    window.setTimeout(() => {
      setArrivingBoxPulse(curr => (curr?.num === num && curr?.count === count ? null : curr));
    }, 380);
  }, []);

  // Handle completion of the ascending 1-9 number celebration parade
  const handleNumberParadeComplete = useCallback(() => {
    setIsNumberParadeActive(false);
    setCelebratingNumber(null);
    setCompletedParadeNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    setParadeCollectionCounts({ 1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9 });
    setArrivingBoxPulse(null);
    setIsVictoryModalVisible(true);
    launchVictoryConfetti();

    const finalCompletedGame: ActiveGame = {
      ...game,
      isCompleted: true,
    };
    onUpdateGame(() => finalCompletedGame);
    onGameCompleted(finalCompletedGame);
  }, [game, onUpdateGame, onGameCompleted]);

  // Reset celebration parade and particle confetti when a new game starts or is restarted
  useEffect(() => {
    if (!game.isCompleted) {
      setIsVictoryModalVisible(false);
      setIsNumberParadeActive(false);
      setCelebratingNumber(null);
      setCompletedParadeNumbers([]);
      setParadeCollectionCounts(undefined);
      setArrivingBoxPulse(null);
      stopVictoryConfetti();
    }
    return () => {
      stopVictoryConfetti();
    };
  }, [game.id, game.isCompleted]);

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

    const targetCell = game.board[row][col];
    const prevVal = targetCell.value;
    const clearedNotes: { row: number; col: number; notes: number[] }[] = [];
    const newBoard = game.board.map(r => r.map(c => ({ ...c, notes: [...c.notes] })));
    newBoard[row][col].value = val;
    newBoard[row][col].notes = [];

    // Automatic Notes Removal for peers
    const peerCoords = new Set<string>();
    for (let i = 0; i < 9; i++) {
      if (i !== col) peerCoords.add(`${row},${i}`);
      if (i !== row) peerCoords.add(`${i},${col}`);
    }
    const startR = Math.floor(row / 3) * 3;
    const startC = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const curR = startR + r;
        const curC = startC + c;
        if (curR !== row || curC !== col) {
          peerCoords.add(`${curR},${curC}`);
        }
      }
    }

    peerCoords.forEach(coord => {
      const [rStr, cStr] = coord.split(',');
      const r = parseInt(rStr, 10);
      const c = parseInt(cStr, 10);
      const peer = newBoard[r][c];
      if (peer.notes && peer.notes.includes(val)) {
        clearedNotes.push({ row: r, col: c, notes: [...peer.notes] });
        peer.notes = peer.notes.filter(n => n !== val);
      }
    });

    const moveRecord: MoveRecord = {
      row,
      col,
      prevValue: prevVal,
      newValue: val,
      prevNotes: [...targetCell.notes],
      newNotes: [],
      isNoteMove: false,
      clearedNotes,
    };

    const solved = isBoardSolved(newBoard, game.solution);
    if (solved) {
      const boardWithFinalHint: ActiveGame = {
        ...game,
        board: newBoard,
        hintsUsed: game.hintsUsed + 1,
        isCompleted: false,
        moveHistory: [...game.moveHistory, moveRecord],
      };

      onUpdateGame(() => boardWithFinalHint);
      playNumberEntrySound(settings.soundEnabled);
      triggerHaptic('number', settings.hapticsEnabled);

      // Prepare initial collection counts (0/9 for all boxes, default color retained)
      setParadeCollectionCounts({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 });

      // 1-second board freeze, then firecracker celebration & sequential 1-9 parade
      setTimeout(() => {
        playCelebrationFanfare(settings.soundEnabled);
        triggerHaptic('celebration', settings.hapticsEnabled);
        setIsNumberParadeActive(true);
        launchVictoryConfetti();
      }, 1000);
      return;
    }

    const updatedGame: ActiveGame = {
      ...game,
      board: newBoard,
      hintsUsed: game.hintsUsed + 1,
      isCompleted: false,
      moveHistory: [...game.moveHistory, moveRecord],
    };

    onUpdateGame(() => updatedGame);
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

  // Toggle Pencil / Candidate Notes Mode
  const handleToggleNotesMode = useCallback(() => {
    setIsNotesMode(prev => {
      const next = !prev;
      if (!next) {
        setSelectedNoteValue(null);
      }
      playNoteEntrySound(settings.soundEnabled, !next);
      triggerHaptic('note', settings.hapticsEnabled);
      return next;
    });
  }, [settings.soundEnabled, settings.hapticsEnabled]);

  // Clean up selected note value when pencil mode is off, game is paused, completed, or game over
  useEffect(() => {
    if (!isNotesMode || game.isPaused || game.isCompleted || game.isGameOver) {
      setSelectedNoteValue(null);
    }
  }, [isNotesMode, game.isPaused, game.isCompleted, game.isGameOver]);

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
      } else if (e.key.toLowerCase() === 'p' || e.key.toLowerCase() === 'n') {
        handleToggleNotesMode();
      } else if (e.key.toLowerCase() === 'u') {
        handleUndo();
      } else if (e.key.toLowerCase() === 'h') {
        handleHint();
      } else if (e.key.toLowerCase() === 'l') {
        handleAskLogic();
      } else if (e.key === 'Escape') {
        if (selectedNoteValue !== null) {
          setSelectedNoteValue(null);
        } else {
          onUpdateGame(prev => ({ ...prev, isPaused: !prev.isPaused }));
          setIsPauseModalOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberInput, handleErase, handleUndo, handleToggleNotesMode, selectedCell, isPauseModalOpen, isLogicModalOpen, showConfirmQuit, onUpdateGame, selectedNoteValue]);

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
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 py-2 sm:py-5 space-y-2 sm:space-y-3.5 animate-in fade-in duration-150">
      {/* Game Header HUD */}
      <div
        className="flex items-center justify-between gap-2 pb-2 sm:pb-3 border-b"
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

        {/* Timer, Pause, Bookmark & Guide Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Notes & Candidate How-To Guide Button */}
          <button
            type="button"
            onClick={() => {
              onUpdateGame(prev => ({ ...prev, isPaused: true }));
              setIsHowToModalOpen(true);
            }}
            aria-label="Notes & Candidate Guide"
            title="How-To: Note-taking & candidate calculation guide"
            style={{
              color: isHowToModalOpen ? '#F59E0B' : 'var(--md-sys-color-on-surface-variant)',
              backgroundColor: isHowToModalOpen ? 'rgba(245, 158, 11, 0.16)' : 'transparent',
            }}
            className="p-1.5 rounded-lg hover:opacity-85 transition-all flex items-center justify-center active:scale-90"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            aria-label={isBookmarked ? 'Remove from Saved Puzzles' : 'Save puzzle for later'}
            title={isBookmarked ? 'Saved to Bookmarks (click to remove)' : 'Bookmark puzzle to play later'}
            style={{
              color: isBookmarked ? '#F59E0B' : 'var(--md-sys-color-on-surface-variant)',
              backgroundColor: isBookmarked ? 'rgba(245, 158, 11, 0.16)' : 'transparent',
            }}
            className="p-1.5 rounded-lg hover:opacity-85 transition-all flex items-center justify-center active:scale-90"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 fill-current transition-transform scale-105" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          {/* Visual Real-Time Elapsed Timer Component */}
          <GameTimer
            elapsedSeconds={game.elapsedSeconds}
            isPaused={game.isPaused}
            onTogglePause={() => {
              if (game.isPaused) {
                onUpdateGame(prev => ({ ...prev, isPaused: false }));
                setIsPauseModalOpen(false);
              } else {
                onUpdateGame(prev => ({ ...prev, isPaused: true }));
                setIsPauseModalOpen(true);
              }
            }}
            disabled={game.isCompleted || game.isGameOver}
          />
        </div>
      </div>

      {/* Floating Bookmark Toast Feedback */}
      {bookmarkToast && (
        <div
          role="status"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2 border animate-in fade-in slide-in-from-top-3 duration-200"
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-highest)',
            color: 'var(--md-sys-color-on-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
          }}
        >
          <BookmarkCheck className="w-4 h-4 text-amber-500 fill-current shrink-0" />
          <span>{bookmarkToast}</span>
        </div>
      )}

      {/* PUZZLE COMPLETION PROGRESS BAR (Toggled in Settings) */}
      {showProgressBar && (
        <div
          className="w-full space-y-1 animate-in fade-in duration-200"
          id="sudoku-progress-bar-container"
        >
          <div className="flex items-center justify-between text-xs font-semibold px-0.5">
            <span
              className="flex items-center gap-1.5"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              <span
                className="w-2 h-2 rounded-full transition-transform duration-300"
                style={{
                  backgroundColor: progressPercent === 100 ? '#22C55E' : activePrimary,
                }}
              />
              <span>Progress</span>
              <span
                className="font-mono font-bold"
                style={{ color: 'var(--md-sys-color-on-surface)' }}
              >
                {progressPercent}%
              </span>
            </span>
            <span
              className="text-[11px] font-mono font-medium"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              {correctPlacedCount} / {totalCells} solved
            </span>
          </div>

          <div
            className="w-full h-1.5 sm:h-2 rounded-full overflow-hidden p-0.5 border shadow-inner"
            style={{
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              borderColor: 'var(--md-sys-color-outline-variant)',
            }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Puzzle completion: ${progressPercent}%`}
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: progressPercent === 100 ? '#22C55E' : activePrimary,
                boxShadow: progressPercent > 0 ? `0 0 8px ${progressPercent === 100 ? '#22C55E' : activePrimary}66` : 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* SUDOKU BOARD */}
      <SudokuBoard
        board={game.board}
        selectedCell={selectedCell}
        onSelectCell={handleSelectCell}
        onToggleCellNote={handleToggleCellNote}
        settings={settings}
        activeLogicStep={activeLogicStep}
        mistakeCells={mistakes}
        completedHighlightCells={completedHighlightCells}
        isPaused={game.isPaused}
        celebratingNumber={celebratingNumber}
        completedParadeNumbers={completedParadeNumbers}
        selectedNoteValue={selectedNoteValue}
        isNotesMode={isNotesMode}
      />

      {/* CONTROLS & NUMPAD */}
      <SudokuControls
        onNumberClick={handleNumberInput}
        onUndo={handleUndo}
        onErase={handleErase}
        isNotesMode={isNotesMode}
        onToggleNotesMode={handleToggleNotesMode}
        onHint={handleHint}
        onAskLogic={handleAskLogic}
        digitCounts={digitCounts}
        canUndo={game.moveHistory.length > 0}
        disabled={game.isPaused || game.isCompleted || game.isGameOver}
        celebratingNumber={celebratingNumber}
        completedParadeNumbers={completedParadeNumbers}
        inputMode={settings.inputMode}
        customColors={settings.customColors}
        selectedNoteValue={selectedNoteValue}
        onSelectNoteValue={setSelectedNoteValue}
        isParadeActive={isNumberParadeActive}
        paradeCollectionCounts={paradeCollectionCounts}
        arrivingBoxPulse={arrivingBoxPulse}
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
        inputMode={settings.inputMode}
        customColors={settings.customColors}
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
        isBookmarked={isBookmarked}
        onToggleBookmark={handleToggleBookmark}
        onOpenHowToGuide={() => {
          setIsPauseModalOpen(false);
          setIsHowToModalOpen(true);
        }}
      />

      {/* Step-by-Step How-To Notes & Candidate Guide Modal */}
      <HowToPlayModal
        isOpen={isHowToModalOpen}
        onClose={handleCloseHowToModal}
        soundEnabled={settings.soundEnabled}
        hapticsEnabled={settings.hapticsEnabled}
        inputMode={settings.inputMode}
        customColors={settings.customColors}
      />

      {/* Number Celebration Parade with Firecrackers & Ascending 1-9 Flight */}
      <NumberCelebrationParade
        board={game.board}
        isActive={isNumberParadeActive}
        onNumberStep={handleNumberStep}
        onOccurrenceArrival={handleOccurrenceArrival}
        onComplete={handleNumberParadeComplete}
        soundEnabled={settings.soundEnabled}
        hapticsEnabled={settings.hapticsEnabled}
        animationStyle={settings.completionAnimationStyle || 'ribbon'}
        inputMode={settings.inputMode}
        customColors={settings.customColors}
        onToggleAnimationStyle={() => {
          const nextStyle = settings.completionAnimationStyle === 'numbers_only' ? 'ribbon' : 'numbers_only';
          onUpdateSettings?.({ completionAnimationStyle: nextStyle });
        }}
      />

      {/* Victory Modal */}
      <VictoryModal
        isOpen={isVictoryModalVisible}
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
