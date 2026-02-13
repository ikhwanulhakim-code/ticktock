"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Hourglass, Plus, ArrowRight, Link2, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { boardService } from "@/services/board-service";

const RECENT_BOARDS_KEY = "ticktock_recent_boards";
const MAX_RECENT_BOARDS = 5;

interface RecentBoard {
  id: string;
  visitedAt: string;
}

function getRecentBoards(): RecentBoard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_BOARDS_KEY);
    return raw ? (JSON.parse(raw) as RecentBoard[]) : [];
  } catch {
    return [];
  }
}

export default function LandingPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [recentBoards, setRecentBoards] = useState<RecentBoard[]>([]);

  useEffect(() => {
    setRecentBoards(getRecentBoards());
  }, []);

  async function handleCreateBoard() {
    setIsCreating(true);
    try {
      const board = await boardService.create();
      router.push(`/b/${board.id}`);
    } catch (error) {
      console.error("Failed to create board:", error);
      setIsCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-2 px-4">
          <Hourglass className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">
            Tick<span className="text-primary/60">Tock</span>
          </h1>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg space-y-6"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Hourglass className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Countdown Manager
            </h2>
            <p className="text-muted-foreground text-lg">
              Create beautiful countdown timers. Share them with a magic link —
              no account needed.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
              <Link2 className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground text-center">
                Share via magic link
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
              <div className="flex gap-1">
                <Smartphone className="h-5 w-5 text-primary" />
                <Monitor className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground text-center">
                Cross-device access
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
              <Plus className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground text-center">
                No sign-up required
              </span>
            </div>
          </div>

          {/* CTA */}
          <Button
            size="lg"
            className="gap-2 text-base"
            onClick={handleCreateBoard}
            disabled={isCreating}
          >
            {isCreating ? (
              "Creating…"
            ) : (
              <>
                Create New Board
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>

        {/* Recent boards */}
        {recentBoards.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 w-full max-w-md space-y-3"
          >
            <h3 className="text-sm font-medium text-muted-foreground text-center">
              Recent Boards
            </h3>
            <div className="space-y-2">
              {recentBoards.map((board) => (
                <button
                  key={board.id}
                  onClick={() => router.push(`/b/${board.id}`)}
                  className="w-full flex items-center justify-between rounded-lg border px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
                >
                  <span className="font-mono text-xs truncate">
                    {board.id}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
