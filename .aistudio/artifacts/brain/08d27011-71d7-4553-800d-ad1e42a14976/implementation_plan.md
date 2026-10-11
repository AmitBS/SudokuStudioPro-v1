# Implementation Plan: Correct Sequential Game Completion Animation (1 to 9)

Correct the Game Completion Sequence so that numbers animate strictly one by one in ascending order (1 through 9) into their respective number buttons below the board, ensuring each number group fully completes its movement before the next begins, and holding the final completion message until all nine numbers finish.

## Proposed Changes

### 1. Robust Sequential Animation Controller (`NumberCelebrationParade.tsx`)
- Refactor the sequence engine to use an explicit, ref-guarded asynchronous state machine:
  - **Sequential Guarding**: Number $N+1$ cannot start until all 9 occurrences of number $N$ have traveled, landed into button $N$, and triggered button $N$'s landing pulse.
  - **Re-render Immunity**: Store active callbacks, canvas animation state, and progress in `useRef` to prevent React re-renders from prematurely interrupting or resetting the sequence.
  - **Motion Trail Preservation**: Keep the visible motion trail ribbons, 4 ghost afterimage echoes, and stardust sparks streaming behind each traveling number throughout its flight.
  - **Flight Timing**:
    - Lift: 280ms (all 9 instances lift upward with luminous aura).
    - Slow Travel: 850ms (graceful Bézier flight across the screen into button $N$).
    - Land & React: 150ms (button $N$ pulses with primary glow ring, chime sounds, light haptic feedback).
    - Clean hand-off to number $N+1$.

### 2. Board Grid & Keypad Box Synchronization (`SudokuBoard.tsx` & `SudokuControls.tsx`)
- **Board Cell Transitions**:
  - Cells for numbers that haven't animated yet remain fully visible, bold, and clear on the board.
  - When number $N$ lifts and travels, those 9 cells on the board transition cleanly as their numbers take flight into box $N$.
  - Cells for numbers that have already completed remain cleared, visually confirming they have traveled to their box below.
- **Numpad Reaction**:
  - Number box $N$ below the board highlights and receives its 9 numbers, pulsing upon landing.

### 3. Strict Victory Modal Gate (`GameScreen.tsx`)
- Decouple `VictoryModal` from any premature `game.isCompleted` state:
  - The modal will be controlled strictly by `isVictoryModalVisible`, which remains `false` throughout the 1-second board freeze and the entire 1-to-9 parade.
  - Only when number 9 finishes landing into box 9 does `handleNumberParadeComplete` trigger, opening the Victory Modal and saving completion statistics.
  - Also route hint-based puzzle completions through this exact same sequence for consistency.

---

## Verification Plan

### Automated Verification
- Run `npm run build` to verify clean production compilation and Android asset synchronization.
- Run `compile_applet` and `lint_applet` to ensure zero TypeScript, import, or syntax errors.

### Manual Verification
1. **1-Second Board Freeze**:
   - Complete a puzzle by placing the final number.
   - Verify the completed matrix is visible intact for 1.0 second.
2. **Sequential 1-to-9 Flight Order**:
   - Verify number 1 starts first: all nine 1s lift up and slowly fly down into box 1 with motion trails.
   - Verify number 2 does NOT start until all nine 1s have landed into box 1.
   - Verify numbers 2, 3, 4, 5, 6, 7, 8, 9 execute sequentially in exact numerical order.
3. **Completion Modal Delay**:
   - Confirm the Victory Modal does NOT appear during the animation.
   - Confirm the Victory Modal only displays after number 9 finishes landing into box 9.
