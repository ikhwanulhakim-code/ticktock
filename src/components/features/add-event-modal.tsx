"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { useCreateEvent, useUpdateEvent } from "@/hooks/use-events";
import { createEventSchema, updateEventSchema, EVENT_COLORS } from "@/types";
import type { InputMode, DurationInput, TickTockEvent } from "@/types";
import { cn } from "@/lib/utils";

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editEvent?: TickTockEvent | null;
  boardId: string;
  onEventCreated?: (eventId: string) => void;
}

type FieldErrors = Record<string, string>;

export function EventModal({
  open,
  onOpenChange,
  editEvent,
  boardId,
  onEventCreated,
}: EventModalProps) {
  const isEditing = !!editEvent;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<InputMode>("datetime");
  const [dateTimeValue, setDateTimeValue] = useState<Date | undefined>(
    undefined
  );
  const [duration, setDuration] = useState<DurationInput>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  // String display values — avoids leading-zero bug with type="number" inputs
  const [durationDisplay, setDurationDisplay] = useState({ hours: "0", minutes: "0", seconds: "0" });
  const [selectedColor, setSelectedColor] = useState<string>(EVENT_COLORS[0]);
  const [errors, setErrors] = useState<FieldErrors>({});

  const colorInputRef = useRef<HTMLInputElement>(null);
  const createEvent = useCreateEvent(boardId);
  const updateEvent = useUpdateEvent(boardId);

  // Populate form when editing
  useEffect(() => {
    if (editEvent && open) {
      setTitle(editEvent.title);
      setDescription(editEvent.description ?? "");
      setMode("datetime");
      setDateTimeValue(new Date(editEvent.targetDate));
      setSelectedColor(editEvent.color);
      setDuration({ hours: 0, minutes: 0, seconds: 0 });
      setDurationDisplay({ hours: "0", minutes: "0", seconds: "0" });
      setErrors({});
    }
  }, [editEvent, open]);

  function clearFieldError(field: string) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setMode("datetime");
    setDateTimeValue(undefined);
    setDuration({ hours: 0, minutes: 0, seconds: 0 });
    setDurationDisplay({ hours: "0", minutes: "0", seconds: "0" });
    setSelectedColor(EVENT_COLORS[0]);
    setErrors({});
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  }

  function computeTargetDate(): string {
    if (mode === "datetime") {
      return dateTimeValue ? dateTimeValue.toISOString() : "";
    }
    // Duration mode → offset from now
    const ms =
      (duration.hours * 3600 + duration.minutes * 60 + duration.seconds) * 1000;
    if (ms <= 0) return "";
    return new Date(Date.now() + ms).toISOString();
  }

  function handleDurationChange(
    field: keyof DurationInput,
    rawValue: string
  ) {
    // Strip non-digit characters
    const digits = rawValue.replace(/\D/g, "");
    // Remove leading zeros, keep at least "0"
    const clean = digits.replace(/^0+/, "") || "0";
    const parsed = parseInt(clean, 10) || 0;
    const max = field === "hours" ? 99999 : 59;
    const clamped = Math.min(parsed, max);
    const display = String(clamped);

    setDuration((d) => ({ ...d, [field]: clamped }));
    setDurationDisplay((d) => ({ ...d, [field]: display }));
    clearFieldError("targetDate");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const targetDate = computeTargetDate();
    const schema = isEditing ? updateEventSchema : createEventSchema;
    const result = schema.safeParse({
      title,
      description,
      targetDate,
      color: selectedColor,
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      // Map targetDate errors contextually
      if (fieldErrors.targetDate) {
        if (mode === "datetime") {
          fieldErrors.targetDate =
            targetDate === ""
              ? "Please select a date and time"
              : fieldErrors.targetDate;
        } else {
          fieldErrors.targetDate = "Duration must be greater than zero";
        }
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      if (isEditing) {
        await updateEvent.mutateAsync({
          id: editEvent.id,
          data: {
            title: result.data.title,
            description: result.data.description ?? "",
            targetDate: result.data.targetDate,
            color: result.data.color,
          },
        });
      } else {
        const created = await createEvent.mutateAsync({
          title: result.data.title,
          description: result.data.description ?? "",
          targetDate: result.data.targetDate,
          color: result.data.color,
        });
        toast.success("Countdown created!");
        onEventCreated?.(created.id);
      }
      resetForm();
      onOpenChange(false);
    } catch {
      setErrors({
        _form: isEditing ? "Failed to update event" : "Failed to create event",
      });
    }
  }

  const isPending = createEvent.isPending || updateEvent.isPending;

  function handleFormKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter") return;
    const target = e.target as HTMLElement;
    // Allow Enter in textarea for newlines; Cmd/Ctrl+Enter submits from textarea
    if (target.tagName === "TEXTAREA") {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        const form = target.closest("form");
        form?.requestSubmit();
      }
      return;
    }
    // Enter from any input field submits the form
    if (target.tagName === "INPUT" && (target as HTMLInputElement).type !== "color") {
      e.preventDefault();
      const form = target.closest("form");
      form?.requestSubmit();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Countdown" : "New Countdown"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your countdown details below."
                : "Set a countdown by choosing a specific date or entering a duration."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="mt-4 space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input
                id="event-title"
                placeholder="e.g., Project deadline"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  clearFieldError("title");
                }}
                className={cn(errors.title && "border-destructive")}
                autoFocus
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="event-description">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="event-description"
                placeholder="Add some details about this event…"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  clearFieldError("description");
                }}
                className={cn(
                  "min-h-20 resize-none",
                  errors.description && "border-destructive"
                )}
                maxLength={500}
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Mode Toggle */}
            <div className="space-y-2">
              <Label>Timer Mode</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={mode === "datetime" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("datetime")}
                >
                  Specific Date
                </Button>
                <Button
                  type="button"
                  variant={mode === "duration" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("duration")}
                >
                  Duration
                </Button>
              </div>
            </div>

            {/* Mode-specific inputs */}
            <AnimatePresence mode="wait">
              {mode === "datetime" ? (
                <motion.div
                  key="datetime"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-2"
                >
                  <Label>Target Date & Time</Label>
                  <DateTimePicker
                    value={dateTimeValue}
                    onChange={(date) => {
                      setDateTimeValue(date);
                      clearFieldError("targetDate");
                    }}
                    hasError={!!errors.targetDate}
                  />
                  {errors.targetDate && (
                    <p className="text-xs text-destructive">
                      {errors.targetDate}
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="duration"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-2"
                >
                  <Label>Duration</Label>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1">
                      <span className="text-xs text-muted-foreground">
                        Hours
                      </span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={durationDisplay.hours}
                        onChange={(e) => handleDurationChange("hours", e.target.value)}
                        onFocus={(e) => { if (durationDisplay.hours === "0") { setDurationDisplay((d) => ({ ...d, hours: "" })); } e.target.select(); }}
                        onBlur={() => { if (!durationDisplay.hours) setDurationDisplay((d) => ({ ...d, hours: "0" })); }}
                        className={cn(
                          errors.targetDate && "border-destructive"
                        )}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-xs text-muted-foreground">
                        Minutes
                      </span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={durationDisplay.minutes}
                        onChange={(e) => handleDurationChange("minutes", e.target.value)}
                        onFocus={(e) => { if (durationDisplay.minutes === "0") { setDurationDisplay((d) => ({ ...d, minutes: "" })); } e.target.select(); }}
                        onBlur={() => { if (!durationDisplay.minutes) setDurationDisplay((d) => ({ ...d, minutes: "0" })); }}
                        className={cn(
                          errors.targetDate && "border-destructive"
                        )}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-xs text-muted-foreground">
                        Seconds
                      </span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={durationDisplay.seconds}
                        onChange={(e) => handleDurationChange("seconds", e.target.value)}
                        onFocus={(e) => { if (durationDisplay.seconds === "0") { setDurationDisplay((d) => ({ ...d, seconds: "" })); } e.target.select(); }}
                        onBlur={() => { if (!durationDisplay.seconds) setDurationDisplay((d) => ({ ...d, seconds: "0" })); }}
                        className={cn(
                          errors.targetDate && "border-destructive"
                        )}
                      />
                    </div>
                  </div>
                  {errors.targetDate && (
                    <p className="text-xs text-destructive">
                      {errors.targetDate}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Color Palette */}
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex items-center gap-3">
                {EVENT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color);
                      clearFieldError("color");
                    }}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                      selectedColor === color
                        ? "border-foreground scale-110"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}

                {/* Custom color indicator — show when a non-preset color is selected */}
                {!EVENT_COLORS.includes(
                  selectedColor as (typeof EVENT_COLORS)[number]
                ) && (
                  <button
                    type="button"
                    onClick={() => colorInputRef.current?.click()}
                    className="h-8 w-8 rounded-full border-2 border-foreground scale-110 transition-transform hover:scale-110"
                    style={{ backgroundColor: selectedColor }}
                    aria-label="Custom color selected"
                  />
                )}

                {/* Custom color picker trigger */}
                <button
                  type="button"
                  onClick={() => colorInputRef.current?.click()}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40 transition-colors hover:border-muted-foreground hover:bg-muted"
                  )}
                  aria-label="Pick custom color"
                >
                  <Palette className="h-4 w-4 text-muted-foreground" />
                </button>

                {/* Hidden native color input */}
                <input
                  ref={colorInputRef}
                  type="color"
                  value={selectedColor}
                  onChange={(e) => {
                    setSelectedColor(e.target.value);
                    clearFieldError("color");
                  }}
                  className="sr-only"
                  tabIndex={-1}
                />
              </div>
              {errors.color && (
                <p className="text-xs text-destructive">{errors.color}</p>
              )}
            </div>

            {/* Generic form error */}
            {errors._form && (
              <p className="text-sm font-medium text-destructive">
                {errors._form}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEditing ? "Saving…" : "Creating…"}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Start Countdown"
              )}
            </Button>
          </form>
      </DialogContent>
    </Dialog>
  );
}

// Keep backward-compatible export
export { EventModal as AddEventModal };
