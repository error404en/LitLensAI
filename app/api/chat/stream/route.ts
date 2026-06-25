import { NextRequest } from "next/server";
import { AIService } from "../../../../services/ai.service";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { conversationId, prompt, context } = body;

    if (!conversationId || !prompt) {
      return new Response("Missing required fields", { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const savedMessage = await AIService.streamAssistantResponse(
            conversationId,
            prompt,
            context || null,
            (chunk) => {
              // chunk is the delta
              controller.enqueue(encoder.encode(`chunk:${chunk}\n`));
            }
          );
          // Return the saved message at the end
          controller.enqueue(encoder.encode(`done:${JSON.stringify(savedMessage)}\n`));
          controller.close();
        } catch (err) {
          console.error("Streaming error:", err);
          controller.enqueue(encoder.encode(`error:${err instanceof Error ? err.message : String(err)}\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    console.error("API route error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
