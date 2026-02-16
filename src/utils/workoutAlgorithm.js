/**
 * Pure hold-randomizer logic for a workout session.
 * Given current state, picks a random valid hold change (or no change) for the next tick.
 */

/**
 * @typedef {Object} HoldState
 * @property {number} leftIndex
 * @property {number} rightIndex
 * @property {number} leftDifficulty
 * @property {number} rightDifficulty
 * @property {number} prob
 */

/**
 * Compute the next hold state after one tick (e.g. every 4 seconds).
 * Either one hand changes to a random valid hold, or no change (rest tick).
 *
 * @param {import('../models/Board').Board} board
 * @param {number} level - 1=easy, 2=medium, 3=hard
 * @param {HoldState} state - Current left/right indices, difficulties, and side bias
 * @returns {{ leftIndex: number, rightIndex: number, leftDifficulty: number, rightDifficulty: number, prob: number, changed: boolean }}
 */
export function computeNextHoldChange(board, level, state) {
  const holdCount = board.holdCount;
  const minScore = board.getMinScoreForLevel(level);
  const { leftIndex, rightIndex, leftDifficulty, rightDifficulty, prob } = state;

  const maxAttempts = holdCount * 2;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const holdIndex = Math.floor(Math.random() * holdCount);
    const side = Math.random();

    if (holdIndex === leftIndex || holdIndex === rightIndex) {
      return { ...state, changed: false };
    }

    const hold = board.getHoldByIndex(holdIndex);
    if (!hold) continue;

    const newDifficulty = hold.difficulty;

    if (prob + side < 0.5) {
      if (newDifficulty + leftDifficulty >= minScore) {
        return {
          leftIndex,
          rightIndex: holdIndex,
          leftDifficulty,
          rightDifficulty: newDifficulty,
          prob: 0.5,
          changed: true,
        };
      }
    } else {
      if (newDifficulty + rightDifficulty >= minScore) {
        return {
          leftIndex: holdIndex,
          rightIndex,
          leftDifficulty: newDifficulty,
          rightDifficulty,
          prob: -0.5,
          changed: true,
        };
      }
    }
  }

  return { ...state, changed: false };
}

/**
 * Build initial hold state for the start of a session.
 *
 * @param {import('../models/Board').Board} board
 * @param {number} level - 1=easy, 2=medium, 3=hard
 * @returns {HoldState}
 */
export function getInitialHoldState(board, level) {
  const left = board.getDefaultLeftHold();
  const right = board.getDefaultRightHold();
  const startDifficulty = board.getStartDifficultyForLevel(level);
  return {
    leftIndex: left ? left.index : 0,
    rightIndex: right ? right.index : 0,
    leftDifficulty: left ? startDifficulty : 0,
    rightDifficulty: right ? startDifficulty : 0,
    prob: 0,
  };
}
