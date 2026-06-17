import { RankedChunk } from "../ranking/ranker";
import { Message } from "../../repositories/conversation.repository";

export interface BuildContextOptions {
  selectedText?: string;
  retrievedChunks?: RankedChunk[];
  conversationHistory?: Message[];
  projectMetadata?: Record<string, unknown>;
  paperMetadata?: Record<string, unknown>;
}

export interface StructuredContext {
  systemInstructions: string;
  history: Message[];
  retrievedContent: string;
  selection: string;
  metadata: string;
}

export class ContextBuilder {
  /**
   * Aggregates all context into a single structured object.
   * No prompt logic here, just formatting the context parts.
   */
  build(options: BuildContextOptions): StructuredContext {
    let retrievedContent = "";
    if (options.retrievedChunks && options.retrievedChunks.length > 0) {
      retrievedContent = options.retrievedChunks.map((c, i) => 
        `[Source ${i + 1}] (Page ${c.pageNumber}):\n${c.content}`
      ).join("\n\n");
    }

    let metadata = "";
    if (options.paperMetadata) {
      metadata += `Paper Info:\n${JSON.stringify(options.paperMetadata, null, 2)}\n\n`;
    }
    if (options.projectMetadata) {
      metadata += `Project Info:\n${JSON.stringify(options.projectMetadata, null, 2)}\n`;
    }

    return {
      systemInstructions: "", // Left empty for PromptBuilder to fill
      history: options.conversationHistory || [],
      retrievedContent,
      selection: options.selectedText || "",
      metadata,
    };
  }
}
