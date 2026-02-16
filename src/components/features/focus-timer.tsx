"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Maximize2,
  Minimize2,
  Share2,
  RotateCcw,
  Timer,
  CalendarDays,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShareButton } from "@/components/shared/share-button";
import { useTimer } from "@/hooks/use-timer";
import { pad, formatDateTime, msToTimeParts } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import type { TickTockEvent } from "@/types";

interface FocusTimerProps {
  event: TickTockEvent;
  onClose: () => void;
  onShare?: () => void;
  onRestart?: (id: string) => void;
}

export function FocusTimer({
  event,
  onClose,
  onShare,
  onRestart,
}: FocusTimerProps) {
  const timer = useTimer(event.targetDate, event.createdAt);
  const [isImmersive, setIsImmersive] = useState(false);
  const canRestart = event.timerMode === "duration";

  const displayTitle = event.title;

  // Escape key to exit focus mode or immersive mode
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isImmersive) {
          setIsImmersive(false);
        } else {
          onClose();
        }
      }
    },
    [onClose, isImmersive],
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
                onClick={onClose}
                aria-label="Exit focus mode"
              >
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-4 flex gap-2"
            >
              {canRestart && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRestart?.(event.id)}
                  aria-label="Restart countdown"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restart
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsImmersive(true)}
                aria-label="Enter immersive mode"
              >
                <Maximize2 className="h-4 w-4" />
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

      {/* Title and description */}
      <AnimatePresence>
        {!isImmersive && (
          <>
            {displayTitle && (
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-2 text-center text-2xl font-bold px-4"
                style={{ color: event.color }}
              >
                {displayTitle}
              </motion.h2>
            )}
            {event.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-2 max-w-md wrap-break-word text-center text-sm px-4"
                style={{ color: event.color, opacity: 0.7 }}
              >
                {event.description}
              </motion.p>
            )}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-10 flex items-center gap-1.5 text-sm"
              style={{ color: event.color, opacity: 0.7 }}
            >
              {timer.isExpired ? (
                "This countdown has expired"
              ) : event.timerMode === "duration" ? (
                <>
                  <Timer className="h-3.5 w-3.5" />
                  <span>
                    Duration ·{" "}
                    {(() => {
                      const p = msToTimeParts(event.durationMs);
                      const parts: string[] = [];
                      if (p.days > 0) parts.push(`${p.days}d`);
                      if (p.hours > 0) parts.push(`${p.hours}h`);
                      if (p.minutes > 0) parts.push(`${p.minutes}m`);
                      if (p.seconds > 0 || parts.length === 0)
                        parts.push(`${p.seconds}s`);
                      return parts.join(" ");
                    })()}
                  </span>
                </>
              ) : (
                <>
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Target: {formatDateTime(event.targetDate)}</span>
                </>
              )}
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
          <span style={{ color: event.color }}>00:00:00</span>
        ) : (
          <>
            {timer.days > 0 && (
              <div
                className="mb-2 text-center text-3xl sm:text-4xl"
                style={{ color: event.color, opacity: 0.7 }}
              >
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
