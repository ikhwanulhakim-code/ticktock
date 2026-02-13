const STORAGE_PREFIX = "ticktock_";

/**
 * LocalStorage wrapper with type-safe operations.
 * Isolated in this module so swapping to a different persistence
 * layer (e.g., IndexedDB) requires changes only here.
 */
export const storage = {
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
