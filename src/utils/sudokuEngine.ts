import { BoardMatrix, CellData, Difficulty, LogicStep } from '../types/sudoku';

// Simple seeded PRNG for reproducible daily puzzles
export function seededRandom(seedStr: string): () => number {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// Deep clone 9x9 grid
export function cloneGrid(grid: number[][]): number[][] {
  return grid.map(row => [...row]);
}

// Check if placing num at (row, col) is valid
export function isValid(grid: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num && i !== col) return false;
    if (grid[i][col] === num && i !== row) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const curR = startRow + r;
      const curC = startCol + c;
      if (grid[curR][curC] === num && (curR !== row || curC !== col)) {
        return false;
      }
    }
  }
  return true;
}

// Backtracking solver
export function solveSudoku(grid: number[][], randomFn: () => number = Math.random): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        // Shuffle numbers 1-9
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => randomFn() - 0.5);
        for (const num of nums) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid, randomFn)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Count solutions up to 2 (to check uniqueness)
export function countSolutions(grid: number[][], count = { value: 0 }): number {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            countSolutions(grid, count);
            grid[row][col] = 0;
            if (count.value >= 2) return count.value;
          }
        }
        return count.value;
      }
    }
  }
  count.value++;
  return count.value;
}

// Generate complete valid board
export function generateFullBoard(randomFn: () => number = Math.random): number[][] {
  const board: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  solveSudoku(board, randomFn);
  return board;
}

// Clue counts per difficulty
const CLUES_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 38,
  medium: 32,
  hard: 28,
  expert: 24,
};

// Generate puzzle with specified difficulty
export function generatePuzzle(
  difficulty: Difficulty,
  seed?: string
): { puzzle: number[][]; solution: number[][] } {
  const rand = seed ? seededRandom(seed) : Math.random;
  const solution = generateFullBoard(rand);
  const puzzle = cloneGrid(solution);

  const targetClues = CLUES_BY_DIFFICULTY[difficulty];
  const cellsToRemove = 81 - targetClues;

  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  positions.sort(() => rand() - 0.5);

  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= cellsToRemove) break;
    const temp = puzzle[r][c];
    puzzle[r][c] = 0;

    // Check if puzzle still has unique solution
    const testGrid = cloneGrid(puzzle);
    const solCount = countSolutions(testGrid, { value: 0 });
    if (solCount !== 1) {
      // Put it back
      puzzle[r][c] = temp;
    } else {
      removed++;
    }
  }

  return { puzzle, solution };
}

// Convert 2D number grid into BoardMatrix
export function createBoardMatrix(puzzle: number[][]): BoardMatrix {
  return puzzle.map((row, r) =>
    row.map((val, c) => ({
      row: r,
      col: c,
      value: val,
      given: val !== 0,
      notes: [],
      error: false,
    }))
  );
}

// Calculate all possible candidates for empty cells
export function calculateCandidates(board: BoardMatrix): number[][][] {
  const currentGrid = board.map(row => row.map(cell => cell.value));
  const candidates: number[][][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => [])
  );

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c] === 0) {
        const cellCandidates: number[] = [];
        for (let num = 1; num <= 9; num++) {
          if (isValid(currentGrid, r, c, num)) {
            cellCandidates.push(num);
          }
        }
        candidates[r][c] = cellCandidates;
      }
    }
  }

  return candidates;
}

// Intelligent Logic Deductions Engine
export function findNextLogicStep(
  board: BoardMatrix,
  solution?: number[][]
): LogicStep | null {
  const currentGrid = board.map(row => row.map(cell => cell.value));
  const candidates = calculateCandidates(board);

  // 1. TECHNIQUE: Naked Single (Cell has exactly 1 valid candidate)
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c] === 0 && candidates[r][c].length === 1) {
        const val = candidates[r][c][0];
        const rowName = `Row ${r + 1}`;
        const colName = `Col ${c + 1}`;
        const boxName = `Box ${Math.floor(r / 3) * 3 + Math.floor(c / 3) + 1}`;

        return {
          technique: 'Naked Single',
          targetCell: { row: r, col: c },
          targetValue: val,
          action: 'place',
          involvedCells: [{ row: r, col: c, type: 'focus' }],
          involvedCandidates: [val],
          explanation: `In ${rowName}, ${colName}, candidate ${val} is the only remaining valid number.`,
          whyItWorks: `All other numbers from 1 to 9 already appear in either ${rowName}, ${colName}, or ${boxName}.`,
          whatToDo: `Enter number ${val} into cell (${r + 1}, ${c + 1}).`,
        };
      }
    }
  }

  // 2. TECHNIQUE: Hidden Single in Row
  for (let r = 0; r < 9; r++) {
    for (let num = 1; num <= 9; num++) {
      // Check if num is already in this row
      if (currentGrid[r].includes(num)) continue;
      const possibleCols: number[] = [];
      for (let c = 0; c < 9; c++) {
        if (currentGrid[r][c] === 0 && candidates[r][c].includes(num)) {
          possibleCols.push(c);
        }
      }
      if (possibleCols.length === 1) {
        const c = possibleCols[0];
        return {
          technique: 'Hidden Single in Row',
          targetCell: { row: r, col: c },
          targetValue: num,
          action: 'place',
          involvedCells: [
            { row: r, col: c, type: 'focus' },
            ...Array.from({ length: 9 }, (_, colIdx) => ({
              row: r,
              col: colIdx,
              type: (colIdx === c ? 'focus' : 'reference') as 'focus' | 'reference',
            })),
          ],
          involvedCandidates: [num],
          explanation: `In Row ${r + 1}, number ${num} can only be placed in Column ${c + 1}.`,
          whyItWorks: `Even though cell (${r + 1}, ${c + 1}) may have other pencil notes, no other empty cell in Row ${r + 1} can accept ${num}.`,
          whatToDo: `Place number ${num} in Row ${r + 1}, Column ${c + 1}.`,
        };
      }
    }
  }

  // 3. TECHNIQUE: Hidden Single in Column
  for (let c = 0; c < 9; c++) {
    for (let num = 1; num <= 9; num++) {
      const colValues = currentGrid.map(row => row[c]);
      if (colValues.includes(num)) continue;
      const possibleRows: number[] = [];
      for (let r = 0; r < 9; r++) {
        if (currentGrid[r][c] === 0 && candidates[r][c].includes(num)) {
          possibleRows.push(r);
        }
      }
      if (possibleRows.length === 1) {
        const r = possibleRows[0];
        return {
          technique: 'Hidden Single in Column',
          targetCell: { row: r, col: c },
          targetValue: num,
          action: 'place',
          involvedCells: [
            { row: r, col: c, type: 'focus' },
            ...Array.from({ length: 9 }, (_, rowIdx) => ({
              row: rowIdx,
              col: c,
              type: (rowIdx === r ? 'focus' : 'reference') as 'focus' | 'reference',
            })),
          ],
          involvedCandidates: [num],
          explanation: `In Column ${c + 1}, number ${num} can only be placed in Row ${r + 1}.`,
          whyItWorks: `No other cell in Column ${c + 1} can hold ${num} without conflicting with existing numbers.`,
          whatToDo: `Place number ${num} in Row ${r + 1}, Column ${c + 1}.`,
        };
      }
    }
  }

  // 4. TECHNIQUE: Hidden Single in 3x3 Block
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const startR = boxRow * 3;
      const startC = boxCol * 3;
      const boxNum = boxRow * 3 + boxCol + 1;

      for (let num = 1; num <= 9; num++) {
        let boxHasNum = false;
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            if (currentGrid[startR + r][startC + c] === num) {
              boxHasNum = true;
              break;
            }
          }
          if (boxHasNum) break;
        }
        if (boxHasNum) continue;

        const possibleCells: [number, number][] = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const curR = startR + r;
            const curC = startC + c;
            if (currentGrid[curR][curC] === 0 && candidates[curR][curC].includes(num)) {
              possibleCells.push([curR, curC]);
            }
          }
        }

        if (possibleCells.length === 1) {
          const [r, c] = possibleCells[0];
          const boxCells: { row: number; col: number; type: 'focus' | 'reference' }[] = [];
          for (let br = 0; br < 3; br++) {
            for (let bc = 0; bc < 3; bc++) {
              const curR = startR + br;
              const curC = startC + bc;
              boxCells.push({
                row: curR,
                col: curC,
                type: curR === r && curC === c ? 'focus' : 'reference',
              });
            }
          }

          return {
            technique: 'Hidden Single in 3x3 Block',
            targetCell: { row: r, col: c },
            targetValue: num,
            action: 'place',
            involvedCells: boxCells,
            involvedCandidates: [num],
            explanation: `Within Box ${boxNum}, number ${num} can only be placed at (${r + 1}, ${c + 1}).`,
            whyItWorks: `All other positions inside this 3x3 block are either filled or blocked by row/column conflicts.`,
            whatToDo: `Enter number ${num} in Row ${r + 1}, Column ${c + 1}.`,
          };
        }
      }
    }
  }

  // 5. TECHNIQUE: Naked Pair in Row or Block
  for (let r = 0; r < 9; r++) {
    const pairCells: number[] = [];
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c] === 0 && candidates[r][c].length === 2) {
        pairCells.push(c);
      }
    }
    for (let i = 0; i < pairCells.length; i++) {
      for (let j = i + 1; j < pairCells.length; j++) {
        const c1 = pairCells[i];
        const c2 = pairCells[j];
        const cand1 = candidates[r][c1];
        const cand2 = candidates[r][c2];
        if (cand1[0] === cand2[0] && cand1[1] === cand2[1]) {
          // Check if any other cell in row has either candidate
          const toEliminate: { row: number; col: number; value: number }[] = [];
          for (let c = 0; c < 9; c++) {
            if (c !== c1 && c !== c2 && currentGrid[r][c] === 0) {
              if (candidates[r][c].includes(cand1[0])) {
                toEliminate.push({ row: r, col: c, value: cand1[0] });
              }
              if (candidates[r][c].includes(cand1[1])) {
                toEliminate.push({ row: r, col: c, value: cand1[1] });
              }
            }
          }
          if (toEliminate.length > 0) {
            return {
              technique: 'Naked Pair in Row',
              targetCell: { row: r, col: c1 },
              action: 'eliminate',
              eliminatedCandidates: toEliminate,
              involvedCells: [
                { row: r, col: c1, type: 'focus' },
                { row: r, col: c2, type: 'focus' },
                ...toEliminate.map(e => ({ row: e.row, col: e.col, type: 'elimination' as const })),
              ],
              involvedCandidates: [cand1[0], cand1[1]],
              explanation: `Cells (${r + 1}, ${c1 + 1}) and (${r + 1}, ${c2 + 1}) both contain only candidates [${cand1.join(', ')}].`,
              whyItWorks: `Because these two cells must hold ${cand1[0]} and ${cand1[1]}, neither of those numbers can appear elsewhere in Row ${r + 1}.`,
              whatToDo: `Eliminate candidates ${cand1.join(' & ')} from other cells in Row ${r + 1}.`,
            };
          }
        }
      }
    }
  }

  // 6. Fallback: Use solution to provide accurate logical hint
  if (solution) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentGrid[r][c] === 0) {
          const val = solution[r][c];
          return {
            technique: 'Logical Deduction',
            targetCell: { row: r, col: c },
            targetValue: val,
            action: 'place',
            involvedCells: [{ row: r, col: c, type: 'focus' }],
            involvedCandidates: [val],
            explanation: `Based on full board constraints, cell (${r + 1}, ${c + 1}) must be ${val}.`,
            whyItWorks: `Placing any other number in this cell results in an unavoidable contradiction down the line.`,
            whatToDo: `Place number ${val} in Row ${r + 1}, Column ${c + 1}.`,
          };
        }
      }
    }
  }

  return null;
}

// Check mistakes on current board
export function findBoardMistakes(board: BoardMatrix, solution?: number[][]): { row: number; col: number }[] {
  const mistakes: { row: number; col: number }[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = board[r][c];
      if (!cell.given && cell.value !== 0) {
        if (solution && cell.value !== solution[r][c]) {
          mistakes.push({ row: r, col: c });
        } else if (!solution) {
          // Check conflict with peers
          const currentGrid = board.map(row => row.map(c => c.value));
          if (!isValid(currentGrid, r, c, cell.value)) {
            mistakes.push({ row: r, col: c });
          }
        }
      }
    }
  }
  return mistakes;
}

// Check if board is completely and correctly solved
export function isBoardSolved(board: BoardMatrix, solution: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c].value !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
}

// Unit Completion Tracking (Rows, Columns, 3x3 Boxes)
export interface UnitCompletionStatus {
  completedRows: boolean[];
  completedCols: boolean[];
  completedBoxes: boolean[];
}

export function getUnitCompletionStatus(board: BoardMatrix, solution?: number[][]): UnitCompletionStatus {
  const status: UnitCompletionStatus = {
    completedRows: Array(9).fill(false),
    completedCols: Array(9).fill(false),
    completedBoxes: Array(9).fill(false),
  };

  // Check rows
  for (let r = 0; r < 9; r++) {
    const vals = board[r].map(c => c.value);
    const isFull = vals.every(v => v >= 1 && v <= 9);
    if (isFull) {
      const correct = solution ? vals.every((v, idx) => v === solution[r][idx]) : new Set(vals).size === 9;
      if (correct) status.completedRows[r] = true;
    }
  }

  // Check cols
  for (let c = 0; c < 9; c++) {
    const vals = board.map(r => r[c].value);
    const isFull = vals.every(v => v >= 1 && v <= 9);
    if (isFull) {
      const correct = solution ? vals.every((v, rIdx) => v === solution[rIdx][c]) : new Set(vals).size === 9;
      if (correct) status.completedCols[c] = true;
    }
  }

  // Check boxes
  for (let b = 0; b < 9; b++) {
    const startR = Math.floor(b / 3) * 3;
    const startC = (b % 3) * 3;
    const vals: number[] = [];
    let correct = true;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const val = board[startR + r][startC + c].value;
        vals.push(val);
        if (solution && val !== solution[startR + r][startC + c]) {
          correct = false;
        }
      }
    }
    const isFull = vals.every(v => v >= 1 && v <= 9);
    if (isFull && (solution ? correct : new Set(vals).size === 9)) {
      status.completedBoxes[b] = true;
    }
  }

  return status;
}

export const checkUnitCompletion = getUnitCompletionStatus;

export interface NewlyCompletedUnits {
  count: number;
  newRows: number[];
  newCols: number[];
  newBoxes: number[];
  highlightCells: { row: number; col: number }[];
}

export function detectNewlyCompletedUnits(
  prevStatus: UnitCompletionStatus,
  newStatus: UnitCompletionStatus
): NewlyCompletedUnits {
  const newRows: number[] = [];
  const newCols: number[] = [];
  const newBoxes: number[] = [];
  const highlightCells: { row: number; col: number }[] = [];

  for (let i = 0; i < 9; i++) {
    if (!prevStatus.completedRows[i] && newStatus.completedRows[i]) {
      newRows.push(i);
      for (let c = 0; c < 9; c++) {
        highlightCells.push({ row: i, col: c });
      }
    }
    if (!prevStatus.completedCols[i] && newStatus.completedCols[i]) {
      newCols.push(i);
      for (let r = 0; r < 9; r++) {
        highlightCells.push({ row: r, col: i });
      }
    }
    if (!prevStatus.completedBoxes[i] && newStatus.completedBoxes[i]) {
      newBoxes.push(i);
      const startR = Math.floor(i / 3) * 3;
      const startC = (i % 3) * 3;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          highlightCells.push({ row: startR + r, col: startC + c });
        }
      }
    }
  }

  return {
    count: newRows.length + newCols.length + newBoxes.length,
    newRows,
    newCols,
    newBoxes,
    highlightCells,
  };
}

// Count how many times each number 1-9 is currently placed
export function countPlacedDigits(board: BoardMatrix): Record<number, number> {
  const counts: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  };
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c].value;
      if (val >= 1 && val <= 9) {
        counts[val] = (counts[val] || 0) + 1;
      }
    }
  }
  return counts;
}
