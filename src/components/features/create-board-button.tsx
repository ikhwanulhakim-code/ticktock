"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createLocalBoard } from "@/services/local-storage-service";

export function CreateBoardButton() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateBoard() {
    setIsCreating(true);
    try {
      const board = createLocalBoard();
      router.push(`/local/${board.id}`);
    } catch (error) {
      console.error("Failed to create board:", error);
      toast.error("Failed to create board. Please try again.");
      setIsCreating(false);
    }
  }

  return (
    <Button
      size="lg"
      className="gap-2 text-base"
      onClick={handleCreateBoard}
      disabled={isCreating}
    >
      {isCreating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Creating board…
        </>
      ) : (
        <>
          Return to Home
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
