"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/shared/header";
import { SearchBar } from "@/components/shared/search-bar";
import { EventList } from "@/components/features/event-list";
import { EventModal } from "@/components/features/add-event-modal";
import { FocusTimer } from "@/components/features/focus-timer";
import { useEvents, useDeleteEvent, useReorderEvents } from "@/hooks/use-events";
import { useSortPreference } from "@/hooks/use-sort-preference";
import type { TickTockEvent } from "@/types";

const RECENT_BOARDS_KEY = "ticktock_recent_boards";
const MAX_RECENT_BOARDS = 5;

/** Track this board visit in localStorage for the landing page's "Recent Boards" list. */
function trackBoardVisit(boardId: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(RECENT_BOARDS_KEY);
    const boards: { id: string; visitedAt: string }[] = raw ? JSON.parse(raw) : [];
    const filtered = boards.filter((b) => b.id !== boardId);
    filtered.unshift({ id: boardId, visitedAt: new Date().toISOString() });
    localStorage.setItem(
      RECENT_BOARDS_KEY,
      JSON.stringify(filtered.slice(0, MAX_RECENT_BOARDS))
    );
  } catch {
    // Ignore localStorage errors
  }
}

export default function BoardPage() {
  const { slug } = useParams<{ slug: string }>();
  const boardId = slug;

  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<TickTockEvent | null>(null);
  const [focusEvent, setFocusEvent] = useState<TickTockEvent | null>(null);

  const { data: events = [], isLoading } = useEvents(boardId);
  const deleteEvent = useDeleteEvent(boardId);
  const reorderEvents = useReorderEvents(boardId);
  const { sortMode, setSortMode } = useSortPreference(boardId);

  // Track this board visit for the landing page's "Recent Boards"
  useEffect(() => {
    trackBoardVisit(boardId);
  }, [boardId]);

  function handleDelete(id: string) {
    deleteEvent.mutate(id);
  }

  function handleEdit(event: TickTockEvent) {
    setEditEvent(event);
    setModalOpen(true);
  }

  function handleModalOpenChange(open: boolean) {
    setModalOpen(open);
    if (!open) {
      setEditEvent(null);
    }
  }

  function handleReorder(orderedIds: string[]) {
    reorderEvents.mutate(orderedIds);
  }

  // Focus Mode — fullscreen overlay
  if (focusEvent) {
    return (
      <AnimatePresence>
        <FocusTimer
          key={focusEvent.id}
          event={focusEvent}
          onBack={() => setFocusEvent(null)}
        />
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onAddClick={() => { setEditEvent(null); setModalOpen(true); }} />

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Search — only show when there are events */}
        {events.length > 0 && (
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        )}

        {/* Event list */}
        <EventList
          events={events}
          isLoading={isLoading}
          searchQuery={searchQuery}
          sortMode={sortMode}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onSelect={setFocusEvent}
          onReorder={handleReorder}
          onSortModeChange={setSortMode}
        />
      </main>

      {/* Event modal (create / edit) */}
      <EventModal
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        editEvent={editEvent}
        boardId={boardId}
      />
    </div>
  );
}
