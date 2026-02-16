"use client";

import { Pencil, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTimer } from "@/hooks/use-timer";
import { pad, formatEventFallbackTitle } from "@/lib/date-utils";
import { Progress } from "@/components/ui/progress";
import type { TickTockEvent } from "@/types";

interface EventCardProps {
  event: TickTockEvent;
  isDeleting?: boolean;
  onDelete: (id: string) => void;
  onEdit: (event: TickTockEvent) => void;
  onClick: (event: TickTockEvent) => void;
}

export function EventCard({
  event,
  isDeleting,
  onDelete,
  onEdit,
  onClick,
}: EventCardProps) {
  const timer = useTimer(event.targetDate, event.createdAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="group relative max-w-full cursor-pointer overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
      style={{ borderLeftColor: event.color, borderLeftWidth: 4 }}
      onClick={() => onClick(event)}
    >
      {/* Deleting overlay */}
      {isDeleting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-[2px]">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Deleting…
          </div>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold leading-tight">
            {event.title.trim() ||
              formatEventFallbackTitle(new Date(event.targetDate))}
          </h3>
          {event.description && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground/80">
              {event.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
            className="rounded-md p-1.5 text-muted-foreground opacity-70 transition-all hover:bg-muted hover:text-foreground md:opacity-0 md:group-hover:opacity-100"
            aria-label={`Edit ${event.title.trim() || "event"}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event.id);
            }}
            disabled={isDeleting}
            className={cn(
              "rounded-md p-1.5 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive",
              isDeleting
                ? "opacity-50"
                : "opacity-70 md:opacity-0 md:group-hover:opacity-100",
            )}
            aria-label={`Delete ${event.title.trim() || "event"}`}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Timer display */}
      <div className="mt-4 font-mono text-3xl font-bold tracking-wider tabular-nums">
        {timer.isExpired ? (
          <span className="text-red-500">00:00:00</span>
        ) : (
          <>
            {timer.days > 0 && (
              <span className="text-lg text-muted-foreground">
                {timer.days}d{" "}
              </span>
            )}
            <span style={{ color: event.color }}>
              {pad(timer.hours)}:{pad(timer.minutes)}:{pad(timer.seconds)}
            </span>
          </>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <Progress
          value={100 - timer.progressPercent}
          className="h-1.5"
          style={
            {
              "--progress-foreground": event.color,
            } as React.CSSProperties
          }
        />
      </div>
    </motion.div>
  );
}
