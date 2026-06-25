import { AIProvider } from "./ai-provider.interface";
import { Message } from "../prompt/prompt-builder";
import { StreamEvent } from "../stream/stream-handler";

export class ClaudeProvider implements AIProvider {
  async generate(messages: Message[]): Promise<string> {
    return "[Claude] I am currently operating in mock mode. Please configure my API key to enable full responses.";
  }

  async embed(text: string): Promise<number[]> {
    return new Array(1536).fill(0).map(() => Math.random() - 0.5);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return texts.map(() => new Array(1536).fill(0).map(() => Math.random() - 0.5));
  }

  async *stream(messages: Message[]): AsyncIterable<string> {
    const response = "[Claude] I am currently operating in mock mode. Please configure my API key to enable full responses.";
    for (const char of response) {
      yield char;
      await new Promise(r => setTimeout(r, 10));
    }
  }

  async health(): Promise<boolean> {
    return false;
  }
}
