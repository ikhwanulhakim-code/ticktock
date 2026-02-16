"use client";

import { useMemo, useEffect } from "react";
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
import { SortableEventCard } from "./sortable-event-card";
import { EmptyState } from "./empty-state";
import { EventListSkeleton } from "./event-list-skeleton";
import type { TickTockEvent, SortMode } from "@/types";

interface EventListProps {
  events: TickTockEvent[];
  isLoading: boolean;
  searchQuery: string;
  sortMode: SortMode;
  deletingIds?: Set<string>;
  highlightEventId?: string | null;
  onDelete: (id: string) => void;
  onEdit: (event: TickTockEvent) => void;
  onSelect: (event: TickTockEvent) => void;
  onReorder: (orderedIds: string[]) => void;
  onSortModeChange: (mode: SortMode) => void;
  onHighlightComplete?: () => void;
  onRestart?: (id: string) => void;
}

/**
 * Sort events by targetDate ascending (closest deadline first).
 */
function sortByUrgency(events: TickTockEvent[]): TickTockEvent[] {
  return [...events].sort(
    (a, b) =>
      new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime(),
  );
}

export function EventList({
  events,
  isLoading,
  searchQuery,
  sortMode,
  deletingIds,
  highlightEventId,
  onDelete,
  onEdit,
  onSelect,
  onReorder,
  onSortModeChange,
  onHighlightComplete,
  onRestart,
}: EventListProps) {
  // Sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Auto-scroll to newly created event and apply highlight animation
  useEffect(() => {
    if (!highlightEventId) return;
    // Wait for the DOM to update after query invalidation
    const rafId = requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(
        `[data-event-id="${highlightEventId}"]`,
      );
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Apply highlight after scroll settles
      const highlightTimer = setTimeout(() => {
        el.classList.add("event-highlight");
        const cleanup = () => {
          el.classList.remove("event-highlight");
          onHighlightComplete?.();
        };
        el.addEventListener("animationend", cleanup, { once: true });
      }, 500);
      return () => clearTimeout(highlightTimer);
    });
    return () => cancelAnimationFrame(rafId);
  }, [highlightEventId, events, onHighlightComplete]);

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
      e.title.toLowerCase().includes(searchQuery.toLowerCase()),
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
    return <EventListSkeleton />;
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
          <div className="grid min-w-0 gap-4">
            {filtered.map((event) => (
              <SortableEventCard
                key={event.id}
                event={event}
                isDeleting={deletingIds?.has(event.id)}
                onDelete={onDelete}
                onEdit={onEdit}
                onClick={onSelect}
                onRestart={onRestart}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
