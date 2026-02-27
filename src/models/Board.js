import { Hold } from './Hold';

/** Default minimum combined difficulty per level (easy/medium/hard) */
const DEFAULT_LEVEL_THRESHOLDS = { easy: 10, medium: 6, hard: 1 };

/**
 * Represents a fingerboard with a set of holds and default start positions.
 */
export class Board {
  /**
   * @param {string} id - Unique board identifier.
   * @param {string} name - Display name.
   * @param {Hold[]} holds - List of holds (ordered by index).
   * @param {number} defaultLeftIndex - Hold index for left hand at session start.
   * @param {number} defaultRightIndex - Hold index for right hand at session start.
   * @param {{ easy?: number, medium?: number, hard?: number }} [levelThresholds] - Min combined difficulty per level.
   * @param {{ width?: number, height?: number }} [dimensions] - Coordinate system for hold positions (default 100×100).
   * @param {number} [crossMoveXThreshold=0] - Min (rightHandX - leftHandX) to accept a hold change; 0 = no filter.
   * @param {string} [indexColor] - CSS color for hold index numbers when dev=true (e.g. '#fff' or 'rgba(0,0,0,0.8)').
   * @param {string} [leftHandColor] - CSS color for left-hand hold marker (e.g. '#16a34a').
   * @param {string} [rightHandColor] - CSS color for right-hand hold marker (e.g. '#2563eb').
   */
  constructor(id, name, holds, defaultLeftIndex, defaultRightIndex, levelThresholds = {}, dimensions = {}, dev = true, crossMoveXThreshold = 0, indexColor = null, leftHandColor = null, rightHandColor = null) {
    this._id = id;
    this._name = name;
    this._holds = holds;
    this._dev = Boolean(dev);
    this._defaultLeftIndex = defaultLeftIndex;
    this._defaultRightIndex = defaultRightIndex;
    this._thresholds = { ...DEFAULT_LEVEL_THRESHOLDS, ...levelThresholds };
    this._baseWidth = dimensions.base_width ?? 20;
    this._baseHeight = dimensions.base_height ?? 20;
    this._aspectRatio = dimensions.aspect_ratio ?? 1.5;
    const n = Number(crossMoveXThreshold);
    this._crossMoveXThreshold = (crossMoveXThreshold != null && !Number.isNaN(n)) ? n : 0;
    this._indexColor = indexColor && String(indexColor).trim() ? String(indexColor).trim() : null;
    this._leftHandColor = leftHandColor && String(leftHandColor).trim() ? String(leftHandColor).trim() : null;
    this._rightHandColor = rightHandColor && String(rightHandColor).trim() ? String(rightHandColor).trim() : null;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  /** @returns {Hold[]} */
  get holds() {
    return this._holds;
  }

  get defaultLeftIndex() {
    return this._defaultLeftIndex;
  }

  get defaultRightIndex() {
    return this._defaultRightIndex;
  }

  get holdCount() {
    return this._holds.length;
  }

  /** Base for horizontal axis – hold x and width are multipliers of this. */
  get baseWidth() {
    return this._baseWidth;
  }

  /** Base for vertical axis – hold y and height are multipliers of this. */
  get baseHeight() {
    return this._baseHeight;
  }

  /** Image aspect ratio (width/height) – keeps holds aligned with the board photo across screen sizes. */
  get aspectRatio() {
    return this._aspectRatio;
  }

  /** Dev mode: when true, all holds visible; when false, only active holds during climb. */
  get dev() {
    return this._dev;
  }

  /**
   * Convert hold position to CSS percentage values.
   * Hold x, width are multipliers of base_width; y, height are multipliers of base_height.
   * @param {{ x: number, y: number, width: number, height: number }} pos
   * @returns {{ top: string, left: string, width: string, height: string }}
   */
  positionToPercent(pos) {
    const bw = this._baseWidth;
    const bh = this._baseHeight;
    return {
      top: `${(pos.y / bh) * 100}%`,
      left: `${(pos.x / bw) * 100}%`,
      width: `${(pos.width / bw) * 100}%`,
      height: `${(pos.height / bh) * 100}%`,
    };
  }

  /**
   * @param {number} index - Hold index (0-based).
   * @returns {Hold|null}
   */
  getHoldByIndex(index) {
    return this._holds.find((h) => h.index === index) ?? null;
  }

  /**
   * Get the minimum combined difficulty required for a given level (1=easy, 2=medium, 3=hard).
   * @param {number} level
   * @returns {number}
   */
  getMinScoreForLevel(level) {
    const key = level === 1 ? 'easy' : level === 2 ? 'medium' : 'hard';
    return this._thresholds[key] ?? 1;
  }

  /** Min (rightHandX - leftHandX) to accept a hold change; 0 = no filter. */
  get crossMoveXThreshold() {
    return this._crossMoveXThreshold;
  }

  /** CSS color for hold index numbers when dev=true; null = use default. */
  get indexColor() {
    return this._indexColor;
  }

  /** CSS color for left-hand hold marker; null = use default. */
  get leftHandColor() {
    return this._leftHandColor;
  }

  /** CSS color for right-hand hold marker; null = use default. */
  get rightHandColor() {
    return this._rightHandColor;
  }

  /** @returns {Hold} */
  getDefaultLeftHold() {
    return this.getHoldByIndex(this._defaultLeftIndex);
  }

  /** @returns {Hold} */
  getDefaultRightHold() {
    return this.getHoldByIndex(this._defaultRightIndex);
  }

  /**
   * Get effective difficulty for the default start holds at the given level
   * (used so Easy start is “full” easy, etc.).
   */
  getStartDifficultyForLevel(level) {
    const min = this.getMinScoreForLevel(level);
    return Math.min(10, min);
  }

  /**
   * Create a Board from a plain object (e.g. from JSON).
   * @param {{ id: string, name: string, holds: { index: number, difficulty: number }[], defaultLeftIndex: number, defaultRightIndex: number, levelThresholds?: object }} data
   * @returns {Board}
   */
  static fromData(data) {
    const holds = (data.holds || []).map((h) => Hold.fromData(h));
    const dimensions = { base_width: data.base_width, base_height: data.base_height, aspect_ratio: data.aspect_ratio };
    return new Board(
      data.id,
      data.name,
      holds,
      data.defaultLeftIndex ?? 0,
      data.defaultRightIndex ?? 0,
      data.levelThresholds,
      dimensions,
      data.dev !== false,
      data.cross_move_x_threshold ?? 0,
      data.index_color ?? null,
      data.left_hand_color ?? null,
      data.right_hand_color ?? null
    );
  }
}
