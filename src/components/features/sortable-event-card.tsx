"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EventCard } from "./event-card";
import type { TickTockEvent } from "@/types";

interface SortableEventCardProps {
  event: TickTockEvent;
  isDeleting?: boolean;
  onDelete: (id: string) => void;
  onEdit: (event: TickTockEvent) => void;
  onClick: (event: TickTockEvent) => void;
  onRestart?: (id: string) => void;
}

export function SortableEventCard({
  event,
  isDeleting,
  onDelete,
  onEdit,
  onClick,
  onRestart,
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
    transition: transition || "transform 150ms ease-out",
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
    touchAction: "none" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative min-w-0 cursor-grab active:cursor-grabbing"
      data-event-id={event.id}
      {...attributes}
      {...listeners}
    >
      <EventCard
        event={event}
        isDeleting={isDeleting}
        isDragging={isDragging}
        onDelete={onDelete}
        onEdit={onEdit}
        onClick={onClick}
        onRestart={onRestart}
      />
    </div>
  );
}
