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
    isCompleted: event.isCompleted,
    order: event.order,
    boardId: event.boardId,
  };
}
