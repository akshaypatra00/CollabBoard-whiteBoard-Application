import { BoardSummary } from '@whiteboard/shared';

const RECENT_BOARDS_KEY = 'collab_recent_boards';
const MAX_RECENT_BOARDS = 12;

export const storage = {
  getRecentBoards: (): BoardSummary[] => {
    try {
      const data = localStorage.getItem(RECENT_BOARDS_KEY);
      if (!data) return [];
      return JSON.parse(data) as BoardSummary[];
    } catch {
      return [];
    }
  },

  saveRecentBoard: (board: BoardSummary): void => {
    try {
      const current = storage.getRecentBoards();
      const filtered = current.filter((b) => b.id !== board.id);
      const updated = [board, ...filtered].slice(0, MAX_RECENT_BOARDS);
      localStorage.setItem(RECENT_BOARDS_KEY, JSON.stringify(updated));
    } catch {
      // Storage unavailable
    }
  },

  removeRecentBoard: (id: string): void => {
    try {
      const current = storage.getRecentBoards();
      const updated = current.filter((b) => b.id !== id);
      localStorage.setItem(RECENT_BOARDS_KEY, JSON.stringify(updated));
    } catch {
      // Storage unavailable
    }
  },
};
