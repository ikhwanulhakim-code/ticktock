"use client";

import { useParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { FocusTimer } from "@/components/features/focus-timer";
import { TickerProvider } from "@/hooks/use-ticker";
import { useEvents } from "@/hooks/use-events";
import { Loader2 } from "lucide-react";

export default function FocusTimerPage() {
  const { slug, eventId } = useParams<{ slug: string; eventId: string }>();
  const router = useRouter();
  const boardId = slug;

  const { data: events = [], isLoading } = useEvents(boardId);
  const event = events.find((e) => e.id === eventId);

  function handleBack() {
    router.push(`/b/${boardId}`);
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Event not found
  if (!event) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background">
        <p className="text-lg text-muted-foreground">Event not found</p>
        <button
          onClick={handleBack}
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
        <FocusTimer key={event.id} event={event} onBack={handleBack} />
      </AnimatePresence>
    </TickerProvider>
  );
}
