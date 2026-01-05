import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getMastra } from "@/mastra";
import { NextRequest, NextResponse } from "next/server";
import type { D1Database } from "@cloudflare/workers-types";

// Use nodejs runtime - Mastra requires Node.js APIs
export const runtime = "nodejs";

/**
 * Health check endpoint for Mastra D1 storage
 * GET /api/mastra
 */
export async function GET() {
  try {
    const { env } = getCloudflareContext();
    const mastra = getMastra(env as { DB: D1Database });

    // Initialize storage (creates tables if they don't exist)
    await mastra.getStorage()?.init();

    return NextResponse.json({
      status: "ok",
      message: "Mastra D1 storage is configured and ready",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Mastra initialization error:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to initialize Mastra",
      },
      { status: 500 }
    );
  }
}

/**
 * Store and retrieve data example
 * POST /api/mastra
 */
export async function POST(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();
    const mastra = getMastra(env as { DB: D1Database });
    const storage = mastra.getStorage();

    if (!storage) {
      return NextResponse.json(
        { status: "error", message: "Storage not configured" },
        { status: 500 }
      );
    }

    // Initialize storage
    await storage.init();

    const body = await request.json();

    return NextResponse.json({
      status: "ok",
      message: "Mastra D1 storage is working",
      received: body,
    });
  } catch (error) {
    console.error("Mastra storage error:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Storage operation failed",
      },
      { status: 500 }
    );
  }
}
