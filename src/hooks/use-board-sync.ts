"use client";

import { useEffect, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { SyncStatus, TickTockEvent } from "@/types";
import { downloadRemoteChanges } from "@/services/share-service";
import { getLocalEvents } from "@/services/local-storage-service";
import { processSyncQueue, hasQueuedMutations } from "@/services/sync-queue-service";

// ============================================================
// Types
// ============================================================

interface SyncState {
  status: SyncStatus;
  lastSyncAt: Date | null;
  localVersion?: TickTockEvent[];
  serverVersion?: TickTockEvent[];
}

// ============================================================
// useBoardSync Hook
// ============================================================

export function useBoardSync(boardId: string, isLocal: boolean) {
  const queryClient = useQueryClient();
  const [syncState, setSyncState] = useState<SyncState>({
    status: isLocal ? "local" : "synced",
    lastSyncAt: null,
  });

  // If local-only, no sync needed
  if (isLocal) {
    return {
      status: "local" as const,
      syncNow: () => Promise.resolve(),
      lastSyncAt: null,
    };
  }

  // Check if there are queued mutations
  const hasQueue = hasQueuedMutations(boardId);

  // Fetch server data periodically (with stale-while-revalidate)
  const { data: serverEvents, refetch } = useQuery({
    queryKey: ["events", boardId, "remote"],
    queryFn: () => downloadRemoteChanges(boardId),
    staleTime: 60_000, // 1 minute
    refetchOnWindowFocus: true,
    enabled: !isLocal,
  });

  // Sync function
  const syncNow = useCallback(async () => {
    if (isLocal) return;

    setSyncState((prev) => ({ ...prev, status: "syncing" }));

    try {
      // 1. Process any queued mutations first
      if (hasQueue) {
        await processSyncQueue(boardId, async (item) => {
          // Process each mutation
          // This would call the appropriate API endpoint based on type
          console.log("[useBoardSync] Processing queued mutation:", item);
          // TODO: Implement mutation processing
        });
      }

      // 2. Fetch latest from server
      const { data: freshServerEvents } = await refetch();
      if (!freshServerEvents) {
        throw new Error("Failed to fetch server data");
      }

      // 3. Get local cache
      const localEvents = getLocalEvents(boardId);

      // 4. Compare timestamps (simple conflict detection)
      const hasLocalChanges = localEvents.length > 0;
      const hasServerChanges = freshServerEvents.length > 0;

      if (!hasLocalChanges && hasServerChanges) {
        // Server has data, local is empty — just pull
        if (typeof window !== "undefined") {
          const eventsKey = `ticktock_events_${boardId}`;
          localStorage.setItem(eventsKey, JSON.stringify(freshServerEvents));
        }
        setSyncState({
          status: "synced",
          lastSyncAt: new Date(),
        });
        queryClient.invalidateQueries({ queryKey: ["events", boardId] });
        return;
      }

      if (hasLocalChanges && !hasServerChanges) {
        // Local has data, server is empty — this shouldn't happen for shared boards
        console.warn("[useBoardSync] Local has data but server is empty");
        setSyncState({
          status: "conflict",
          lastSyncAt: new Date(),
          localVersion: localEvents,
          serverVersion: freshServerEvents,
        });
        return;
      }

      // Both have data — check for conflicts
      const localUpdatedAt = Math.max(
        ...localEvents.map((e) => new Date(e.createdAt).getTime())
      );
      const serverUpdatedAt = Math.max(
        ...freshServerEvents.map((e) => new Date(e.createdAt).getTime())
      );

      if (Math.abs(localUpdatedAt - serverUpdatedAt) < 1000) {
        // Within 1 second — consider synced
        setSyncState({
          status: "synced",
          lastSyncAt: new Date(),
        });
        return;
      }

      // Potential conflict — for now, just mark as synced and prefer server
      // In production, you'd want better conflict resolution
      if (typeof window !== "undefined") {
        const eventsKey = `ticktock_events_${boardId}`;
        localStorage.setItem(eventsKey, JSON.stringify(freshServerEvents));
      }
      setSyncState({
        status: "synced",
        lastSyncAt: new Date(),
      });
      queryClient.invalidateQueries({ queryKey: ["events", boardId] });
    } catch (error) {
      console.error("[useBoardSync] Sync failed:", error);
      setSyncState((prev) => ({ ...prev, status: "offline" }));
    }
  }, [boardId, isLocal, hasQueue, refetch, queryClient]);

  // Auto-sync on mount and window focus
  useEffect(() => {
    if (isLocal) return;

    syncNow();

    const handleFocus = () => {
      syncNow();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [isLocal, syncNow]);

  // Auto-sync every 30 seconds if offline with queue
  useEffect(() => {
    if (isLocal || syncState.status !== "offline" || !hasQueue) return;

    const intervalId = setInterval(() => {
      syncNow();
    }, 30_000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isLocal, syncState.status, hasQueue, syncNow]);

  return {
    status: syncState.status,
    syncNow,
    lastSyncAt: syncState.lastSyncAt,
    localVersion: syncState.localVersion,
    serverVersion: syncState.serverVersion,
  };
}
