import { ActiveGame, SavedPuzzle } from '../types/sudoku';

const STORAGE_KEY = 'sudoku_saved_puzzles';

/**
 * Loads all saved/bookmarked puzzles from localStorage, sorted newest first.
 */
export function loadSavedPuzzles(): SavedPuzzle[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Sort by savedAt descending
    return parsed.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
  } catch (err) {
    console.error('Failed to load saved puzzles from localStorage:', err);
    return [];
  }
}

/**
 * Saves or updates a bookmarked puzzle in localStorage.
 */
export function savePuzzleToStorage(puzzle: SavedPuzzle): void {
  if (typeof window === 'undefined') return;
  try {
    const list = loadSavedPuzzles();
    const existingIndex = list.findIndex(p => p.id === puzzle.id);
    let updated: SavedPuzzle[];
    if (existingIndex >= 0) {
      // Update existing
      updated = [...list];
      updated[existingIndex] = { ...puzzle, savedAt: new Date().toISOString() };
    } else {
      // Prepend new puzzle
      updated = [puzzle, ...list];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch a storage event so active screens can sync in real time
    window.dispatchEvent(new Event('sudoku_saved_puzzles_updated'));
  } catch (err) {
    console.error('Failed to save puzzle to localStorage:', err);
  }
}

/**
 * Removes a saved puzzle by ID.
 */
export function removeSavedPuzzle(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = loadSavedPuzzles();
    const filtered = list.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('sudoku_saved_puzzles_updated'));
  } catch (err) {
    console.error('Failed to remove saved puzzle:', err);
  }
}

/**
 * Checks if a puzzle ID is currently bookmarked.
 */
export function isPuzzleSaved(id: string): boolean {
  if (typeof window === 'undefined' || !id) return false;
  const list = loadSavedPuzzles();
  return list.some(p => p.id === id);
}

/**
 * Updates title for a saved puzzle.
 */
export function renameSavedPuzzle(id: string, newTitle: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = loadSavedPuzzles();
    const updated = list.map(p => (p.id === id ? { ...p, title: newTitle.trim() } : p));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('sudoku_saved_puzzles_updated'));
  } catch (err) {
    console.error('Failed to rename saved puzzle:', err);
  }
}

/**
 * Helper to transform an ActiveGame into a SavedPuzzle with accurate progress calculations.
 */
export function convertActiveGameToSavedPuzzle(game: ActiveGame, title?: string): SavedPuzzle {
  const totalCells = 81;
  let solvedCells = 0;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = game.board[r]?.[c];
      if (cell && cell.value !== 0 && cell.value === game.solution[r]?.[c]) {
        solvedCells++;
      }
    }
  }

  const progressPercent = Math.min(100, Math.round((solvedCells / totalCells) * 100));

  // Determine an informative default title if none provided
  const defaultTitle = game.isDaily
    ? `Daily Challenge (${game.dailyDate || new Date().toISOString().slice(0, 10)})`
    : `${game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)} Puzzle`;

  return {
    id: game.id,
    title: title || defaultTitle,
    difficulty: game.difficulty,
    savedAt: new Date().toISOString(),
    board: game.board.map(row => row.map(cell => ({ ...cell, notes: [...cell.notes] }))),
    initialBoard: game.initialBoard.map(row => [...row]),
    solution: game.solution.map(row => [...row]),
    elapsedSeconds: game.elapsedSeconds,
    mistakes: game.mistakes,
    hintsUsed: game.hintsUsed,
    logicHintsUsed: game.logicHintsUsed,
    isDaily: game.isDaily,
    dailyDate: game.dailyDate,
    progressPercent,
    solvedCells,
    totalCells,
    score: game.score,
  };
}

/**
 * Helper to convert a SavedPuzzle back into a playable ActiveGame.
 */
export function convertSavedPuzzleToActiveGame(puzzle: SavedPuzzle): ActiveGame {
  return {
    id: puzzle.id,
    difficulty: puzzle.difficulty,
    isDaily: puzzle.isDaily,
    dailyDate: puzzle.dailyDate,
    board: puzzle.board.map(row => row.map(cell => ({ ...cell, notes: [...cell.notes] }))),
    initialBoard: puzzle.initialBoard.map(row => [...row]),
    solution: puzzle.solution.map(row => [...row]),
    elapsedSeconds: puzzle.elapsedSeconds,
    mistakes: puzzle.mistakes,
    hintsUsed: puzzle.hintsUsed,
    logicHintsUsed: puzzle.logicHintsUsed || 0,
    isPaused: false,
    isCompleted: false,
    isGameOver: false,
    score: puzzle.score || 0,
    startTime: Date.now() - (puzzle.elapsedSeconds * 1000),
    moveHistory: [],
  };
}
