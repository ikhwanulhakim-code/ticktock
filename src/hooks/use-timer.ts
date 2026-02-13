"use client";

import { useState, useEffect, useRef } from "react";
import type { TimerOutput } from "@/types";
import {
  getRemainingMs,
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
 * - Updates every 1 000 ms via setInterval.
 * - Returns a stable default during SSR to avoid hydration mismatches.
 * - Automatically stops ticking when the timer expires.
 */
export function useTimer(targetDate: string, createdAt: string): TimerOutput {
  const [timer, setTimer] = useState<TimerOutput>(DEFAULT_TIMER);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function tick() {
      const remainingMs = getRemainingMs(targetDate);
      const isExpired = remainingMs <= 0;
      const progressPercent = getProgressPercent(createdAt, targetDate);
      const { days, hours, minutes, seconds } = msToTimeParts(remainingMs);

      setTimer({
        days,
        hours,
        minutes,
        seconds,
        isExpired,
        progressPercent,
        totalRemainingMs: remainingMs,
      });

      // Stop interval once expired
      if (isExpired && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Initial tick on mount
    tick();

    // Start ticking every second
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetDate, createdAt]);

  return timer;
}
