"use client";

import { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { ArrowUpDown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableEventCard } from "./sortable-event-card";
import { EmptyState } from "./empty-state";
import type { TickTockEvent, SortMode } from "@/types";

interface EventListProps {
  events: TickTockEvent[];
  isLoading: boolean;
  searchQuery: string;
  sortMode: SortMode;
  onDelete: (id: string) => void;
  onEdit: (event: TickTockEvent) => void;
  onSelect: (event: TickTockEvent) => void;
  onReorder: (orderedIds: string[]) => void;
  onSortModeChange: (mode: SortMode) => void;
}

/**
 * Sort events by targetDate ascending (closest deadline first).
 */
function sortByUrgency(events: TickTockEvent[]): TickTockEvent[] {
  return [...events].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );
}

export function EventList({
  events,
  isLoading,
  searchQuery,
  sortMode,
  onDelete,
  onEdit,
  onSelect,
  onReorder,
  onSortModeChange,
}: EventListProps) {
  // Sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Apply sorting based on mode
  const sortedEvents = useMemo(() => {
    if (sortMode === "urgency") {
      return sortByUrgency(events);
    }
    return events; // custom order — as stored
  }, [events, sortMode]);

  // Apply search filter
  const filtered = useMemo(() => {
    if (!searchQuery) return sortedEvents;
    return sortedEvents.filter((e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedEvents, searchQuery]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Compute new order
    const oldIndex = sortedEvents.findIndex((e) => e.id === active.id);
    const newIndex = sortedEvents.findIndex((e) => e.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...sortedEvents];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const orderedIds = reordered.map((e) => e.id);

    // Switch to custom mode & persist new order
    onSortModeChange("custom");
    onReorder(orderedIds);
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl border bg-muted/40"
          />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return <EmptyState />;
  }

  if (filtered.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No events matching &ldquo;{searchQuery}&rdquo;
      </p>
    );
  }

  // Disable drag when searching (order would be confusing)
  const isDragDisabled = !!searchQuery;

  return (
    <div className="space-y-3">
      {/* Sort mode indicator */}
      <div className="flex items-center justify-end gap-2">
        {sortMode === "custom" ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-muted-foreground"
            onClick={() => onSortModeChange("urgency")}
          >
            <Clock className="h-3.5 w-3.5" />
            Sort by urgency
          </Button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sorted by urgency
          </span>
        )}
      </div>

      {/* Sortable list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={filtered.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid min-w-0 gap-4 pl-7">
            {filtered.map((event) => (
              <SortableEventCard
                key={event.id}
                event={event}
                onDelete={onDelete}
                onEdit={onEdit}
                onClick={onSelect}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
