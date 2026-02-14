"use client";

import { Clock, GripVertical, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SortMode } from "@/types";

interface SortToggleProps {
  value: SortMode;
  onChange: (mode: SortMode) => void;
}

/**
 * Segmented toggle for switching between urgency and custom sort modes.
 * Renders as a pill with two clearly tappable segments so users
 * immediately recognise it as an interactive control.
 * Includes a contextual hint about drag-to-reorder when in urgency mode.
 */
export function SortToggle({ value, onChange }: SortToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Sort mode"
      className="inline-flex h-9 shrink-0 items-center rounded-lg border bg-muted/50 p-0.5 text-muted-foreground"
    >
      <button
        role="radio"
        aria-checked={value === "urgency"}
        onClick={() => onChange("urgency")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          value === "urgency"
            ? "bg-background text-foreground shadow-sm"
            : "hover:text-foreground/80"
        )}
      >
        <Clock className="h-3.5 w-3.5" />
        Urgency
      </button>
      <button
        role="radio"
        aria-checked={value === "custom"}
        onClick={() => onChange("custom")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          value === "custom"
            ? "bg-background text-foreground shadow-sm"
            : "hover:text-foreground/80"
        )}
      >
        <GripVertical className="h-3.5 w-3.5" />
        Custom
      </button>
    </div>
  );
}

/**
 * Small hint text shown below the toolbar.
 * Shows drag-to-reorder hint only in custom mode; shows sort-by-urgency in urgency mode.
 */
export function SortHint({ sortMode }: { sortMode: SortMode }) {
  return (
    <p className="flex items-center justify-end gap-1 text-[11px] leading-tight text-muted-foreground/70">
      <Info className="h-3 w-3 shrink-0" />
      {sortMode === "custom"
        ? "Hold & drag cards to reorder"
        : "Sorted by closest deadline"}
    </p>
  );
}
