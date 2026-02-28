/**
 * Pure hold-randomizer logic for a workout session.
 * Given current state, picks a random valid hold change (or no change) for the next tick.
 */

/**
 * @param {Object} params
 * @param {number} params.holdIndex
 * @param {number} params.leftIndex
 * @param {number} params.rightIndex
 * @param {import('../models/Hold').Hold} params.newHold
 * @param {number} params.newDifficulty
 * @param {boolean} params.isRightChange
 * @param {import('../models/Hold').Hold} params.leftHold
 * @param {import('../models/Hold').Hold} params.rightHold
 * @param {number} params.leftDifficulty
 * @param {number} params.rightDifficulty
 * @param {number} params.minScore
 * @param {number} params.crossMoveXThreshold
 * @param {boolean} params.crossEvent
 * @returns {boolean}
 */
function isEligibleToReplaceHold({
  holdIndex,
  leftIndex,
  rightIndex,
  newHold,
  newDifficulty,
  isRightChange,
  leftHold,
  rightHold,
  leftDifficulty,
  rightDifficulty,
  minScore,
  crossMoveXThreshold,
  crossEvent,
}) {
  if (holdIndex === leftIndex || holdIndex === rightIndex) {
    // console.log('[results] hold rejected - same index');
    return false;
  }
  const xDiff = isRightChange
    ? (newHold.position?.x ?? 0) - (leftHold?.position?.x ?? 0)
    : (rightHold?.position?.x ?? 0) - (newHold.position?.x ?? 0);
  const combinedDifficulty = isRightChange
    ? newDifficulty + leftDifficulty
    : newDifficulty + rightDifficulty;

  if (combinedDifficulty < minScore) 
    // console.log('reject hold - combined difficulty too hard');
    return false;
  if (xDiff < crossMoveXThreshold) {
    // console.log('reject hold - cross too long');
    return false;
  }
  if (crossEvent && xDiff < 0) {
    // console.log('reject hold - cross event');
    return false;
  }
  return true;
}

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
  const crossMoveXThreshold = board.crossMoveXThreshold ?? 0;
  const { leftIndex, rightIndex, leftDifficulty, rightDifficulty, prob } = state;
  const leftHold = board.getHoldByIndex(leftIndex);
  const rightHold = board.getHoldByIndex(rightIndex);
  var current_xDiff = (rightHold?.position?.x) - (leftHold?.position?.x);
  var cross_event = current_xDiff < 0;
  const maxAttempts = holdCount * 2;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const holdIndex = Math.floor(Math.random() * holdCount);
    const side = Math.random();
    const newHold = board.getHoldByIndex(holdIndex);
    if (!newHold) continue;

    const isRightChange = prob + side < 0.5;
    if (!isEligibleToReplaceHold({
      holdIndex,
      leftIndex,
      rightIndex,
      newHold,
      newDifficulty: newHold.difficulty,
      isRightChange,
      leftHold,
      rightHold,
      leftDifficulty,
      rightDifficulty,
      minScore,
      crossMoveXThreshold,
      crossEvent: cross_event,
    })) continue;

    const newDifficulty = newHold.difficulty;
    return {
      leftIndex: isRightChange ? leftIndex : holdIndex,
      rightIndex: isRightChange ? holdIndex : rightIndex,
      leftDifficulty: isRightChange ? leftDifficulty : newDifficulty,
      rightDifficulty: isRightChange ? newDifficulty : rightDifficulty,
      prob: isRightChange ? 0.5 : -0.5,
      changed: true,
    };
  }
  // console.log('no hold found switching hands');
  return {
    leftIndex,
    rightIndex,
    leftDifficulty,
    rightDifficulty,
    prob:  prob*-1,
    changed: false,
  };
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
