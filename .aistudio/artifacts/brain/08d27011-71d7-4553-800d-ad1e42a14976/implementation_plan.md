# Implementation Plan: Critical Error Buzz & 2-Second Long-Press Notes Popup

## Proposed Changes

### 1. Audio Engine: Critical Error Buzz
- **Module**: `src/utils/audio.ts`
- Enhance `playErrorSound` (and introduce `playCriticalErrorBuzz`) to generate an unmistakable, deep, harsh dual-oscillator buzz using Web Audio API:
  - Dual detuned sawtooth waves (e.g. 115 Hz and 122 Hz) generating acoustic discordant beating.
  - Waveshaper / soft distortion drive and low-pass filter to produce an assertive, mechanical error buzzer tone.
  - Assertive gain envelope (240ms duration) that cuts through immediately upon entering an incorrect digit.
  - Pair with a heavy multi-pulse tactile vibration (`[100ms buzz, 50ms pause, 150ms buzz]`) when haptics are enabled.
- Verify invocation in `GameScreen.tsx` whenever an input violates Sudoku validity or triggers a mistake counter.

---

### 2. SudokuBoard: 2-Second Long-Press Detection & Visual Progress
- **Module**: `src/components/sudoku/SudokuBoard.tsx`
- Implement pointer/touch long-press handling on empty cells:
  - Track pointer interaction via `onPointerDown`, `onPointerUp`, `onPointerMove`, and `onPointerCancel`.
  - Condition: only activate when the cell is empty (`cell.value === 0`).
  - Timer: exactly 2,000ms duration.
  - **Circular Progress Indicator**: As the user holds the cell, render a smooth animated circular SVG progress ring or border-inset perimeter indicator that fills 0% to 100% over the 2 seconds.
  - If the user moves their finger/pointer beyond a 10px threshold or releases before 2,000ms, cancel the timer and progress animation gracefully (falling back to standard single-tap cell selection).
  - When 2,000ms completes:
    - Trigger a distinct haptic pulse.
    - Measure the cell's viewport bounding rect (`getBoundingClientRect()`).
    - Open the 3x3 Notes popup at the calculated coordinates.

---

### 3. Notes 3x3 Matrix Popup Component
- **New Component**: `src/components/sudoku/CellNotesPopup.tsx`
- **Layout & Aesthetics**:
  - Renders a floating 3×3 matrix representing numbers 1 through 9 with distinct grid border lines, styled to match the Sudoku grid's architectural design.
  - Each digit button displays active state (highlighted accent background + bold digit if the note already exists in the cell; neutral background if not).
  - High contrast WCAG 2.2 AA compliant tokens for both Light and Dark themes.
- **Viewport Boundary Collision Detection**:
  - Automatically calculates optimal position (anchored above or below the pressed cell based on available viewport height).
  - Enforces strict horizontal screen boundaries: `Math.max(16, Math.min(window.innerWidth - popupWidth - 16, targetX))`.
  - Prevents clipping, overflow, or off-screen hiding on all phone screens (360px–430px) and tablets/desktops.
  - Includes a backdrop touch-dismiss layer and Escape key handler.
- **Selection & Immediate Board Update**:
  - When the user taps any number 1–9:
    - Immediately closes the popup (as confirmed in design options).
    - Toggles that number in the selected cell's `notes` array (adds if absent, removes if present).
    - Plays the note entry audio cue and subtle haptic feedback.
    - Updates active game state immediately on the board.

---

### 4. Game Screen Integration & Move History
- **Module**: `src/components/screens/GameScreen.tsx`
- Connect `onToggleCellNote(row, col, num)` handler to the active game board:
  - Update `cell.notes` immutably.
  - Append to `moveHistory` for full Undo/Redo capability.
  - Update local storage persistence automatically.
- Wire error buzzer trigger to invalid number entries across all mistake handling modes (`three`, `unlimited`).

---

## Verification Plan

### Automated Verification
- Run `npm run build` / `compile_applet` to ensure full TypeScript type compliance and pristine bundling.
- Run `npm run lint` / `lint_applet` to verify no import, syntax, or formatting issues.

### Manual Verification
1. **Critical Error Buzz**:
   - Start an Easy or Medium game.
   - Enter an incorrect number in an empty cell.
   - Verify the deep, harsh buzzer tone plays instantly and heavy haptic vibration triggers.
2. **2-Second Long-Press on Empty Cell**:
   - Press and hold an empty cell for 2 seconds.
   - Observe the circular progress indicator filling smoothly around the cell over the 2 seconds.
   - Verify that releasing early (<2s) cancels cleanly and just selects the cell.
3. **Notes Popup Positioning & Safe Boundaries**:
   - Test long-pressing cells at column 0 (left edge), column 8 (right edge), row 0 (top edge), and row 8 (bottom edge).
   - Verify the popup never extends beyond left or right screen boundaries or clips outside the viewport.
4. **Note Toggle & Immediate Update**:
   - Tap a number (e.g. 5) in the popup.
   - Verify popup closes immediately.
   - Verify note 5 appears inside the cell's 3x3 pencil mark display on the board.
   - Long-press the same cell again and tap 5: verify note 5 is removed.
