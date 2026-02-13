"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  hasError?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  hasError,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const timeValue = value
    ? `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`
    : "";

  function handleDateSelect(selectedDate: Date | undefined) {
    if (!selectedDate) {
      onChange(undefined);
      return;
    }
    // Preserve existing time if we already have a value
    const newDate = new Date(selectedDate);
    if (value) {
      newDate.setHours(value.getHours(), value.getMinutes(), 0, 0);
    } else {
      newDate.setHours(0, 0, 0, 0);
    }
    onChange(newDate);
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const timeStr = e.target.value;
    if (!timeStr) return;

    const [hours, minutes] = timeStr.split(":").map(Number);
    const newDate = value ? new Date(value) : new Date();

    if (!value) {
      // If no date selected yet, use today
      const today = new Date();
      newDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
    }

    newDate.setHours(hours, minutes, 0, 0);
    onChange(newDate);
  }

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex-1 justify-start text-left font-normal",
              !value && "text-muted-foreground",
              hasError && "border-destructive"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Input
        type="time"
        value={timeValue}
        onChange={handleTimeChange}
        className={cn("w-30", hasError && "border-destructive")}
      />
    </div>
  );
}
