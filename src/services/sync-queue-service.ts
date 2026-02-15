import type { SyncQueueItem } from "@/types";
import { deserializeLocalData } from "@/lib/serialize";

// ============================================================
// Constants
// ============================================================

const STORAGE_PREFIX = "ticktock";
const MAX_RETRY_COUNT = 3;

// ============================================================
// Storage Guards
// ============================================================

function isClient(): boolean {
  return typeof window !== "undefined";
}

function getStorage(): Storage | null {
  return isClient() ? window.localStorage : null;
}

function getQueueKey(boardId: string): string {
  return `${STORAGE_PREFIX}_sync_queue_${boardId}`;
}

// ============================================================
// Queue Operations
// ============================================================

export function queueMutation(
  boardId: string,
  type: SyncQueueItem["type"],
  payload: unknown
): void {
  const storage = getStorage();
  if (!storage) return;

  const queue = getSyncQueue(boardId);
  const item: SyncQueueItem = {
    type,
    payload,
    timestamp: Date.now(),
    retryCount: 0,
  };

  queue.push(item);
  storage.setItem(getQueueKey(boardId), JSON.stringify(queue));
}

export function getSyncQueue(boardId: string): SyncQueueItem[] {
  const storage = getStorage();
  if (!storage) return [];

  const data = storage.getItem(getQueueKey(boardId));
  const queue = deserializeLocalData<SyncQueueItem[]>(data);
  return queue ?? [];
}

export function clearSyncQueue(boardId: string): void {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(getQueueKey(boardId));
}

export function incrementRetryCount(
  boardId: string,
  index: number
): void {
  const storage = getStorage();
  if (!storage) return;

  const queue = getSyncQueue(boardId);
  if (index >= queue.length) return;

  queue[index].retryCount++;
  
  // Remove if exceeded max retries
  if (queue[index].retryCount >= MAX_RETRY_COUNT) {
    queue.splice(index, 1);
  }

  storage.setItem(getQueueKey(boardId), JSON.stringify(queue));
}

export function removeFromQueue(boardId: string, index: number): void {
  const storage = getStorage();
  if (!storage) return;

  const queue = getSyncQueue(boardId);
  queue.splice(index, 1);
  storage.setItem(getQueueKey(boardId), JSON.stringify(queue));
}

export function hasQueuedMutations(boardId: string): boolean {
  return getSyncQueue(boardId).length > 0;
}

export async function processSyncQueue(
  boardId: string,
  onProcess: (item: SyncQueueItem) => Promise<void>
): Promise<{ success: number; failed: number }> {
  const queue = getSyncQueue(boardId);
  let success = 0;
  let failed = 0;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    try {
      await onProcess(item);
      removeFromQueue(boardId, i);
      success++;
    } catch (error) {
      console.error("[sync-queue] Failed to process item:", error);
      incrementRetryCount(boardId, i);
      failed++;
    }
  }

  return { success, failed };
}
