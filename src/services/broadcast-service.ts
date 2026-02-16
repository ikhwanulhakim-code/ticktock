// ============================================================
// Multi-Tab Coordination via BroadcastChannel API
// ============================================================

type ChangeType =
  | "event_created"
  | "event_updated"
  | "event_deleted"
  | "event_restarted"
  | "events_reordered"
  | "board_shared";

interface BroadcastMessage {
  type: ChangeType;
  boardId: string;
  payload?: unknown;
  timestamp: number;
}

const channels = new Map<string, BroadcastChannel>();
const listeners = new Map<string, Set<(message: BroadcastMessage) => void>>();

// ============================================================
// Feature Detection
// ============================================================

function isBroadcastChannelSupported(): boolean {
  return typeof window !== "undefined" && "BroadcastChannel" in window;
}

// ============================================================
// Channel Management
// ============================================================

function getChannelName(boardId: string): string {
  return `ticktock_board_${boardId}`;
}

function getOrCreateChannel(boardId: string): BroadcastChannel | null {
  if (!isBroadcastChannelSupported()) return null;

  const channelName = getChannelName(boardId);
  let channel = channels.get(channelName);

  if (!channel) {
    channel = new BroadcastChannel(channelName);
    channels.set(channelName, channel);

    // Setup message handler
    channel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
      const boardListeners = listeners.get(boardId);
      if (boardListeners) {
        boardListeners.forEach((listener) => listener(event.data));
      }
    };
  }

  return channel;
}

// ============================================================
// Public API
// ============================================================

export function broadcastLocalChange(
  boardId: string,
  type: ChangeType,
  payload?: unknown,
): void {
  const channel = getOrCreateChannel(boardId);
  if (!channel) {
    // Fallback to storage event for browsers without BroadcastChannel
    fallbackToStorageEvent(boardId, type, payload);
    return;
  }

  const message: BroadcastMessage = {
    type,
    boardId,
    payload,
    timestamp: Date.now(),
  };

  try {
    channel.postMessage(message);
  } catch (error) {
    console.error("[broadcast] Failed to send message:", error);
  }
}

export function listenToLocalChanges(
  boardId: string,
  callback: (message: BroadcastMessage) => void,
): () => void {
  if (!isBroadcastChannelSupported()) {
    // Fallback to storage event listener
    return fallbackStorageEventListener(boardId, callback);
  }

  // Ensure channel exists
  getOrCreateChannel(boardId);

  // Add listener
  let boardListeners = listeners.get(boardId);
  if (!boardListeners) {
    boardListeners = new Set();
    listeners.set(boardId, boardListeners);
  }
  boardListeners.add(callback);

  // Return cleanup function
  return () => {
    const boardListeners = listeners.get(boardId);
    if (boardListeners) {
      boardListeners.delete(callback);
      if (boardListeners.size === 0) {
        listeners.delete(boardId);
        // Close channel if no more listeners
        const channelName = getChannelName(boardId);
        const channel = channels.get(channelName);
        if (channel) {
          channel.close();
          channels.delete(channelName);
        }
      }
    }
  };
}

export function closeChannel(boardId: string): void {
  const channelName = getChannelName(boardId);
  const channel = channels.get(channelName);
  if (channel) {
    channel.close();
    channels.delete(channelName);
  }
  listeners.delete(boardId);
}

// ============================================================
// Fallback: Storage Event (for older browsers)
// ============================================================

const BROADCAST_KEY_PREFIX = "ticktock_broadcast_";

function fallbackToStorageEvent(
  boardId: string,
  type: ChangeType,
  payload?: unknown,
): void {
  if (typeof window === "undefined") return;

  const message: BroadcastMessage = {
    type,
    boardId,
    payload,
    timestamp: Date.now(),
  };

  const key = `${BROADCAST_KEY_PREFIX}${boardId}`;
  try {
    // Write and immediately remove (storage event only fires on other tabs)
    localStorage.setItem(key, JSON.stringify(message));
    localStorage.removeItem(key);
  } catch (error) {
    console.error("[broadcast-fallback] Failed to emit storage event:", error);
  }
}

function fallbackStorageEventListener(
  boardId: string,
  callback: (message: BroadcastMessage) => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const key = `${BROADCAST_KEY_PREFIX}${boardId}`;

  const handler = (event: StorageEvent) => {
    if (event.key === key && event.newValue) {
      try {
        const message = JSON.parse(event.newValue) as BroadcastMessage;
        callback(message);
      } catch {
        // Ignore parse errors
      }
    }
  };

  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener("storage", handler);
  };
}
