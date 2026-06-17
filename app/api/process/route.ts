import { NextResponse } from "next/server";
import { inngest } from "@/lib/ai/pipeline/inngest.client";

export async function POST(req: Request) {
  try {
    const { paperId } = await req.json();

    if (!paperId) {
      return NextResponse.json({ error: "Missing paperId" }, { status: 400 });
    }

    // Send the event to Inngest to kick off the pipeline
    await inngest.send({
      name: "paper.uploaded",
      data: { paperId },
    });

    return NextResponse.json({ success: true, paperId });
  } catch (error) {
    console.error("Failed to trigger process pipeline:", error);
    return NextResponse.json({ error: "Failed to start pipeline" }, { status: 500 });
  }
}
