import { Message } from "../../repositories/conversation.repository";
import { RankedChunk } from "../ranking/ranker";
import { ProviderType } from "../providers/registry";

export interface OrchestrationContext {
  userId: string;
  projectId?: string;
  paperId?: string;
  conversationId?: string;
  
  // Specific inputs
  query: string;
  selection?: string;
  history?: Message[];
  retrievedChunks?: RankedChunk[];
  annotations?: any[];
  
  // Settings
  preferences?: {
    format?: "markdown" | "plain_text" | "json";
    temperature?: number;
    tokenLimit?: number;
  };
  
  // Routing
  providerName?: ProviderType;
}
