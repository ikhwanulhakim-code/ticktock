/**
 * Serialize a Prisma Event record to the TickTockEvent shape expected by the client.
 * Shared across all API route handlers to avoid duplication.
 */
export function serializeEvent(event: {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  createdAt: Date;
  color: string;
  durationMs: bigint | number;
  timerMode: string;
  isCompleted: boolean;
  order: number;
  boardId: string;
}) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    targetDate: event.targetDate.toISOString(),
    createdAt: event.createdAt.toISOString(),
    color: event.color,
    durationMs: Number(event.durationMs),
    timerMode: event.timerMode as "duration" | "datetime",
    isCompleted: event.isCompleted,
    order: event.order,
    boardId: event.boardId,
  };
}

/**
 * Serialize a Prisma Board record to the Board shape expected by the client.
 */
export function serializeBoard(board: {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isShared: boolean;
  sharedAt: Date | null;
}) {
  return {
    id: board.id,
    createdAt: board.createdAt.toISOString(),
    updatedAt: board.updatedAt.toISOString(),
    isShared: board.isShared,
    sharedAt: board.sharedAt?.toISOString() ?? null,
  };
}

/**
 * Deserialize and validate localStorage data.
 * Returns null if data is invalid or corrupted.
 */
export function deserializeLocalData<T>(data: string | null): T | null {
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}
