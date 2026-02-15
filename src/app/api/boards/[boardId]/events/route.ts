import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeEvent } from "@/lib/serialize";
import { createEventSchema } from "@/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/boards/[boardId]/events — Fetch all events for a board.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;

  try {
    // Fetch board with updatedAt for sync header
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { updatedAt: true },
    });

    const events = await prisma.event.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
    });

    const response = NextResponse.json(events.map(serializeEvent));
    // Prevent caching so mutations (create/update/delete) are immediately reflected
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    // Add last modified timestamp for sync
    if (board) {
      response.headers.set(
        "X-Last-Modified",
        board.updatedAt.getTime().toString()
      );
    }
    return response;
  } catch (error) {
    console.error("[GET /api/boards/[boardId]/events]", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/boards/[boardId]/events — Create a new event on a board.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;

  try {
    const body = await request.json();
    const result = createEventSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      return NextResponse.json({ errors: fieldErrors }, { status: 400 });
    }

    // Verify board exists and is shared
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { id: true, isShared: true },
    });

    if (!board) {
      return NextResponse.json(
        { error: "Board not found" },
        { status: 404 }
      );
    }

    if (!board.isShared) {
      return NextResponse.json(
        { error: "Board is not shared. Share your board first." },
        { status: 403 }
      );
    }

    // Determine next order value
    const maxOrder = await prisma.event.aggregate({
      where: { boardId },
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const event = await prisma.event.create({
      data: {
        title: result.data.title,
        description: result.data.description ?? "",
        targetDate: new Date(result.data.targetDate),
        color: result.data.color,
        order: nextOrder,
        boardId,
      },
    });

    return NextResponse.json(serializeEvent(event), { status: 201 });
  } catch (error) {
    console.error("[POST /api/boards/[boardId]/events]", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
