import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from './theme/themeContext';
import {
  ActiveGame,
  Difficulty,
  GameHistoryItem,
  GameSettings,
  PlayerStats,
  Screen,
} from './types/sudoku';
import { TopBar } from './components/layout/TopBar';
import { HomeScreen } from './components/screens/HomeScreen';
import { GameScreen } from './components/screens/GameScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { DailyScreen } from './components/screens/DailyScreen';
import { CaptureScreen } from './components/screens/CaptureScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { StatisticsScreen } from './components/screens/StatisticsScreen';
import { ContrastAuditModal } from './components/modals/ContrastAuditModal';
import {
  createBoardMatrix,
  generatePuzzle,
  solveSudoku,
  cloneGrid,
  calculateCandidates,
} from './utils/sudokuEngine';

const DEFAULT_SETTINGS: GameSettings = {
  autoNotes: false,
  highlightSameNumbers: true,
  highlightRowColBlock: true,
  mistakesMode: 'three',
  autoAdvance: true,
  hintsMode: 'logic',
  confirmNewGame: true,
  themeMode: 'system',
  accentColor: 'indigo',
  soundEnabled: true,
  hapticsEnabled: true,
};

const DEFAULT_STATS: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: null,
  byDifficulty: {
    easy: { played: 0, won: 0, bestTimeSeconds: null, totalTimeSeconds: 0 },
    medium: { played: 0, won: 0, bestTimeSeconds: null, totalTimeSeconds: 0 },
    hard: { played: 0, won: 0, bestTimeSeconds: null, totalTimeSeconds: 0 },
    expert: { played: 0, won: 0, bestTimeSeconds: null, totalTimeSeconds: 0 },
  },
};

function MainApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isContrastModalOpen, setIsContrastModalOpen] = useState<boolean>(false);

  // Automatically scroll to top whenever screen changes (including opening Capture page)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentScreen]);

  // Load Settings
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('sudoku_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // Ignore
    }
    return DEFAULT_SETTINGS;
  });

  // Save Settings
  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('sudoku_settings', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  // Player Stats
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem('sudoku_player_stats');
      if (saved) return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    } catch {
      // Ignore
    }
    return DEFAULT_STATS;
  });

  const saveStats = (stats: PlayerStats) => {
    setPlayerStats(stats);
    try {
      localStorage.setItem('sudoku_player_stats', JSON.stringify(stats));
    } catch {
      // Ignore
    }
  };

  // Game History
  const [history, setHistory] = useState<GameHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('sudoku_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [];
  });

  const saveHistory = (items: GameHistoryItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem('sudoku_history', JSON.stringify(items));
    } catch {
      // Ignore
    }
  };

  // Active Game State
  const [activeGame, setActiveGame] = useState<ActiveGame | null>(() => {
    try {
      const saved = localStorage.getItem('sudoku_active_game');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.isCompleted && !parsed.isGameOver) return parsed;
      }
    } catch {
      // Ignore
    }
    return null;
  });

  useEffect(() => {
    try {
      if (activeGame) {
        localStorage.setItem('sudoku_active_game', JSON.stringify(activeGame));
      } else {
        localStorage.removeItem('sudoku_active_game');
      }
    } catch {
      // Ignore
    }
  }, [activeGame]);

  // Start New Game
  const handleStartNewGame = (difficulty: Difficulty) => {
    const { puzzle, solution } = generatePuzzle(difficulty);
    const board = createBoardMatrix(puzzle);

    if (settings.autoNotes) {
      const candidates = calculateCandidates(board);
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c].value === 0) {
            board[r][c].notes = candidates[r][c];
          }
        }
      }
    }

    const newGame: ActiveGame = {
      id: `game_${Date.now()}`,
      difficulty,
      board,
      initialBoard: puzzle,
      solution,
      elapsedSeconds: 0,
      mistakes: 0,
      hintsUsed: 0,
      logicHintsUsed: 0,
      isPaused: false,
      isCompleted: false,
      isGameOver: false,
      score: 0,
      startTime: Date.now(),
      moveHistory: [],
    };

    setActiveGame(newGame);
    setCurrentScreen('game');

    // Update played stats
    const updatedStats: PlayerStats = {
      ...playerStats,
      gamesPlayed: playerStats.gamesPlayed + 1,
      byDifficulty: {
        ...playerStats.byDifficulty,
        [difficulty]: {
          ...playerStats.byDifficulty[difficulty],
          played: playerStats.byDifficulty[difficulty].played + 1,
        },
      },
    };
    saveStats(updatedStats);
  };

  // Start Daily Puzzle
  const handleStartDailyGame = (dateStr: string, difficulty: Difficulty) => {
    const { puzzle, solution } = generatePuzzle(difficulty, dateStr);
    const board = createBoardMatrix(puzzle);

    if (settings.autoNotes) {
      const candidates = calculateCandidates(board);
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c].value === 0) {
            board[r][c].notes = candidates[r][c];
          }
        }
      }
    }

    const newGame: ActiveGame = {
      id: `daily_${dateStr}`,
      difficulty,
      isDaily: true,
      dailyDate: dateStr,
      board,
      initialBoard: puzzle,
      solution,
      elapsedSeconds: 0,
      mistakes: 0,
      hintsUsed: 0,
      logicHintsUsed: 0,
      isPaused: false,
      isCompleted: false,
      isGameOver: false,
      score: 0,
      startTime: Date.now(),
      moveHistory: [],
    };

    setActiveGame(newGame);
    setCurrentScreen('game');
  };

  // Start Custom Verified Puzzle
  const handleStartCustomGame = (puzzle: number[][], difficulty: Difficulty) => {
    const solGrid = cloneGrid(puzzle);
    solveSudoku(solGrid);
    const board = createBoardMatrix(puzzle);

    const newGame: ActiveGame = {
      id: `custom_${Date.now()}`,
      difficulty,
      board,
      initialBoard: puzzle,
      solution: solGrid,
      elapsedSeconds: 0,
      mistakes: 0,
      hintsUsed: 0,
      logicHintsUsed: 0,
      isPaused: false,
      isCompleted: false,
      isGameOver: false,
      score: 0,
      startTime: Date.now(),
      moveHistory: [],
    };

    setActiveGame(newGame);
    setCurrentScreen('game');
  };

  // Restart Active Puzzle
  const handleRestartGame = () => {
    if (!activeGame) return;
    const board = createBoardMatrix(activeGame.initialBoard);

    if (settings.autoNotes) {
      const candidates = calculateCandidates(board);
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c].value === 0) {
            board[r][c].notes = candidates[r][c];
          }
        }
      }
    }

    setActiveGame(prev => {
      if (!prev) return null;
      return {
        ...prev,
        board,
        elapsedSeconds: 0,
        mistakes: 0,
        hintsUsed: 0,
        logicHintsUsed: 0,
        isPaused: false,
        isCompleted: false,
        isGameOver: false,
        moveHistory: [],
      };
    });
  };

  // Stable Game Updater
  const handleUpdateGame = useCallback((updater: (prev: ActiveGame) => ActiveGame) => {
    setActiveGame(prev => (prev ? updater(prev) : null));
  }, []);

  // Game Completed Handler
  const handleGameCompleted = (game: ActiveGame) => {
    const today = new Date().toISOString().split('T')[0];
    const prevStreak = playerStats.currentStreak;
    const newStreak = playerStats.lastPlayedDate === today ? prevStreak : prevStreak + 1;
    const bestStreak = Math.max(playerStats.bestStreak, newStreak);

    const diffStats = playerStats.byDifficulty[game.difficulty];
    const newBestTime = diffStats.bestTimeSeconds === null
      ? game.elapsedSeconds
      : Math.min(diffStats.bestTimeSeconds, game.elapsedSeconds);

    const updatedStats: PlayerStats = {
      ...playerStats,
      gamesWon: playerStats.gamesWon + 1,
      currentStreak: newStreak,
      bestStreak,
      lastPlayedDate: today,
      byDifficulty: {
        ...playerStats.byDifficulty,
        [game.difficulty]: {
          ...diffStats,
          won: diffStats.won + 1,
          bestTimeSeconds: newBestTime,
          totalTimeSeconds: diffStats.totalTimeSeconds + game.elapsedSeconds,
        },
      },
    };
    saveStats(updatedStats);

    // Save to History
    const historyEntry: GameHistoryItem = {
      id: game.id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      difficulty: game.difficulty,
      isDaily: !!game.isDaily,
      durationSeconds: game.elapsedSeconds,
      mistakes: game.mistakes,
      hintsUsed: game.hintsUsed + game.logicHintsUsed,
      won: true,
      score: game.score,
    };
    saveHistory([historyEntry, ...history]);
  };

  // Reset Stats
  const handleResetStats = () => {
    saveStats(DEFAULT_STATS);
    saveHistory([]);
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors"
      style={{
        backgroundColor: 'var(--md-sys-color-background)',
        color: 'var(--md-sys-color-on-background)',
      }}
    >
      {/* Universal Top Bar */}
      <TopBar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenContrastAudit={() => setIsContrastModalOpen(true)}
        hasActiveGame={!!activeGame && !activeGame.isCompleted && !activeGame.isGameOver}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'home' && (
          <HomeScreen
            activeGame={activeGame}
            playerStats={playerStats}
            onStartNewGame={handleStartNewGame}
            onResumeGame={() => setCurrentScreen('game')}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'game' && activeGame && (
          <GameScreen
            game={activeGame}
            settings={settings}
            onUpdateGame={handleUpdateGame}
            onGameCompleted={handleGameCompleted}
            onRestartGame={handleRestartGame}
            onStartNewGame={handleStartNewGame}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onNavigate={setCurrentScreen}
            onOpenContrastAudit={() => setIsContrastModalOpen(true)}
          />
        )}

        {currentScreen === 'daily' && (
          <DailyScreen
            onStartDailyGame={handleStartDailyGame}
            onNavigate={setCurrentScreen}
            streak={playerStats.currentStreak}
          />
        )}

        {currentScreen === 'capture' && (
          <CaptureScreen
            onStartCustomGame={handleStartCustomGame}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'history' && (
          <HistoryScreen
            history={history}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'stats' && (
          <StatisticsScreen
            stats={playerStats}
            onResetStats={handleResetStats}
            onNavigate={setCurrentScreen}
          />
        )}
      </main>

      {/* Contrast & Readability Modal */}
      <ContrastAuditModal
        isOpen={isContrastModalOpen}
        onClose={() => setIsContrastModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
