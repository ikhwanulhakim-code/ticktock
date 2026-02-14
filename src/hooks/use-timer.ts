"use client";

import { useMemo } from "react";
import type { TimerOutput } from "@/types";
import { useTick } from "@/hooks/use-ticker";
import {
  getProgressPercent,
  msToTimeParts,
} from "@/lib/date-utils";

const DEFAULT_TIMER: TimerOutput = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isExpired: false,
  progressPercent: 0,
  totalRemainingMs: 0,
};

/**
 * Custom hook that returns a live countdown towards `targetDate`.
 *
 * - Derives values from a shared TickerContext (single setInterval for all timers).
 * - Returns a stable default during SSR to avoid hydration mismatches.
 * - Pure derivation — no per-card setInterval.
 */
export function useTimer(targetDate: string, createdAt: string): TimerOutput {
  const now = useTick();

  return useMemo(() => {
    // SSR guard — useTick returns Date.now() which is 0-ish on server
    if (typeof window === "undefined") return DEFAULT_TIMER;

    const targetMs = new Date(targetDate).getTime();
    const remainingMs = Math.max(0, targetMs - now);
    const isExpired = remainingMs <= 0;
    const progressPercent = getProgressPercent(createdAt, targetDate, now);
    const { days, hours, minutes, seconds } = msToTimeParts(remainingMs);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired,
      progressPercent,
      totalRemainingMs: remainingMs,
    };
  }, [now, targetDate, createdAt]);
}
