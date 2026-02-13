import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createEventSchema } from "@/types";

/**
 * Serialize a Prisma Event record to the TickTockEvent shape expected by the client.
 */
function serializeEvent(event: {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  createdAt: Date;
  color: string;
  isCompleted: boolean;
  order: number;
  boardId: string;
}) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    targetDate: event.targetDate.toISOString(),
    createdAt: event.createdAt.toISOString(),
    color: event.color,
    isCompleted: event.isCompleted,
    order: event.order,
    boardId: event.boardId,
  };
}

/**
 * GET /api/boards/[boardId]/events — Fetch all events for a board.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;

  try {
    // Auto-create board if it doesn't exist (magic link pattern)
    await prisma.board.upsert({
      where: { id: boardId },
      update: {},
      create: { id: boardId },
    });

    const events = await prisma.event.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(events.map(serializeEvent));
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

    // Auto-create board if it doesn't exist
    await prisma.board.upsert({
      where: { id: boardId },
      update: {},
      create: { id: boardId },
    });

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
