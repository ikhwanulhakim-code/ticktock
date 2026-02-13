import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateEventSchema } from "@/types";

/**
 * Serialize a Prisma Event record to the TickTockEvent shape.
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
 * PUT /api/boards/[boardId]/events/[eventId] — Update an event.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string; eventId: string }> }
) {
  const { boardId, eventId } = await params;

  try {
    // Verify event belongs to the board
    const existing = await prisma.event.findFirst({
      where: { id: eventId, boardId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const result = updateEventSchema.safeParse(body);

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

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: result.data.title,
        description: result.data.description ?? "",
        targetDate: new Date(result.data.targetDate),
        color: result.data.color,
      },
    });

    return NextResponse.json(serializeEvent(updated));
  } catch (error) {
    console.error("[PUT /api/boards/[boardId]/events/[eventId]]", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/boards/[boardId]/events/[eventId] — Delete an event.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ boardId: string; eventId: string }> }
) {
  const { boardId, eventId } = await params;

  try {
    // Verify event belongs to the board
    const existing = await prisma.event.findFirst({
      where: { id: eventId, boardId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    await prisma.event.delete({ where: { id: eventId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/boards/[boardId]/events/[eventId]]", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
