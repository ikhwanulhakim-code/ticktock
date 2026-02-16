"use client";

import { useParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { FocusTimer } from "@/components/features/focus-timer";
import { TickerProvider } from "@/hooks/use-ticker";
import { useLocalEvents, useRestartLocalEvent } from "@/hooks/use-local-events";
import { Loader2 } from "lucide-react";

export default function FocusTimerPage() {
  const { id, eventId } = useParams<{ id: string; eventId: string }>();
  const router = useRouter();
  const boardId = id;

  const { data: events = [] } = useLocalEvents(boardId);
  const restartEvent = useRestartLocalEvent(boardId);
  const event = events.find((e) => e.id === eventId);

  function handleClose() {
    router.push(`/local/${boardId}`);
  }

  function handleRestart(id: string) {
    restartEvent.mutate(id);
  }

  // Event not found
  if (!event) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background">
        <p className="text-lg text-muted-foreground">Event not found</p>
        <button
          onClick={handleClose}
          className="text-sm text-primary hover:underline"
        >
          Back to board
        </button>
      </div>
    );
  }

  return (
    <TickerProvider>
      <AnimatePresence>
        <FocusTimer
          key={event.id}
          event={event}
          onClose={handleClose}
          onRestart={handleRestart}
        />
      </AnimatePresence>
    </TickerProvider>
  );
}
