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
  isLocal?: boolean;
}

export function getRecentBoards(): RecentBoard[] {
  return storage.getItem<RecentBoard[]>(RECENT_BOARDS_KEY) ?? [];
}

export function trackBoardVisit(boardId: string, isLocal = false): void {
  const boards = getRecentBoards();
  const filtered = boards.filter((b) => b.id !== boardId);
  filtered.unshift({ 
    id: boardId, 
    visitedAt: new Date().toISOString(),
    isLocal,
  });
  storage.setItem(RECENT_BOARDS_KEY, filtered.slice(0, MAX_RECENT_BOARDS));
}

export function removeRecentBoard(boardId: string): void {
  const boards = getRecentBoards().filter((b) => b.id !== boardId);
  storage.setItem(RECENT_BOARDS_KEY, boards);
}

export function clearRecentBoards(): void {
  storage.removeKey(RECENT_BOARDS_KEY);
}

/**
 * Update a board in recent list from local to shared.
 * Called after successful share operation.
 */
export function migrateLocalToShared(localId: string, sharedId: string): void {
  const boards = getRecentBoards();
  const index = boards.findIndex((b) => b.id === localId);
  
  if (index !== -1) {
    // Replace local board with shared board
    boards[index] = {
      id: sharedId,
      visitedAt: new Date().toISOString(),
      isLocal: false,
    };
    storage.setItem(RECENT_BOARDS_KEY, boards);
  }
}

// ============================================================
// Custom Colors helpers
// ============================================================

const CUSTOM_COLORS_KEY = "custom_colors";

/**
 * Get all saved custom colors.
 * Returns an array of valid hex color strings.
 */
export function getCustomColors(): string[] {
  const colors = storage.getItem<string[]>(CUSTOM_COLORS_KEY) ?? [];
  // Validate hex format
  return colors.filter((c) => /^#[0-9A-Fa-f]{6}$/.test(c));
}

/**
 * Add a new custom color to the saved list.
 * Prepends the color if it doesn't already exist.
 */
export function addCustomColor(color: string): void {
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) return;
  const colors = getCustomColors();
  // Check if already exists (case-insensitive)
  if (colors.some((c) => c.toLowerCase() === color.toLowerCase())) return;
  // Prepend to array (most recent first)
  colors.unshift(color);
  storage.setItem(CUSTOM_COLORS_KEY, colors);
}
