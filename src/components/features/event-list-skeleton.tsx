"use client";

import { cn } from "@/lib/utils";

/**
 * Realistic card-shaped skeleton matching EventCard layout.
 * Shows a shimmer effect for better perceived performance.
 */
function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: "hsl(var(--muted))",
        animationDelay: `${index * 150}ms`,
      }}
    >
      {/* Shimmer overlay */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent" />

      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-2">
          {/* Title */}
          <div className="h-5 w-3/5 animate-pulse rounded-md bg-muted" />
          {/* Description */}
          <div className="h-3 w-2/5 animate-pulse rounded-md bg-muted/60" />
          {/* Status */}
          <div className="h-3 w-24 animate-pulse rounded-md bg-muted/40" />
        </div>

        {/* Action buttons placeholder */}
        <div className="flex items-center gap-1">
          <div className="h-7 w-7 animate-pulse rounded-md bg-muted/30" />
          <div className="h-7 w-7 animate-pulse rounded-md bg-muted/30" />
        </div>
      </div>

      {/* Timer display */}
      <div className="mt-4 flex items-baseline gap-1">
        <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-1.5 w-full animate-pulse rounded-full bg-muted/60" />
      </div>
    </div>
  );
}

export function EventListSkeleton() {
  return (
    <div className="space-y-3">
      {/* Sort mode placeholder */}
      <div className="flex items-center justify-end">
        <div className="h-6 w-28 animate-pulse rounded-md bg-muted/40" />
      </div>

      {/* Card skeletons */}
      <div className="grid min-w-0 gap-4 pl-7">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="relative min-w-0">
            {/* Drag handle placeholder */}
            <div className="absolute -left-5 top-1/2 flex h-8 w-6 -translate-y-1/2 items-center justify-center">
              <div className="h-4 w-4 animate-pulse rounded bg-muted/30" />
            </div>
            <SkeletonCard index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
