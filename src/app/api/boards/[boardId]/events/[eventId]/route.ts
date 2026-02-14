import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeEvent } from "@/lib/serialize";
import { updateEventSchema } from "@/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/boards/[boardId]/events/[eventId] — Fetch a single event.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ boardId: string; eventId: string }> }
) {
  const { boardId, eventId } = await params;

  try {
    const event = await prisma.event.findFirst({
      where: { id: eventId, boardId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeEvent(event));
  } catch (error) {
    console.error("[GET /api/boards/[boardId]/events/[eventId]]", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
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
