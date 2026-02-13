"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { eventService } from "@/services/event-service";
import type { CreateEventInput, TickTockEvent } from "@/types";

const eventsKey = (boardId: string) => ["events", boardId] as const;

/**
 * Fetch all events for a board through the service layer.
 */
export function useEvents(boardId: string) {
  return useQuery({
    queryKey: eventsKey(boardId),
    queryFn: () => eventService.getAll(boardId),
    enabled: !!boardId,
  });
}

/**
 * Create a new event on a board and invalidate the list cache.
 */
export function useCreateEvent(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEventInput) => eventService.create(boardId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKey(boardId) });
    },
  });
}

/**
 * Update an existing event on a board and invalidate the list cache.
 */
export function useUpdateEvent(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<TickTockEvent, "id" | "createdAt" | "order" | "boardId">>;
    }) => eventService.update(boardId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKey(boardId) });
    },
  });
}

/**
 * Delete an event by ID on a board and invalidate the list cache.
 */
export function useDeleteEvent(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.delete(boardId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKey(boardId) });
    },
  });
}

/**
 * Reorder events by providing the new ordered list of IDs.
 * Persists the order to the database and updates the cache.
 */
export function useReorderEvents(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) => eventService.reorder(boardId, orderedIds),
    onSuccess: (reordered) => {
      // Optimistically update the cache with the new order
      queryClient.setQueryData(eventsKey(boardId), reordered);
    },
  });
}
