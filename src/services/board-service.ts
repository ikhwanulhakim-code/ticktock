import type { Board } from "@/types";

/**
 * Data Access Layer for TickTock boards.
 */
export const boardService = {
  /**
   * Create a new board. Returns the board with its UUID.
   */
  async create(): Promise<Board> {
    const res = await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to create board");
    return res.json();
  },
};
