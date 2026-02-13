"use client";

import { useState, useEffect, useCallback } from "react";
import type { SortMode } from "@/types";
import { storage } from "@/services/storage";

/**
 * Persists the user's sort mode preference (urgency vs custom) to LocalStorage.
 * Scoped per board via the boardId parameter.
 *
 * - Default: "urgency" (events sorted by closest to expiring)
 * - When user drags to reorder → switches to "custom"
 * - User can reset back to "urgency" via the UI toggle
 */
export function useSortPreference(boardId: string) {
  const sortKey = `sort_preference_${boardId}`;
  const [sortMode, setSortModeState] = useState<SortMode>("urgency");

  // Hydrate from localStorage on mount
  useEffect(() => {
    const items = storage.getItems<SortMode>(sortKey);
    if (items.length > 0 && (items[0] === "urgency" || items[0] === "custom")) {
      setSortModeState(items[0]);
    }
  }, [sortKey]);

  const setSortMode = useCallback((mode: SortMode) => {
    setSortModeState(mode);
    storage.setItems(sortKey, [mode]);
  }, [sortKey]);

  return { sortMode, setSortMode };
}
