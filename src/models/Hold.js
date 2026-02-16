/** Hold type enum: Mono (1 finger), Dou (2), Tree (3), Full (4–5) */
export const HOLD_TYPES = ['Mono', 'Dou', 'Tree', 'Full'];

/**
 * Represents a single hold on a fingerboard.
 * @typedef {Object} HoldPosition - All values 0–100 (percent of container).
 * @property {number} x - Horizontal position from left (%).
 * @property {number} y - Vertical position from top (%).
 * @property {number} width - Width (%).
 * @property {number} height - Height (%).
 *
 * @typedef {Object} HoldData
 * @property {number} index - Position index on the board (0-based).
 * @property {number} difficulty - Ease of the hold (1 = hardest, 10 = easiest).
 * @property {HoldPosition} [position] - Layout position (x, y, width, height as %).
 * @property {'Mono'|'Dou'|'Tree'|'Full'} [type] - Hold type (Mono/Dou/Tree/Full).
 */
const DIFFICULTY_MIN = 1;
const DIFFICULTY_MAX = 10;

/** Normalize position: support both {x,y} and legacy {top,left} */
function normalizePosition(pos) {
  if (!pos) return { x: 0, y: 0, width: 10, height: 10 };
  return {
    x: pos.x ?? pos.left ?? 0,
    y: pos.y ?? pos.top ?? 0,
    width: pos.width ?? 10,
    height: pos.height ?? 10,
  };
}

export class Hold {
  /**
   * @param {number} index
   * @param {number} difficulty
   * @param {HoldPosition} [position]
   * @param {'Mono'|'Dou'|'Tree'|'Full'} [type]
   */
  constructor(index, difficulty, position = null, type = 'Full') {
    this._index = Number(index);
    this._difficulty = Math.max(DIFFICULTY_MIN, Math.min(DIFFICULTY_MAX, Number(difficulty)));
    this._position = normalizePosition(position);
    this._type = HOLD_TYPES.includes(type) ? type : 'Full';
  }

  get index() {
    return this._index;
  }

  get difficulty() {
    return this._difficulty;
  }

  /** @returns {HoldPosition} */
  get position() {
    return this._position;
  }

  /** @returns {'Mono'|'Dou'|'Tree'|'Full'} */
  get type() {
    return this._type;
  }

  /** Display id for DOM (e.g. "H1" for index 0) */
  get displayId() {
    return `H${this._index + 1}`;
  }

  /**
   * Create a Hold from a plain object (e.g. from JSON).
   * @param {{ index: number, difficulty: number, position?: HoldPosition, type?: string }} data
   * @returns {Hold}
   */
  static fromData(data) {
    return new Hold(data.index, data.difficulty, data.position, data.type);
  }
}

export { DIFFICULTY_MIN, DIFFICULTY_MAX };
