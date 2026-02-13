import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/boards/[boardId]/events/reorder — Reorder events by updating order column.
 * Body: { orderedIds: string[] }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;

  try {
    const body = await request.json();
    const { orderedIds } = body as { orderedIds: string[] };

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "orderedIds must be an array of event IDs" },
        { status: 400 }
      );
    }

    // Update order for each event in a transaction
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.event.updateMany({
          where: { id, boardId },
          data: { order: index },
        })
      )
    );

    // Return the reordered events
    const events = await prisma.event.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(
      events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        targetDate: event.targetDate.toISOString(),
        createdAt: event.createdAt.toISOString(),
        color: event.color,
        isCompleted: event.isCompleted,
        order: event.order,
        boardId: event.boardId,
      }))
    );
  } catch (error) {
    console.error("[PUT /api/boards/[boardId]/events/reorder]", error);
    return NextResponse.json(
      { error: "Failed to reorder events" },
      { status: 500 }
    );
  }
}
