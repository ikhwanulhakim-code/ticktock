"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SyncStatus } from "@/types";

// ============================================================
// Context Types
// ============================================================

interface LocalBoardContextValue {
  isLocal: boolean;
  boardId: string;
  syncStatus: SyncStatus;
}

// ============================================================
// Context
// ============================================================

const LocalBoardContext = createContext<LocalBoardContextValue | null>(null);

// ============================================================
// Provider
// ============================================================

export function LocalBoardProvider({
  boardId,
  isLocal,
  syncStatus = "local",
  children,
}: {
  boardId: string;
  isLocal: boolean;
  syncStatus?: SyncStatus;
  children: ReactNode;
}) {
  return (
    <LocalBoardContext.Provider value={{ boardId, isLocal, syncStatus }}>
      {children}
    </LocalBoardContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

export function useLocalBoardContext(): LocalBoardContextValue {
  const context = useContext(LocalBoardContext);
  if (!context) {
    throw new Error(
      "useLocalBoardContext must be used within LocalBoardProvider"
    );
  }
  return context;
}
