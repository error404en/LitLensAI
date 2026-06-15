// ============================================================
// AI Research Copilot Domain Types
// ============================================================

export type AIMessageRole = "user" | "assistant" | "system" | "error" | "thinking";

export interface AICitation {
  readonly id: string;
  readonly paperId: string;
  readonly paperTitle: string;
  readonly page?: number;
  readonly exactQuote?: string;
  readonly paragraph?: string;
}

export interface AIChatMessage {
  readonly id: string;
  readonly conversationId: string;
  readonly role: AIMessageRole;
  readonly content: string;
  readonly citations?: readonly AICitation[];
  readonly createdAt: string;
  readonly isStreaming?: boolean;
}

export interface AIContext {
  readonly paperId: string;
  readonly projectId?: string;
  readonly selectedText?: string;
  readonly selectedPage?: number;
  readonly highlightId?: string;
  readonly annotationId?: string;
}

export interface AIConversation {
  readonly id: string;
  readonly paperId: string;
  readonly projectId?: string;
  readonly title: string;
  readonly isPinned: boolean;
  readonly isFavorite: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AISuggestedQuestion {
  readonly id: string;
  readonly label: string;
  readonly prompt: string;
  readonly icon?: React.ElementType;
}

export interface AIPromptTemplate {
  readonly id: string;
  readonly label: string;
  readonly prompt: string;
  readonly description?: string;
}
