/**
 * Board image assets (one per board). Images live in MEDIA/Boards/.
 */
const BOARDS_MEDIA = '/MEDIA/Boards';

/** @type {{ [boardId: string]: string }} - board id -> image path */
export const BOARD_IMAGES = {
  tavor: `${BOARDS_MEDIA}/TavorClimbingBoard.png`,
  beastmaker1000: `${BOARDS_MEDIA}/BeastMaker1000Board.png`,
  beastmaker2000: `${BOARDS_MEDIA}/BeastMaker2000Board.png`,
  metolius_project: `${BOARDS_MEDIA}/MetoliusProjectBoard.png`,
  metolius_deluxe2: `${BOARDS_MEDIA}/MetoliusDeluxe2.png`,
};

/**
 * @param {string} boardId - Board id (e.g. 'tavor', 'beastmaker1000').
 * @returns {string|null} Image URL for the board, or null if unknown.
 */
export function getBoardImageUrl(boardId) {
  if (!boardId) return null;
  return BOARD_IMAGES[boardId] ?? null;
}
