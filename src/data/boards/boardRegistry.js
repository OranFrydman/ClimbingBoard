import { Board } from '../../models/Board';
import tavorConfig from './tavor.json';
import beastmaker1000Config from './beastmaker1000.json';
import beastmaker2000Config from './beastmaker2000.json';

const BOARD_CONFIGS = {
  tavor: tavorConfig,
  beastmaker1000: beastmaker1000Config,
  beastmaker2000: beastmaker2000Config,
};

export const DEFAULT_BOARD_ID = 'tavor';

export const BOARD_ENUM = Object.entries(BOARD_CONFIGS).map(([id, config]) => ({
  id,
  name: config.name || id,
}));

/**
 * Fetch board config from server (always fresh from disk – no rebuild needed).
 * Falls back to bundled config if fetch fails.
 * @param {string} id - Board id
 * @returns {Promise<Board|null>}
 */
export async function fetchBoard(id) {
  const targetId = id && id.trim() ? id : null;
  if (targetId == null) return null;
  try {
    const res = await fetch(`/api/board/${targetId}?t=${Date.now()}`);
    if (!res.ok) throw new Error('Not found');
    const config = await res.json();
    return Board.fromData(config);
  } catch {
    const config = BOARD_CONFIGS[targetId];
    return config ? Board.fromData(config) : null;
  }
}

/** @deprecated Use fetchBoard for live JSON updates */
export function getBoard(id) {
  const targetId = id && id.trim() ? id : null;
  if (targetId == null) return null;
  const config = BOARD_CONFIGS[targetId];
  return config ? Board.fromData(config) : null;
}

/**
 * @returns {{ id: string, name: string }[]}
 */
export function getBoardList() {
  return BOARD_ENUM;
}
