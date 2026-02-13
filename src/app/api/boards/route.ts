import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/boards — Create a new board.
 * Returns the newly created board with its UUID slug.
 */
export async function POST() {
  try {
    const board = await prisma.board.create({ data: {} });

    return NextResponse.json(
      {
        id: board.id,
        createdAt: board.createdAt.toISOString(),
        updatedAt: board.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/boards]", error);
    return NextResponse.json(
      { error: "Failed to create board" },
      { status: 500 }
    );
  }
}
