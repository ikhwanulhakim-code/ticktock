"use client";

import { useState, useEffect, useCallback, useDeferredValue } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Header } from "@/components/shared/header";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { SearchBar } from "@/components/shared/search-bar";
import { EventList } from "@/components/features/event-list";
import { SortToggle, SortHint } from "@/components/features/sort-toggle";
import {
  useLocalEvents,
  useDeleteLocalEvent,
  useReorderLocalEvents,
} from "@/hooks/use-local-events";
import { useSortPreference } from "@/hooks/use-sort-preference";
import { TickerProvider } from "@/hooks/use-ticker";
import { LocalBoardProvider } from "@/hooks/use-local-board-context";
import { trackBoardVisit } from "@/services/storage";
import { getLocalBoard, getSharedIdFromLocal } from "@/services/local-storage-service";
import type { TickTockEvent } from "@/types";

// Lazy-load heavy components
const EventModal = dynamic(
  () => import("@/components/features/add-event-modal").then((m) => ({ default: m.EventModal })),
  { ssr: false }
);

export default function LocalBoardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const boardId = id;

  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<TickTockEvent | null>(null);
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null);
  const clearHighlight = useCallback(() => setNewlyCreatedId(null), []);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  // Validate local board ID
  useEffect(() => {
    if (!boardId.startsWith("local_")) {
      // Invalid local board ID
      router.replace("/");
      return;
    }

    // Check if this local board was already shared
    const sharedId = getSharedIdFromLocal(boardId);
    if (sharedId) {
      // Redirect to shared board
      router.replace(`/b/${sharedId}`);
      return;
    }
    
    // Check if board exists
    const board = getLocalBoard(boardId);
    if (!board) {
      // Board not found — redirect to home
      toast.error("Board not found");
      router.replace("/");
      return;
    }
  }, [boardId, router]);

  const { data: events = [] } = useLocalEvents(boardId);
  const deleteEvent = useDeleteLocalEvent(boardId);
  const reorderEvents = useReorderLocalEvents(boardId);
  const { sortMode, setSortMode } = useSortPreference(boardId);

  // Track this board visit
  useEffect(() => {
    trackBoardVisit(boardId, true); // isLocal = true
  }, [boardId]);

  function handleDelete(eventId: string) {
    const eventToDelete = events.find((e) => e.id === eventId);
    const title = eventToDelete?.title ?? "Countdown";

    let undoClicked = false;

    toast(`"${title}" deleted`, {
      action: {
        label: "Undo",
        onClick: () => {
          undoClicked = true;
          setDeletingIds((prev) => {
            const next = new Set(prev);
            next.delete(eventId);
            return next;
          });
        },
      },
      duration: 4000,
      onAutoClose: () => executeDelete(),
      onDismiss: () => executeDelete(),
    });

    setDeletingIds((prev) => new Set(prev).add(eventId));

    function executeDelete() {
      if (undoClicked) return;

      deleteEvent.mutate(eventId, {
        onSuccess: () => {
          setDeletingIds((prev) => {
            const next = new Set(prev);
            next.delete(eventId);
            return next;
          });
        },
        onError: () => {
          setDeletingIds((prev) => {
            const next = new Set(prev);
            next.delete(eventId);
            return next;
          });
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
    // For local boards, we don't have focus mode yet
    // Could implement later or redirect to shared board first
    toast.info("Share your board to use focus mode");
  }

  return (
    <LocalBoardProvider boardId={boardId} isLocal={true} syncStatus="local">
      <TickerProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-background">
            <Header 
              onAddClick={() => { setEditEvent(null); setModalOpen(true); }}
              boardId={boardId}
              isLocal={true}
            />

            <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
              {/* Local board badge */}
              {events.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium">
                    📍 Local Board
                  </span>
                  <span className="text-xs">
                    This board is only on this device. Click Share to publish.
                  </span>
                </div>
              )}

              {/* Toolbar */}
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
                isLoading={false}
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

            {/* Event modal */}
            <EventModal
              open={modalOpen}
              onOpenChange={handleModalOpenChange}
              editEvent={editEvent}
              boardId={boardId}
              onEventCreated={setNewlyCreatedId}
              isLocal={true}
            />
          </div>
        </ErrorBoundary>
      </TickerProvider>
    </LocalBoardProvider>
  );
}
