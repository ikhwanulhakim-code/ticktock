import { z } from "zod";

// ============================================================
// Core Data Entities
// ============================================================

export interface Board {
  id: string;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  isShared: boolean;
  sharedAt: string | null; // ISO String
  isLocal?: boolean; // Client-only flag
}

export interface LocalBoard extends Omit<Board, "isShared" | "sharedAt"> {
  isLocal: true;
  events?: TickTockEvent[];
}

export type SyncStatus = "synced" | "syncing" | "conflict" | "offline" | "local";

export interface LocalStorageEvent extends Omit<TickTockEvent, "id"> {
  id: string; // Temp ID for local events (prefixed with "temp_")
}

export interface SyncQueueItem {
  type: "create" | "update" | "delete" | "reorder";
  payload: unknown;
  timestamp: number;
  retryCount: number;
}

export interface TickTockEvent {
  id: string;
  title: string;
  description: string; // Optional description text
  targetDate: string; // ISO String
  createdAt: string; // ISO String
  color: string; // Hex code
  isCompleted: boolean;
  order: number;
  boardId: string;
}

// ============================================================
// Input Types
// ============================================================

export type CreateEventInput = Omit<
  TickTockEvent,
  "id" | "createdAt" | "isCompleted" | "order" | "boardId"
>;

// ============================================================
// Timer Output
// ============================================================

export interface TimerOutput {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  progressPercent: number;
  totalRemainingMs: number;
}

// ============================================================
// Zod Validation Schemas
// ============================================================

export const createEventSchema = z.object({
  title: z
    .string()
    .max(100, "Title must be 100 characters or less")
    .optional()
    .default(""),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .default(""),
  targetDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .refine(
      (val) => new Date(val).getTime() > Date.now(),
      "Target date must be in the future"
    ),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
});

export const updateEventSchema = z.object({
  title: z
    .string()
    .max(100, "Title must be 100 characters or less")
    .optional()
    .default(""),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .default(""),
  targetDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .refine(
      (val) => new Date(val).getTime() > Date.now(),
      "Target date must be in the future"
    ),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
});

export const shareLocalBoardSchema = z.object({
  events: z.array(createEventSchema).max(100, "Maximum 100 events per board"),
  sortPreference: z.enum(["urgency", "custom"]).optional(),
  customColors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).optional(),
});

// ============================================================
// Sort Types
// ============================================================

export type SortMode = "urgency" | "custom";

// ============================================================
// UI Types
// ============================================================

export type InputMode = "duration" | "datetime";

export interface DurationInput {
  hours: number;
  minutes: number;
  seconds: number;
}

// ============================================================
// Color Palette
// ============================================================

export const EVENT_COLORS = [
  "#6366F1", // Indigo
  "#EC4899", // Pink
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#3B82F6", // Blue
] as const;
