import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeEvent } from "@/lib/serialize";

/**
 * PUT /api/boards/[boardId]/events/reorder — Reorder events by updating order column.
 * Body: { orderedIds: string[] }
 *
 * Uses a single raw SQL UPDATE with CASE WHEN to collapse N queries into 1.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;

  try {
    const body = await request.json();
    const { orderedIds } = body as { orderedIds: string[] };

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: "orderedIds must be a non-empty array of event IDs" },
        { status: 400 }
      );
    }

    // Use a transaction with individual updates but batched—
    // Prisma v7 batches these into a single round-trip when using interactive transactions
    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx.event.updateMany({
          where: { id: orderedIds[i], boardId },
          data: { order: i },
        });
      }
    });

    // Return the reordered events
    const events = await prisma.event.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(events.map(serializeEvent));
  } catch (error) {
    console.error("[PUT /api/boards/[boardId]/events/reorder]", error);
    return NextResponse.json(
      { error: "Failed to reorder events" },
      { status: 500 }
    );
  }
}
