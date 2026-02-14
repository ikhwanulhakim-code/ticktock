import { format, formatDistanceToNow, isPast } from "date-fns";

/**
 * Format an ISO date string into a human-readable date.
 */
export function formatDate(isoString: string): string {
  return format(new Date(isoString), "MMM dd, yyyy");
}

/**
 * Format an ISO date string into a human-readable date-time.
 */
export function formatDateTime(isoString: string): string {
  return format(new Date(isoString), "MMM dd, yyyy HH:mm");
}

/**
 * Get a relative time string like "in 3 hours" or "2 days ago".
 */
export function formatRelative(isoString: string): string {
  return formatDistanceToNow(new Date(isoString), { addSuffix: true });
}

/**
 * Check whether a target date is in the past.
 */
export function isDatePast(isoString: string): boolean {
  return isPast(new Date(isoString));
}

/**
 * Calculate remaining milliseconds until a target date.
 * Returns 0 if the date is in the past.
 */
export function getRemainingMs(targetDate: string): number {
  const diff = new Date(targetDate).getTime() - Date.now();
  return Math.max(0, diff);
}

/**
 * Calculate progress percentage (0–100) based on how much time has elapsed
 * between createdAt and targetDate.
 *
 * Formula: ((now - createdAt) / (targetDate - createdAt)) * 100
 *
 * Accepts an explicit `now` timestamp so the result is a pure function of its
 * inputs — required for React Compiler compatibility and reactive updates via
 * the shared ticker.
 */
export function getProgressPercent(
  createdAt: string,
  targetDate: string,
  now: number = Date.now()
): number {
  const created = new Date(createdAt).getTime();
  const target = new Date(targetDate).getTime();

  const totalDuration = target - created;
  if (totalDuration <= 0) return 100;

  const elapsed = now - created;
  const percent = (elapsed / totalDuration) * 100;

  return Math.min(100, Math.max(0, percent));
}

/**
 * Given a duration in milliseconds, pad + return { days, hours, minutes, seconds }.
 */
export function msToTimeParts(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

/**
 * Pad a number to 2 digits (e.g., 5 → "05").
 */
export function pad(n: number): string {
  return n.toString().padStart(2, "0");
}
