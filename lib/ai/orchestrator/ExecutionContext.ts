import { Message } from "../../repositories/conversation.repository";
import { RankedChunk } from "../ranking/ranker";
import { ProviderType } from "../providers/registry";

export interface SelectionContext {
  text: string;
  pageNumber?: number;
}

export interface AnnotationContext {
  id: string;
  type: "highlight" | "note";
  content: string;
  pageNumber: number;
}

export interface ConversationContext {
  conversationId: string;
  history: Message[];
}

export interface GenerationOptions {
  format?: "markdown" | "plain_text" | "json";
  temperature?: number;
  tokenLimit?: number;
}

export interface ProviderConfig {
  name: ProviderType;
  model?: string;
}

export interface OrchestrationContext {
  userId: string;
  projectId?: string;
  paperId?: string;
  
  // Specific inputs
  query: string;
  selection?: SelectionContext;
  conversation?: ConversationContext;
  retrievedChunks?: RankedChunk[];
  annotations?: AnnotationContext[];
  
  // Settings
  preferences?: GenerationOptions;
  
  // Routing
  providerName?: ProviderType;
}
