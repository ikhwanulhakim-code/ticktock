"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TickTockEvent, CreateEventInput } from "@/types";
import {
  getLocalEvents,
  createLocalEvent,
  updateLocalEvent,
  deleteLocalEvent,
  reorderLocalEvents,
  restartLocalEvent,
  subscribeToChanges,
} from "@/services/local-storage-service";
import { broadcastLocalChange } from "@/services/broadcast-service";

// ============================================================
// Read Hook
// ============================================================

export function useLocalEvents(boardId: string) {
  // Simple useState for reactive updates
  const [events, setEvents] = useState<TickTockEvent[]>(() =>
    getLocalEvents(boardId),
  );

  const loadEvents = useCallback(() => {
    const loadedEvents = getLocalEvents(boardId);
    console.log(
      "[useLocalEvents] Loaded events for board:",
      boardId,
      "count:",
      loadedEvents.length,
    );
    setEvents(loadedEvents);
  }, [boardId]);

  // Subscribe to localStorage changes
  useEffect(() => {
    console.log("[useLocalEvents] Setting up subscription for board:", boardId);

    // Initial load
    loadEvents();

    // Subscribe to changes - will trigger on any CRUD operation
    const unsubscribe = subscribeToChanges((changedBoardId) => {
      // Reload if this board changed or global change
      if (!changedBoardId || changedBoardId === boardId) {
        console.log(
          "[useLocalEvents] Change detected for board:",
          changedBoardId,
          "reloading...",
        );
        loadEvents();
      }
    });

    return () => {
      console.log(
        "[useLocalEvents] Cleaning up subscription for board:",
        boardId,
      );
      unsubscribe();
    };
  }, [boardId, loadEvents]);

  return {
    data: events,
    isLoading: false,
    error: null,
  };
}

// ============================================================
// Create Hook
// ============================================================

export function useCreateLocalEvent(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateEventInput) => {
      return createLocalEvent(boardId, input);
    },
    onSuccess: (newEvent) => {
      // Invalidate doesn't work for localStorage, but we emit changes already
      // Broadcast to other tabs
      broadcastLocalChange(boardId, "event_created", { eventId: newEvent.id });
    },
    onError: (error) => {
      console.error("[useCreateLocalEvent]", error);
      toast.error("Failed to create event");
    },
  });
}

// ============================================================
// Update Hook
// ============================================================

export function useUpdateLocalEvent(boardId: string) {
  return useMutation({
    mutationFn: async ({
      eventId,
      updates,
    }: {
      eventId: string;
      updates: Partial<Omit<TickTockEvent, "id" | "boardId">>;
    }) => {
      updateLocalEvent(boardId, eventId, updates);
      return { eventId, updates };
    },
    onSuccess: ({ eventId }) => {
      broadcastLocalChange(boardId, "event_updated", { eventId });
    },
    onError: (error) => {
      console.error("[useUpdateLocalEvent]", error);
      toast.error("Failed to update event");
    },
  });
}

// ============================================================
// Restart Hook
// ============================================================

export function useRestartLocalEvent(boardId: string) {
  return useMutation({
    mutationFn: async (eventId: string) => {
      return restartLocalEvent(boardId, eventId);
    },
    onSuccess: (restartedEvent) => {
      broadcastLocalChange(boardId, "event_restarted", {
        eventId: restartedEvent.id,
      });
    },
    onError: (error) => {
      console.error("[useRestartLocalEvent]", error);
    },
  });
}

// ============================================================
// Delete Hook
// ============================================================

export function useDeleteLocalEvent(boardId: string) {
  return useMutation({
    mutationFn: async (eventId: string) => {
      deleteLocalEvent(boardId, eventId);
      return eventId;
    },
    onSuccess: (eventId) => {
      broadcastLocalChange(boardId, "event_deleted", { eventId });
    },
    onError: (error, eventId) => {
      console.error("[useDeleteLocalEvent]", error);
      toast.error("Failed to delete event");
    },
  });
}

// ============================================================
// Reorder Hook
// ============================================================

export function useReorderLocalEvents(boardId: string) {
  return useMutation({
    mutationFn: async (eventIds: string[]) => {
      reorderLocalEvents(boardId, eventIds);
      return eventIds;
    },
    onSuccess: (eventIds) => {
      broadcastLocalChange(boardId, "events_reordered", { eventIds });
    },
    onError: (error) => {
      console.error("[useReorderLocalEvents]", error);
      toast.error("Failed to reorder events");
    },
  });
}
