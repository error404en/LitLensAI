import { AIProvider } from "./ai-provider.interface";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Message } from "../prompt/prompt-builder";

export class OpenAIProvider implements AIProvider {
  private chatModel: ChatOpenAI;
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.chatModel = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0,
    });

    this.embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
    });
  }

  async generate(messages: Message[]): Promise<string> {
    const langchainMessages = messages.map(m => [m.role, m.content] as [string, string]);
    const response = await this.chatModel.invoke(langchainMessages);
    return response.content.toString();
  }

  async embed(text: string): Promise<number[]> {
    return this.embeddings.embedQuery(text);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return this.embeddings.embedDocuments(texts);
  }

  async *stream(messages: Message[]): AsyncIterable<string> {
    const langchainMessages = messages.map(m => [m.role, m.content] as [string, string]);
    const stream = await this.chatModel.stream(langchainMessages);
    for await (const chunk of stream) {
      yield chunk.content.toString();
    }
  }

  async health(): Promise<boolean> {
    try {
      if (!process.env.OPENAI_API_KEY) return false;
      // Do a quick test
      await this.embeddings.embedQuery("test");
      return true;
    } catch {
      return false;
    }
  }
}
