import type { TickTockEvent } from "@/types";
import {
  getLocalEvents,
  migrateLocalToShared as migrateLocalStorageMapping,
} from "./local-storage-service";
import { migrateLocalToShared as migrateRecentBoard } from "./storage";
import { broadcastLocalChange } from "./broadcast-service";

// ============================================================
// Types
// ============================================================

interface ShareResponse {
  boardId: string;
  events: TickTockEvent[];
}

interface ShareOptions {
  sortPreference?: "urgency" | "custom";
  customColors?: string[];
}

// ============================================================
// Share Local Board
// ============================================================

export async function shareLocalBoard(
  localId: string,
  options?: ShareOptions
): Promise<{ boardId: string; url: string }> {
  // Guard: Check localStorage lock
  const lockKey = `ticktock_share_lock_${localId}`;
  if (typeof window !== "undefined") {
    const existingLock = localStorage.getItem(lockKey);
    if (existingLock) {
      const lockTime = parseInt(existingLock, 10);
      const thirtySecondsAgo = Date.now() - 30_000;
      if (lockTime > thirtySecondsAgo) {
        throw new Error("Share already in progress in another tab");
      }
    }
    // Set lock
    localStorage.setItem(lockKey, Date.now().toString());
  }

  try {
    // 1. Load all events from localStorage
    const events = getLocalEvents(localId);
    
    if (events.length === 0) {
      throw new Error("Cannot share empty board");
    }

    // 2. Prepare payload
    const payload = {
      events: events.map((e) => ({
        title: e.title,
        description: e.description,
        targetDate: e.targetDate,
        color: e.color,
      })),
      sortPreference: options?.sortPreference,
      customColors: options?.customColors,
    };

    // 3. Call share API with retry logic
    const response = await fetchWithRetry<ShareResponse>(
      "/api/share",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      3,
      [1000, 2000, 4000]
    );

    const { boardId, events: serverEvents } = response;

    // 4. Update localStorage mappings
    migrateLocalStorageMapping(localId, boardId);
    migrateRecentBoard(localId, boardId);

    // 5. Cache server events to localStorage for 2-way sync
    if (typeof window !== "undefined") {
      const eventsKey = `ticktock_events_${boardId}`;
      localStorage.setItem(eventsKey, JSON.stringify(serverEvents));
    }

    // 6. Broadcast to other tabs
    broadcastLocalChange(localId, "board_shared", { boardId });

    // 7. Clear lock
    if (typeof window !== "undefined") {
      localStorage.removeItem(lockKey);
    }

    // 8. Return board ID and URL
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL ?? "https://tryticktock.vercel.app";

    return {
      boardId,
      url: `${baseUrl}/b/${boardId}`,
    };
  } catch (error) {
    // Clear lock on error
    if (typeof window !== "undefined") {
      localStorage.removeItem(lockKey);
    }
    throw error;
  }
}

// ============================================================
// Fetch with Retry (exponential backoff)
// ============================================================

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  maxRetries: number,
  delays: number[]
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30_000); // 30s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[share-service] Attempt ${attempt + 1} failed:`, error);

      // Don't retry on client errors (400-499)
      if (
        error instanceof Error &&
        error.message.includes("HTTP 4")
      ) {
        throw lastError;
      }

      // Wait before retry (unless last attempt)
      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, delays[attempt] ?? 1000)
        );
      }
    }
  }

  throw lastError ?? new Error("Unknown error during share");
}

// ============================================================
// Sync Helpers (for 2-way sync)
// ============================================================

export async function uploadLocalChanges(
  boardId: string,
  changes: unknown[]
): Promise<void> {
  const response = await fetch(`/api/boards/${boardId}/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ changes }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to sync changes");
  }
}

export async function downloadRemoteChanges(
  boardId: string
): Promise<TickTockEvent[]> {
  const response = await fetch(`/api/boards/${boardId}/events`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch remote changes");
  }

  const data = await response.json();
  return data.events as TickTockEvent[];
}
