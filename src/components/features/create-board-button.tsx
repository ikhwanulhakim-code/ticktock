"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { boardService } from "@/services/board-service";

export function CreateBoardButton() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateBoard() {
    setIsCreating(true);
    try {
      const board = await boardService.create();
      router.push(`/b/${board.id}`);
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
          Create New Board
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
