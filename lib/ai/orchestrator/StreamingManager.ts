import { StreamEvent } from "../stream/stream-handler";

export class StreamingManager {
  /**
   * Adapts any provider's raw string stream into a structured StreamEvent AsyncIterable.
   */
  static async *adapt(rawStream: AsyncIterable<string>): AsyncIterable<StreamEvent> {
    try {
      yield { type: "start" };
      for await (const chunk of rawStream) {
        yield { type: "delta", content: chunk };
      }
      yield { type: "complete" };
    } catch (error: unknown) {
      yield { type: "error", error: error.message };
    }
  }

  /**
   * Helper to execute a stream and collect the full response (useful for logging after the stream finishes).
   * Notice that this consumes the stream, so it shouldn't be used if returning the stream directly to the client
   * without a passthrough mechanism.
   */
  static async consume(stream: AsyncIterable<StreamEvent>): Promise<string> {
    let fullText = "";
    for await (const event of stream) {
      if (event.type === "delta" && event.content) {
        fullText += event.content;
      }
    }
    return fullText;
  }
}
