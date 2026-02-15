"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, X, Trash2 } from "lucide-react";
import { getRecentBoards, removeRecentBoard, clearRecentBoards } from "@/services/storage";
import { formatRelative } from "@/lib/date-utils";

// Cached snapshot for useSyncExternalStore — must return same reference if unchanged
let cachedRevision = -1;
let cachedSnapshot: ReturnType<typeof getRecentBoards> = [];
let currentRevision = 0;
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function emitChange() {
  currentRevision++;
  listeners.forEach((cb) => cb());
}

function getSnapshot() {
  if (cachedRevision !== currentRevision) {
    cachedRevision = currentRevision;
    cachedSnapshot = getRecentBoards();
  }
  return cachedSnapshot;
}

const SERVER_SNAPSHOT: ReturnType<typeof getRecentBoards> = [];
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function RecentBoards() {
  const router = useRouter();
  const recentBoards = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function handleRemoveBoard(e: React.MouseEvent, boardId: string) {
    e.stopPropagation();
    removeRecentBoard(boardId);
    emitChange();
  }

  function handleClearAll() {
    clearRecentBoards();
    emitChange();
  }

  if (recentBoards.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-12 w-full max-w-md space-y-3"
      aria-label="Recent boards"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">
          Recent Boards
        </h2>
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Clear all recent boards"
        >
          <Trash2 className="h-3 w-3" />
          Clear all
        </button>
      </div>
      <div className="space-y-2">
        {recentBoards.map((board) => {
          const boardPath = board.isLocal ? `/local/${board.id}` : `/b/${board.id}`;
          const badgeText = board.isLocal ? "📍 Local" : "☁️ Shared";
          const badgeColor = board.isLocal 
            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200" 
            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200";
          
          return (
            <div
              key={board.id}
              className="group w-full flex items-center justify-between rounded-lg border px-4 py-3 text-sm hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => router.push(boardPath)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push(boardPath);
              }}
            >
              <div className="flex flex-col items-start gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs truncate max-w-50">
                    {board.id.slice(board.isLocal ? 6 : 0, board.isLocal ? 14 : 8)}…
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${badgeColor}`}>
                    {badgeText}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Visited {formatRelative(board.visitedAt)}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => handleRemoveBoard(e, board.id)}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 rounded-md hover:bg-destructive/10"
                  aria-label={`Remove board ${board.id.slice(0, 8)}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
