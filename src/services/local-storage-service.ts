import type { LocalBoard, TickTockEvent, CreateEventInput } from "@/types";
import { deserializeLocalData } from "@/lib/serialize";

// ============================================================
// Constants
// ============================================================

const STORAGE_PREFIX = "ticktock";
const LOCAL_BOARDS_KEY = `${STORAGE_PREFIX}_local_boards`;
const MAX_LOCAL_BOARDS = 10;
const QUOTA_WARNING_THRESHOLD = 0.8; // 80%

// ============================================================
// Storage Guards
// ============================================================

function isClient(): boolean {
  return typeof window !== "undefined";
}

function getStorage(): Storage | null {
  return isClient() ? window.localStorage : null;
}

// ============================================================
// Quota Management
// ============================================================

export async function checkStorageQuota(): Promise<{
  usage: number;
  quota: number;
  percent: number;
  shouldWarn: boolean;
}> {
  if (!isClient() || !navigator.storage?.estimate) {
    return { usage: 0, quota: 5_000_000, percent: 0, shouldWarn: false };
  }

  try {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage ?? 0;
    const quota = estimate.quota ?? 5_000_000;
    const percent = quota > 0 ? usage / quota : 0;

    return {
      usage,
      quota,
      percent,
      shouldWarn: percent >= QUOTA_WARNING_THRESHOLD,
    };
  } catch {
    return { usage: 0, quota: 5_000_000, percent: 0, shouldWarn: false };
  }
}

async function handleQuotaExceeded(): Promise<void> {
  const boards = getAllLocalBoards();
  if (boards.length === 0) return;

  // Sort by last accessed (oldest first)
  const sorted = boards.sort((a, b) => {
    const aTime = new Date(a.updatedAt).getTime();
    const bTime = new Date(b.updatedAt).getTime();
    return aTime - bTime;
  });

  // Delete oldest board
  const oldest = sorted[0];
  if (oldest) {
    deleteLocalBoard(oldest.id);
  }
}

// ============================================================
// Local Board CRUD
// ============================================================

export function createLocalBoard(): LocalBoard {
  const storage = getStorage();
  if (!storage) {
    throw new Error("localStorage not available");
  }

  const now = new Date().toISOString();
  const board: LocalBoard = {
    id: `local_${crypto.randomUUID()}`,
    createdAt: now,
    updatedAt: now,
    isLocal: true,
    events: [],
  };

  try {
    const boards = getAllLocalBoards();
    
    // Check if we're at max capacity
    if (boards.length >= MAX_LOCAL_BOARDS) {
      // Delete oldest board
      const sorted = boards.sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime();
        const bTime = new Date(b.updatedAt).getTime();
        return aTime - bTime;
      });
      const oldest = sorted[0];
      if (oldest) {
        deleteLocalBoard(oldest.id);
      }
    }

    boards.push(board);
    storage.setItem(LOCAL_BOARDS_KEY, JSON.stringify(boards));
    emitChange(board.id);
    return board;
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "QuotaExceededError"
    ) {
      handleQuotaExceeded();
      // Retry once
      const boards = getAllLocalBoards();
      boards.push(board);
      storage.setItem(LOCAL_BOARDS_KEY, JSON.stringify(boards));
      emitChange(board.id);
      return board;
    }
    throw error;
  }
}

export function getLocalBoard(id: string): LocalBoard | null {
  const storage = getStorage();
  if (!storage) return null;

  const boards = getAllLocalBoards();
  const board = boards.find((b) => b.id === id);
  if (!board) return null;

  // Load events separately
  const events = getLocalEvents(id);
  return { ...board, events };
}

export function getAllLocalBoards(): LocalBoard[] {
  const storage = getStorage();
  if (!storage) return [];

  const data = storage.getItem(LOCAL_BOARDS_KEY);
  const boards = deserializeLocalData<LocalBoard[]>(data);
  return boards ?? [];
}

export function updateLocalBoard(
  id: string,
  updates: Partial<Pick<LocalBoard, "updatedAt">>
): void {
  const storage = getStorage();
  if (!storage) throw new Error("localStorage not available");

  const boards = getAllLocalBoards();
  const index = boards.findIndex((b) => b.id === id);
  if (index === -1) throw new Error("Board not found");

  boards[index] = {
    ...boards[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  storage.setItem(LOCAL_BOARDS_KEY, JSON.stringify(boards));
  emitChange(id);
}

export function deleteLocalBoard(id: string): void {
  const storage = getStorage();
  if (!storage) throw new Error("localStorage not available");

  // Delete board
  const boards = getAllLocalBoards();
  const filtered = boards.filter((b) => b.id !== id);
  storage.setItem(LOCAL_BOARDS_KEY, JSON.stringify(filtered));

  // Delete events
  storage.removeItem(getEventsKey(id));

  // Delete sort preference
  storage.removeItem(`${STORAGE_PREFIX}_sort_preference_${id}`);

  emitChange(id);
}

// ============================================================
// Event CRUD
// ============================================================

function getEventsKey(boardId: string): string {
  return `${STORAGE_PREFIX}_events_${boardId}`;
}

export function getLocalEvents(boardId: string): TickTockEvent[] {
  const storage = getStorage();
  if (!storage) return [];

  const data = storage.getItem(getEventsKey(boardId));
  const events = deserializeLocalData<TickTockEvent[]>(data);
  return events ?? [];
}

export function createLocalEvent(
  boardId: string,
  input: CreateEventInput
): TickTockEvent {
  const storage = getStorage();
  if (!storage) throw new Error("localStorage not available");

  const events = getLocalEvents(boardId);
  const now = new Date().toISOString();

  const newEvent: TickTockEvent = {
    id: `temp_${crypto.randomUUID()}`,
    ...input,
    createdAt: now,
    isCompleted: false,
    order: events.length,
    boardId,
  };

  try {
    events.push(newEvent);
    storage.setItem(getEventsKey(boardId), JSON.stringify(events));
    updateLocalBoard(boardId, { updatedAt: now });
    emitChange(boardId);
    return newEvent;
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "QuotaExceededError"
    ) {
      handleQuotaExceeded();
      // Retry once
      events.push(newEvent);
      storage.setItem(getEventsKey(boardId), JSON.stringify(events));
      updateLocalBoard(boardId, { updatedAt: now });
      emitChange(boardId);
      return newEvent;
    }
    throw error;
  }
}

export function updateLocalEvent(
  boardId: string,
  eventId: string,
  updates: Partial<Omit<TickTockEvent, "id" | "createdAt" | "boardId">>
): void {
  const storage = getStorage();
  if (!storage) throw new Error("localStorage not available");

  const events = getLocalEvents(boardId);
  const index = events.findIndex((e) => e.id === eventId);
  if (index === -1) throw new Error("Event not found");

  events[index] = { ...events[index], ...updates };
  storage.setItem(getEventsKey(boardId), JSON.stringify(events));
  updateLocalBoard(boardId, { updatedAt: new Date().toISOString() });
  emitChange(boardId);
}

export function deleteLocalEvent(boardId: string, eventId: string): void {
  const storage = getStorage();
  if (!storage) throw new Error("localStorage not available");

  const events = getLocalEvents(boardId);
  const filtered = events.filter((e) => e.id !== eventId);
  storage.setItem(getEventsKey(boardId), JSON.stringify(filtered));
  updateLocalBoard(boardId, { updatedAt: new Date().toISOString() });
  emitChange(boardId);
}

export function reorderLocalEvents(
  boardId: string,
  eventIds: string[]
): void {
  const storage = getStorage();
  if (!storage) throw new Error("localStorage not available");

  const events = getLocalEvents(boardId);
  const eventMap = new Map(events.map((e) => [e.id, e]));

  const reordered = eventIds
    .map((id, index) => {
      const event = eventMap.get(id);
      if (!event) return null;
      return { ...event, order: index };
    })
    .filter((e): e is TickTockEvent => e !== null);

  storage.setItem(getEventsKey(boardId), JSON.stringify(reordered));
  updateLocalBoard(boardId, { updatedAt: new Date().toISOString() });
  emitChange(boardId);
}

// ============================================================
// Migration Helpers
// ============================================================

export function migrateLocalToShared(localId: string, sharedId: string): void {
  const storage = getStorage();
  if (!storage) return;

  // Create mapping
  storage.setItem(`${STORAGE_PREFIX}_mapping_${localId}`, sharedId);

  // Delete local board from list (but keep events for sync)
  const boards = getAllLocalBoards();
  const filtered = boards.filter((b) => b.id !== localId);
  storage.setItem(LOCAL_BOARDS_KEY, JSON.stringify(filtered));

  emitChange(localId);
}

export function getSharedIdFromLocal(localId: string): string | null {
  const storage = getStorage();
  if (!storage) return null;

  return storage.getItem(`${STORAGE_PREFIX}_mapping_${localId}`);
}

// ============================================================
// Reactivity (Custom Event Pattern)
// ============================================================

const LOCAL_STORAGE_EVENT = "local-storage-changed";

export function emitChange(boardId?: string): void {
  // Dispatch custom event for React components to listen
  if (typeof window !== "undefined") {
    const event = new CustomEvent(LOCAL_STORAGE_EVENT, {
      detail: { boardId, timestamp: Date.now() },
    });
    window.dispatchEvent(event);
    console.log("[local-storage] emitChange dispatched for board:", boardId);
  }
}

export function subscribeToChanges(
  callback: (boardId?: string) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ boardId?: string }>;
    callback(customEvent.detail.boardId);
  };

  window.addEventListener(LOCAL_STORAGE_EVENT, handler);
  console.log("[local-storage] Subscribed to changes");

  return () => {
    window.removeEventListener(LOCAL_STORAGE_EVENT, handler);
    console.log("[local-storage] Unsubscribed from changes");
  };
}
