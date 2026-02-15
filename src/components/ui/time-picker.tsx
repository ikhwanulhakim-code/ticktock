"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Popover as PopoverPrimitive } from "radix-ui";

interface TimePickerProps {
  hours: number | undefined;
  minutes: number | undefined;
  onChange: (hours: number, minutes: number) => void;
  hasError?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function TimePicker({ hours, minutes, onChange, hasError }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const hourRef = React.useRef<HTMLDivElement>(null);
  const minuteRef = React.useRef<HTMLDivElement>(null);

  // Scroll selected items into view when popover opens
  React.useEffect(() => {
    if (!open) return;

    // Small delay to ensure the popover content is rendered
    const timer = setTimeout(() => {
      if (hours !== undefined && hourRef.current) {
        const el = hourRef.current.querySelector(`[data-value="${hours}"]`);
        el?.scrollIntoView({ block: "center", behavior: "instant" });
      }
      if (minutes !== undefined && minuteRef.current) {
        // Snap to nearest 5-min interval
        const snapped = Math.round((minutes ?? 0) / 5) * 5;
        const el = minuteRef.current.querySelector(`[data-value="${snapped}"]`);
        el?.scrollIntoView({ block: "center", behavior: "instant" });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [open, hours, minutes]);

  const hasValue = hours !== undefined && minutes !== undefined;
  const displayMinutes = minutes !== undefined ? minutes : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-30 justify-start text-left font-normal",
            !hasValue && "text-muted-foreground",
            hasError && "border-destructive"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {hasValue ? `${pad(hours)}:${pad(displayMinutes!)}` : "Time"}
        </Button>
      </PopoverTrigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          side="bottom"
          sideOffset={4}
          avoidCollisions
          collisionPadding={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="z-60 overflow-hidden rounded-md border bg-popover shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          style={{ width: "auto" }}
        >
          <div className="flex divide-x">
            {/* Hours column */}
            <div className="flex flex-col w-16">
              <div className="px-2 py-2 text-xs font-medium text-muted-foreground text-center border-b">
                Hour
              </div>
              <div
                ref={hourRef}
                className="h-50 px-1 py-1"
                style={{ overflowY: "auto", overscrollBehavior: "contain" }}
                onWheel={(e) => e.stopPropagation()}
              >
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    data-value={h}
                    onClick={() => {
                      onChange(h, minutes ?? 0);
                    }}
                    className={cn(
                      "w-full rounded-md px-2 py-1.5 text-sm text-center transition-colors",
                      hours === h
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {pad(h)}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes column */}
            <div className="flex flex-col w-16">
              <div className="px-2 py-2 text-xs font-medium text-muted-foreground text-center border-b">
                Min
              </div>
              <div
                ref={minuteRef}
                className="h-50 px-1 py-1"
                style={{ overflowY: "auto", overscrollBehavior: "contain" }}
                onWheel={(e) => e.stopPropagation()}
              >
                {MINUTES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    data-value={m}
                    onClick={() => {
                      onChange(hours ?? 0, m);
                    }}
                    className={cn(
                      "w-full rounded-md px-2 py-1.5 text-sm text-center transition-colors",
                      minutes !== undefined && Math.round(minutes / 5) * 5 === m
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {pad(m)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </Popover>
  );
}
