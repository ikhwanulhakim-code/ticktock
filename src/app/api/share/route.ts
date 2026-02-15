import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { shareLocalBoardSchema } from "@/types";
import { serializeEvent, serializeBoard } from "@/lib/serialize";

export const dynamic = "force-dynamic";

// Rate limiting storage (in-memory for dev, should use Redis in prod)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_SHARES_PER_HOUR = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    // First request or window expired
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_SHARES_PER_HOUR) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many share requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "3600",
          },
        }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const result = shareLocalBoardSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? "unknown");
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      return NextResponse.json(
        { error: "Validation failed", errors: fieldErrors },
        { status: 400 }
      );
    }

    const { events, sortPreference, customColors } = result.data;

    if (events.length === 0) {
      return NextResponse.json(
        { error: "Cannot share empty board" },
        { status: 400 }
      );
    }

    // Create board and events in a transaction
    const board = await prisma.board.create({
      data: {
        isShared: true,
        sharedAt: new Date(),
        events: {
          create: events.map((event, index) => ({
            title: event.title ?? "",
            description: event.description ?? "",
            targetDate: new Date(event.targetDate),
            color: event.color,
            isCompleted: false,
            order: index,
          })),
        },
      },
      include: {
        events: {
          orderBy: { order: "asc" },
        },
      },
    });

    // Serialize response
    const serializedBoard = serializeBoard(board);
    const serializedEvents = board.events.map(serializeEvent);

    return NextResponse.json(
      {
        boardId: serializedBoard.id,
        board: serializedBoard,
        events: serializedEvents,
      },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[POST /api/share]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
