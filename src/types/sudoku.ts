export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type ThemeMode = 'system' | 'light' | 'dark';

export type AccentColor = 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan';

export type MistakesMode = 'three' | 'unlimited' | 'off';

export type HintsMode = 'logic' | 'direct';

export type Screen = 'home' | 'game' | 'settings' | 'daily' | 'capture' | 'history' | 'stats';

export interface CellData {
  row: number;
  col: number;
  value: number; // 0 for empty, 1-9 for filled
  given: boolean; // Part of initial puzzle
  notes: number[]; // Pencil marks (1-9)
  error?: boolean; // Conflicting or invalid
}

export type BoardMatrix = CellData[][];

export interface MoveRecord {
  row: number;
  col: number;
  prevValue: number;
  newValue: number;
  prevNotes: number[];
  newNotes: number[];
  isNoteMove: boolean;
}

export interface LogicStep {
  technique: string;
  targetCell: { row: number; col: number };
  targetValue?: number;
  action: 'place' | 'eliminate';
  eliminatedCandidates?: { row: number; col: number; value: number }[];
  involvedCells: { row: number; col: number; type?: 'focus' | 'reference' | 'elimination' }[];
  involvedCandidates: number[];
  explanation: string;
  whyItWorks: string;
  whatToDo: string;
}

export interface GameSettings {
  autoNotes: boolean;
  highlightSameNumbers: boolean;
  highlightRowColBlock: boolean;
  mistakesMode: MistakesMode;
  autoAdvance: boolean;
  hintsMode: HintsMode;
  confirmNewGame: boolean;
  themeMode: ThemeMode;
  accentColor: AccentColor;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export interface ActiveGame {
  id: string;
  difficulty: Difficulty;
  isDaily?: boolean;
  dailyDate?: string;
  board: BoardMatrix;
  initialBoard: number[][];
  solution: number[][];
  elapsedSeconds: number;
  mistakes: number;
  hintsUsed: number;
  logicHintsUsed: number;
  isPaused: boolean;
  isCompleted: boolean;
  isGameOver: boolean;
  score: number;
  startTime: number;
  moveHistory: MoveRecord[];
}

export interface DifficultyStats {
  played: number;
  won: number;
  bestTimeSeconds: number | null;
  totalTimeSeconds: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string | null;
  byDifficulty: Record<Difficulty, DifficultyStats>;
}

export interface GameHistoryItem {
  id: string;
  date: string;
  difficulty: Difficulty;
  isDaily: boolean;
  durationSeconds: number;
  mistakes: number;
  hintsUsed: number;
  won: boolean;
  score: number;
}

export interface DailyChallengeInfo {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  difficulty: Difficulty;
  completed: boolean;
  timeSeconds?: number;
  score?: number;
}
