import type { TickTockEvent, CreateEventInput } from "@/types";

/**
 * Data Access Layer for TickTock events.
 *
 * All methods are async and call the API route handlers.
 * Each method requires a `boardId` to scope operations to a specific board.
 */
export const eventService = {
  async getAll(boardId: string): Promise<TickTockEvent[]> {
    const res = await fetch(`/api/boards/${boardId}/events`);
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  },

  async getById(boardId: string, id: string): Promise<TickTockEvent | null> {
    const events = await this.getAll(boardId);
    return events.find((e) => e.id === id) ?? null;
  },

  async create(boardId: string, input: CreateEventInput): Promise<TickTockEvent> {
    const res = await fetch(`/api/boards/${boardId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.errors ? JSON.stringify(error.errors) : "Failed to create event");
    }

    return res.json();
  },

  async update(
    boardId: string,
    id: string,
    data: Partial<Omit<TickTockEvent, "id" | "createdAt" | "order" | "boardId">>
  ): Promise<TickTockEvent> {
    const res = await fetch(`/api/boards/${boardId}/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.errors ? JSON.stringify(error.errors) : "Failed to update event");
    }

    return res.json();
  },

  async delete(boardId: string, id: string): Promise<void> {
    const res = await fetch(`/api/boards/${boardId}/events/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete event");
  },

  /**
   * Persist a new ordering of event IDs.
   */
  async reorder(boardId: string, orderedIds: string[]): Promise<TickTockEvent[]> {
    const res = await fetch(`/api/boards/${boardId}/events/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    });

    if (!res.ok) throw new Error("Failed to reorder events");
    return res.json();
  },
};
