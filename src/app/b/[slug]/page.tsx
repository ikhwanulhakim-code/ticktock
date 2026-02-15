"use client";

import { useState, useEffect, useCallback, useRef, useDeferredValue } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Header } from "@/components/shared/header";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { SearchBar } from "@/components/shared/search-bar";
import { EventList } from "@/components/features/event-list";
import { SortToggle, SortHint } from "@/components/features/sort-toggle";
import { useEvents, useDeleteEvent, useReorderEvents } from "@/hooks/use-events";
import { useSortPreference } from "@/hooks/use-sort-preference";
import { TickerProvider } from "@/hooks/use-ticker";
import { trackBoardVisit } from "@/services/storage";
import type { TickTockEvent } from "@/types";

// Lazy-load heavy components — only fetched when needed
const EventModal = dynamic(
  () => import("@/components/features/add-event-modal").then((m) => ({ default: m.EventModal })),
  { ssr: false }
);

export default function BoardPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const boardId = slug;

  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<TickTockEvent | null>(null);
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null);
  const clearHighlight = useCallback(() => setNewlyCreatedId(null), []);

  const { data: events = [], isLoading, error } = useEvents(boardId);

  // If the board slug is not a valid UUID, redirect to a new board
  useEffect(() => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(boardId)) {
      // Invalid slug — create a new board and redirect
      import("@/services/board-service").then(({ boardService }) => {
        boardService.create().then((board) => {
          router.replace(`/b/${board.id}`);
        }).catch(() => {
          router.replace("/");
        });
      });
    }
  }, [boardId, router]);
  const deleteEvent = useDeleteEvent(boardId);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const pendingDeletesRef = useRef<Set<string>>(new Set());
  const reorderEvents = useReorderEvents(boardId);
  const { sortMode, setSortMode } = useSortPreference(boardId);

  // Track this board visit for the landing page's "Recent Boards"
  useEffect(() => {
    trackBoardVisit(boardId);
  }, [boardId]);

  function handleDelete(id: string) {
    const eventToDelete = events.find((e) => e.id === id);
    const title = eventToDelete?.title ?? "Countdown";

    toast(`"${title}" deleted`, {
      action: {
        label: "Undo",
        onClick: () => {
          // Cancel this pending delete
          pendingDeletesRef.current.delete(id);
          setDeletingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
      },
      duration: 4000,
      onAutoClose: () => executePendingDelete(),
      onDismiss: () => executePendingDelete(),
    });

    // Mark this delete as pending
    pendingDeletesRef.current.add(id);
    setDeletingIds((prev) => new Set(prev).add(id));

    function executePendingDelete() {
      if (!pendingDeletesRef.current.has(id)) {
        // Undo was clicked — already restored
        return;
      }
      pendingDeletesRef.current.delete(id);

      deleteEvent.mutate(id, {
        onSuccess: () => {
          setDeletingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
        onError: () => {
          setDeletingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          toast.error(`Failed to delete "${title}"`);
        },
      });
    }
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

  function handleFocusEvent(event: TickTockEvent) {
    router.push(`/b/${boardId}/focus/${event.id}`);
  }

  return (
    <TickerProvider>
      <ErrorBoundary>
      <div className="min-h-screen bg-background">
      <Header 
        onAddClick={() => { setEditEvent(null); setModalOpen(true); }}
        boardId={boardId}
        isLocal={false}
      />

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Toolbar: search + sort toggle — only show when there are events */}
        {events.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex-1 min-w-0">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
              <SortToggle value={sortMode} onChange={setSortMode} />
            </div>
            <SortHint sortMode={sortMode} />
          </div>
        )}

        {/* Event list */}
        <EventList
          events={events}
          isLoading={isLoading}
          searchQuery={deferredSearchQuery}
          sortMode={sortMode}
          deletingIds={deletingIds}
          highlightEventId={newlyCreatedId}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onSelect={handleFocusEvent}
          onReorder={handleReorder}
          onSortModeChange={setSortMode}
          onHighlightComplete={clearHighlight}
        />
      </main>

      {/* Event modal (create / edit) */}
      <EventModal
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        editEvent={editEvent}
        boardId={boardId}
        onEventCreated={setNewlyCreatedId}
      />
    </div>
    </ErrorBoundary>
    </TickerProvider>
  );
}
