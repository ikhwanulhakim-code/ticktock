"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { EventCard } from "./event-card";
import type { TickTockEvent } from "@/types";

interface SortableEventCardProps {
  event: TickTockEvent;
  onDelete: (id: string) => void;
  onEdit: (event: TickTockEvent) => void;
  onClick: (event: TickTockEvent) => void;
}

export function SortableEventCard({
  event,
  onDelete,
  onEdit,
  onClick,
}: SortableEventCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative min-w-0">
      {/* Drag handle — left side grip */}
      <button
        {...attributes}
        {...listeners}
        className="absolute -left-5 top-1/2 z-10 flex h-8 w-6 -translate-y-1/2 cursor-grab items-center justify-center rounded-md text-muted-foreground/40 transition-colors hover:text-muted-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <EventCard event={event} onDelete={onDelete} onEdit={onEdit} onClick={onClick} />
    </div>
  );
}
