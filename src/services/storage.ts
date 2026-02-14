const STORAGE_PREFIX = "ticktock_";

/**
 * LocalStorage wrapper with type-safe operations.
 * Isolated in this module so swapping to a different persistence
 * layer (e.g., IndexedDB) requires changes only here.
 */
export const storage = {
  getItem<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      console.error(`[storage] Failed to parse key "${key}"`);
      return null;
    }
  },

  setItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch {
      console.error(`[storage] Failed to write key "${key}"`);
    }
  },

  getItems<T>(key: string): T[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      console.error(`[storage] Failed to parse key "${key}"`);
      return [];
    }
  },

  setItems<T>(key: string, items: T[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(items));
    } catch {
      console.error(`[storage] Failed to write key "${key}"`);
    }
  },

  removeKey(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  },
};

// ============================================================
// Recent Boards helpers
// ============================================================

const RECENT_BOARDS_KEY = "recent_boards";
const MAX_RECENT_BOARDS = 5;

export interface RecentBoard {
  id: string;
  visitedAt: string;
}

export function getRecentBoards(): RecentBoard[] {
  return storage.getItem<RecentBoard[]>(RECENT_BOARDS_KEY) ?? [];
}

export function trackBoardVisit(boardId: string): void {
  const boards = getRecentBoards();
  const filtered = boards.filter((b) => b.id !== boardId);
  filtered.unshift({ id: boardId, visitedAt: new Date().toISOString() });
  storage.setItem(RECENT_BOARDS_KEY, filtered.slice(0, MAX_RECENT_BOARDS));
}

export function removeRecentBoard(boardId: string): void {
  const boards = getRecentBoards().filter((b) => b.id !== boardId);
  storage.setItem(RECENT_BOARDS_KEY, boards);
}

export function clearRecentBoards(): void {
  storage.removeKey(RECENT_BOARDS_KEY);
}
