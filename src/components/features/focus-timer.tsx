"use client";

import { useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShareButton } from "@/components/shared/share-button";
import { useTimer } from "@/hooks/use-timer";
import { pad, formatDateTime } from "@/lib/date-utils";
import type { TickTockEvent } from "@/types";

interface FocusTimerProps {
  event: TickTockEvent;
  onBack: () => void;
}

export function FocusTimer({ event, onBack }: FocusTimerProps) {
  const timer = useTimer(event.targetDate, event.createdAt);

  // Escape key to exit focus mode
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack();
    },
    [onBack]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      role="dialog"
      aria-label={`Focus timer for ${event.title}`}
    >
      {/* Back button */}
      <div className="absolute left-4 top-4">
        <Button variant="ghost" size="sm" onClick={onBack} aria-label="Exit focus mode">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Share button */}
      <div className="absolute right-4 top-4">
        <ShareButton
          title={`${event.title} — TickTock`}
          text={`Counting down to ${event.title}!`}
          variant="ghost"
          size="sm"
          label="Share"
        />
      </div>

      {/* Color accent dot */}
      <div
        className="mb-6 h-3 w-3 rounded-full"
        style={{ backgroundColor: event.color }}
      />

      {/* Title */}
      <h2 className="mb-2 text-center text-2xl font-bold">{event.title}</h2>
      {event.description && (
        <p className="mb-2 max-w-md wrap-break-word text-center text-sm text-muted-foreground/80">
          {event.description}
        </p>
      )}
      <p className="mb-10 text-sm text-muted-foreground">
        {timer.isExpired
          ? "This countdown has expired"
          : `Target: ${formatDateTime(event.targetDate)}`}
      </p>

      {/* Massive Timer */}
      <div className="font-mono text-7xl font-bold tracking-wider tabular-nums sm:text-8xl md:text-9xl">
        {timer.isExpired ? (
          <span className="text-red-500">00:00:00</span>
        ) : (
          <>
            {timer.days > 0 && (
              <div className="mb-2 text-center text-3xl text-muted-foreground sm:text-4xl">
                {timer.days} day{timer.days !== 1 ? "s" : ""}
              </div>
            )}
            <span>
              {pad(timer.hours)}:{pad(timer.minutes)}:{pad(timer.seconds)}
            </span>
          </>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-12 w-full max-w-md px-6">
        <Progress
          value={100 - timer.progressPercent}
          className="h-2"
          style={
            {
              "--progress-foreground": event.color,
            } as React.CSSProperties
          }
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{Math.round(timer.progressPercent)}% elapsed</span>
          <span>{Math.round(100 - timer.progressPercent)}% remaining</span>
        </div>
      </div>
    </motion.div>
  );
}
