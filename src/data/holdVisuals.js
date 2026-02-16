/**
 * Maps hold type (Mono, Dou, Tree, Full) to CSS shape class.
 * Rendered as pure CSS: Mono=circle, Dou/Tree/Full=rectangles (Dou < Tree < Full).
 */
const HOLD_TYPE_SHAPES = {
  Mono: 'mono',
  Dou: 'dou',
  Tree: 'tree',
  Full: 'full',
};

/**
 * @param {string} holdType - 'Mono' | 'Dou' | 'Tree' | 'Full'
 * @param {string} [boardId] - Board id. Reserved for per-board overrides.
 * @returns {{ shape: string }} - CSS shape key for .hold-shape--{shape}
 */
export function getHoldVisual(holdType, boardId = 'tavor') {
  const shape = HOLD_TYPE_SHAPES[holdType] || 'full';
  return { shape };
}
