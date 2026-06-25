import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { env } from "../../../lib/env";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check DB
    const { error: dbError } = await supabase.from('projects').select('id').limit(1);
    
    const isDbHealthy = !dbError;
    const isAiConfigured = !!env.GEMINI_API_KEY;

    // Check if the service as a whole is healthy
    const status = isDbHealthy ? "healthy" : "degraded";
    
    const payload = {
      status,
      timestamp: new Date().toISOString(),
      services: {
        database: isDbHealthy ? "up" : "down",
        ai_provider: isAiConfigured ? "configured" : "unconfigured",
      },
      environment: env.NODE_ENV,
    };

    return NextResponse.json(payload, { status: status === "healthy" ? 200 : 503 });
  } catch (error) {
    return NextResponse.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
