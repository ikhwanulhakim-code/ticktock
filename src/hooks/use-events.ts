"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { eventService } from "@/services/event-service";
import type { CreateEventInput, TickTockEvent } from "@/types";

const eventsKey = (boardId: string) => ["events", boardId] as const;

/**
 * Fetch all events for a board through the service layer.
 */
export function useEvents(boardId: string) {
  return useQuery({
    queryKey: eventsKey(boardId),
    queryFn: ({ signal }) => eventService.getAll(boardId, signal),
    enabled: !!boardId,
    retry: (failureCount, error: Error & { status?: number }) => {
      // Don't retry on 404s
      if (error?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

/**
 * Create a new event on a board.
 * Uses optimistic updates so the countdown appears immediately
 * without waiting for the API round-trip (prevents time drift).
 */
export function useCreateEvent(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateEventInput): Promise<TickTockEvent> => {
      return eventService.create(boardId, input);
    },

    // Optimistically add the event BEFORE the API call
    onMutate: async (input: CreateEventInput) => {
      await queryClient.cancelQueries({ queryKey: eventsKey(boardId) });
      const previous = queryClient.getQueryData<TickTockEvent[]>(
        eventsKey(boardId),
      );

      const tempId = crypto.randomUUID();

      const optimisticEvent: TickTockEvent = {
        id: tempId,
        title: input.title,
        description: input.description ?? "",
        targetDate: input.targetDate,
        color: input.color,
        timerMode: input.timerMode,
        createdAt: new Date().toISOString(),
        durationMs:
          input.timerMode === "duration"
            ? Math.max(0, new Date(input.targetDate).getTime() - Date.now())
            : 0,
        isCompleted: false,
        order: previous?.length ?? 0,
        boardId,
      };

      queryClient.setQueryData<TickTockEvent[]>(eventsKey(boardId), (old) =>
        old ? [...old, optimisticEvent] : [optimisticEvent],
      );

      return { previous, tempId };
    },

    // Replace the optimistic event with the real server response
    onSuccess: (serverEvent, _input, context) => {
      if (context?.tempId) {
        queryClient.setQueryData<TickTockEvent[]>(eventsKey(boardId), (old) =>
          old
            ? old.map((e) => (e.id === context.tempId ? serverEvent : e))
            : [serverEvent],
        );
      }
    },

    // Rollback on error
    onError: (_err, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(eventsKey(boardId), context.previous);
      }
    },
  });
}

/**
 * Update an existing event on a board with optimistic cache update.
 */
export function useUpdateEvent(boardId: string) {
  const queryClient = useQueryClient();

  type UpdatePayload = {
    id: string;
    data: Partial<
      Omit<
        TickTockEvent,
        "id" | "createdAt" | "order" | "boardId" | "targetDate" | "durationMs"
      >
    >;
  };

  return useMutation({
    mutationFn: ({ id, data }: UpdatePayload) =>
      eventService.update(boardId, id, data),

    onMutate: async ({ id, data }: UpdatePayload) => {
      await queryClient.cancelQueries({ queryKey: eventsKey(boardId) });
      const previous = queryClient.getQueryData<TickTockEvent[]>(
        eventsKey(boardId),
      );

      queryClient.setQueryData<TickTockEvent[]>(eventsKey(boardId), (old) =>
        old ? old.map((e) => (e.id === id ? { ...e, ...data } : e)) : old,
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(eventsKey(boardId), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventsKey(boardId) });
    },
  });
}

/**
 * Restart a countdown — resets createdAt and targetDate using the stored durationMs.
 */
export function useRestartEvent(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.restart(boardId, eventId),

    // Optimistic update - instant restart
    onMutate: async (eventId: string) => {
      await queryClient.cancelQueries({ queryKey: eventsKey(boardId) });
      const previous = queryClient.getQueryData<TickTockEvent[]>(
        eventsKey(boardId),
      );

      queryClient.setQueryData<TickTockEvent[]>(eventsKey(boardId), (old) => {
        if (!old) return old;
        return old.map((event) => {
          if (event.id === eventId && event.durationMs > 0) {
            const now = Date.now();
            return {
              ...event,
              createdAt: new Date(now).toISOString(),
              targetDate: new Date(now + event.durationMs).toISOString(),
              isCompleted: false,
            };
          }
          return event;
        });
      });

      return { previous };
    },

    onError: (_error, _eventId, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData<TickTockEvent[]>(
          eventsKey(boardId),
          context.previous,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventsKey(boardId) });
    },
  });
}

/**
 * Delete an event by ID on a board with optimistic cache removal.
 */
export function useDeleteEvent(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.delete(boardId, id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: eventsKey(boardId) });
      const previous = queryClient.getQueryData<TickTockEvent[]>(
        eventsKey(boardId),
      );

      queryClient.setQueryData<TickTockEvent[]>(eventsKey(boardId), (old) =>
        old ? old.filter((e) => e.id !== id) : [],
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(eventsKey(boardId), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventsKey(boardId) });
    },
  });
}

/**
 * Reorder events by providing the new ordered list of IDs.
 * Uses optimistic updates so the UI reflects the new order immediately
 * without waiting for the API round-trip (prevents snap-back animation).
 */
export function useReorderEvents(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      eventService.reorder(boardId, orderedIds),

    // Optimistically reorder the cache BEFORE the API call
    onMutate: async (orderedIds: string[]) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: eventsKey(boardId) });

      // Snapshot the previous value for rollback
      const previous = queryClient.getQueryData<TickTockEvent[]>(
        eventsKey(boardId),
      );

      // Optimistically update the cache with the new order
      if (previous) {
        const orderMap = new Map(orderedIds.map((id, idx) => [id, idx]));
        const optimistic = [...previous].sort(
          (a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0),
        );
        queryClient.setQueryData(eventsKey(boardId), optimistic);
      }

      return { previous };
    },

    // Rollback on error
    onError: (_err, _orderedIds, context) => {
      if (context?.previous) {
        queryClient.setQueryData(eventsKey(boardId), context.previous);
      }
      toast.error("Failed to reorder events");
    },

    // Sync with server response
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventsKey(boardId) });
    },
  });
}
