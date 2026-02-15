import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeEvent } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;
    const body = await request.json();
    const { localTimestamp, mutations = [] } = body;

    // Verify board exists and is shared
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: {
        id: true,
        isShared: true,
        updatedAt: true,
      },
    });

    if (!board) {
      return NextResponse.json(
        { error: "Board not found" },
        { status: 404 }
      );
    }

    if (!board.isShared) {
      return NextResponse.json(
        { error: "Board is not shared" },
        { status: 403 }
      );
    }

    const serverTimestamp = board.updatedAt.getTime();
    const clientTimestamp = localTimestamp ? parseInt(localTimestamp, 10) : 0;

    // Check for conflicts
    if (serverTimestamp > clientTimestamp) {
      // Server has newer data — return conflict
      const events = await prisma.event.findMany({
        where: { boardId },
        orderBy: { order: "asc" },
      });

      return NextResponse.json(
        {
          conflict: true,
          serverVersion: events.map(serializeEvent),
          serverTimestamp,
        },
        { status: 409 }
      );
    }

    // No conflict — apply mutations (simplified implementation)
    // In production, you'd want more sophisticated mutation processing
    for (const mutation of mutations) {
      const { type, payload } = mutation;
      
      switch (type) {
        case "create":
          // Handle create mutation
          break;
        case "update":
          // Handle update mutation
          break;
        case "delete":
          // Handle delete mutation
          break;
        case "reorder":
          // Handle reorder mutation
          break;
        default:
          console.warn(`[POST /api/boards/${boardId}/sync] Unknown mutation type:`, type);
      }
    }

    // Return success
    const updatedEvents = await prisma.event.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(
      {
        success: true,
        events: updatedEvents.map(serializeEvent),
        serverTimestamp: Date.now(),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[POST /api/boards/[boardId]/sync]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
