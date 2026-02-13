"use client";

import { Hourglass } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Hourglass className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold">No countdowns yet</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Tap the <span className="font-medium">+</span> button above to create
        your first countdown event and start tracking time.
      </p>
    </div>
  );
}
