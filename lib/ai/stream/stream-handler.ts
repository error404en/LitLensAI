export interface StreamEvent {
  type: "start" | "delta" | "complete" | "error";
  content?: string;
  error?: string;
}

export class StreamHandler {
  /**
   * Adapts a raw async iterable into a standardized stream format
   * Future implementation could convert this to SSE (Server-Sent Events) for Next.js App Router
   */
  async *adaptStream(iterable: AsyncIterable<string>): AsyncIterable<StreamEvent> {
    try {
      yield { type: "start" };
      
      for await (const chunk of iterable) {
        yield { type: "delta", content: chunk };
      }
      
      yield { type: "complete" };
    } catch (error: unknown) {
      yield { type: "error", error: error.message || "Streaming failed" };
    }
  }

  /**
   * Helper to consume the stream into a single string
   */
  async consumeStream(stream: AsyncIterable<StreamEvent>): Promise<string> {
    let fullText = "";
    for await (const event of stream) {
      if (event.type === "delta" && event.content) {
        fullText += event.content;
      }
    }
    return fullText;
  }
}
