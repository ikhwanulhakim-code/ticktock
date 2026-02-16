"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShareButton } from "@/components/shared/share-button";
import { useTimer } from "@/hooks/use-timer";
import {
  pad,
  formatDateTime,
  formatEventFallbackTitle,
} from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import type { TickTockEvent } from "@/types";

interface FocusTimerProps {
  event: TickTockEvent;
  onBack: () => void;
}

export function FocusTimer({ event, onBack }: FocusTimerProps) {
  const timer = useTimer(event.targetDate, event.createdAt);
  const [isImmersive, setIsImmersive] = useState(false);

  const displayTitle =
    event.title.trim() || formatEventFallbackTitle(new Date(event.targetDate));

  // Escape key to exit focus mode or immersive mode
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isImmersive) {
          setIsImmersive(false);
        } else {
          onBack();
        }
      }
    },
    [onBack, isImmersive],
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
      aria-label={`Focus timer for ${displayTitle}`}
    >
      {/* Top buttons */}
      <AnimatePresence>
        {!isImmersive && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-4 top-4"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                aria-label="Exit focus mode"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-4 flex gap-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsImmersive(true)}
                aria-label="Enter immersive mode"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
              <ShareButton
                title={`${displayTitle} — TickTock`}
                text={`Counting down to ${displayTitle}!`}
                variant="ghost"
                size="sm"
                label="Share"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Color accent dot */}
      <AnimatePresence>
        {!isImmersive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="mb-6 h-3 w-3 rounded-full"
            style={{ backgroundColor: event.color }}
          />
        )}
      </AnimatePresence>

      {/* Title and description */}
      <AnimatePresence>
        {!isImmersive && (
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-2 text-center text-2xl font-bold px-4"
            >
              {displayTitle}
            </motion.h2>
            {event.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-2 max-w-md wrap-break-word text-center text-sm text-muted-foreground/80 px-4"
              >
                {event.description}
              </motion.p>
            )}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-10 text-sm text-muted-foreground"
            >
              {timer.isExpired
                ? "This countdown has expired"
                : `Target: ${formatDateTime(event.targetDate)}`}
            </motion.p>
          </>
        )}
      </AnimatePresence>

      {/* Massive Timer - clickable in immersive mode */}
      <div
        className={cn(
          "font-mono text-7xl font-bold tracking-wider tabular-nums sm:text-8xl md:text-9xl",
          isImmersive && "cursor-pointer",
        )}
        onClick={() => isImmersive && setIsImmersive(false)}
        role={isImmersive ? "button" : undefined}
        aria-label={isImmersive ? "Exit immersive mode" : undefined}
      >
        {timer.isExpired ? (
          <span className="text-red-500">00:00:00</span>
        ) : (
          <>
            {timer.days > 0 && (
              <div className="mb-2 text-center text-3xl text-muted-foreground sm:text-4xl">
                {timer.days} day{timer.days !== 1 ? "s" : ""}
              </div>
            )}
            <span style={{ color: event.color }}>
              {pad(timer.hours)}:{pad(timer.minutes)}:{pad(timer.seconds)}
            </span>
          </>
        )}
      </div>

      {/* Progress bar */}
      <AnimatePresence>
        {!isImmersive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mt-12 w-full max-w-md px-6"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
