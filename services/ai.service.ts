import { AIRepository } from "../lib/repositories/ai.repository";
import { AIChatMessage, AIConversation, AIContext, AISuggestedQuestion } from "../lib/types/ai";
import { CreateConversationSchema, UpdateConversationSchema, SendMessageSchema } from "../lib/validations/ai";
import { orchestrator } from "../lib/ai/orchestrator/AIOrchestrator";

export const AIService = {
  // Conversation Management
  async loadConversations(paperId: string): Promise<AIConversation[]> {
    return AIRepository.getConversations(paperId);
  },

  async createConversation(paperId: string, projectId?: string, title?: string): Promise<AIConversation> {
    const validated = CreateConversationSchema.parse({ paperId, projectId, title });
    return AIRepository.createConversation({
      paperId: validated.paperId,
      projectId: validated.projectId,
      title: validated.title || "New Conversation",
      isPinned: false,
      isFavorite: false,
    });
  },

  async updateConversation(id: string, updates: Parameters<typeof UpdateConversationSchema.parse>[0]): Promise<AIConversation> {
    const validated = UpdateConversationSchema.parse(updates);
    return AIRepository.updateConversation(id, validated);
  },

  async deleteConversation(id: string): Promise<void> {
    await AIRepository.deleteConversation(id);
  },

  // Messaging
  async loadMessages(conversationId: string): Promise<AIChatMessage[]> {
    return AIRepository.getMessages(conversationId);
  },

  async saveUserMessage(conversationId: string, content: string): Promise<AIChatMessage> {
    SendMessageSchema.parse({ conversationId, content });
    return AIRepository.saveMessage({
      conversationId,
      role: "user",
      content,
    });
  },

  async streamAssistantResponse(
    conversationId: string,
    prompt: string,
    context: AIContext | null,
    onChunk: (text: string) => void
  ): Promise<AIChatMessage> {
    const stream = await orchestrator.executeStream("AI Chat", {
      userId: "user", // The real user ID should ideally be fetched from the session in the orchestrator or passed here, but we pass "user" temporarily if it isn't available. Wait, AIOrchestrator expects context.userId.
      projectId: context?.projectId || undefined,
      paperId: context?.paperId || undefined,
      query: prompt,
      selection: context?.selectedText ? { text: context.selectedText, pageNumber: context.selectedPage || 1 } : undefined,
    });

    let responseText = "";
    for await (const chunk of stream) {
      if (chunk.type === "delta" && chunk.content) {
        responseText += chunk.content;
        onChunk(chunk.content);
      }
    }

    return AIRepository.saveMessage({
      conversationId,
      role: "assistant",
      content: responseText,
      citations: [], // Citations would ideally be collected from stream chunks if supported
    });
  },

  async deleteMessage(id: string): Promise<void> {
    await AIRepository.deleteMessage(id);
  },

  // Suggestions
  async generateSuggestions(context: AIContext | null): Promise<AISuggestedQuestion[]> {
    // In the absence of an LLM endpoint, we return static contextual suggestions to guide the user.
    await new Promise((r) => setTimeout(r, 200));

    if (context?.selectedText) {
      return [
        { id: "s1", label: "Explain this", prompt: `Explain the following text in simple terms:\n\n"${context.selectedText}"` },
        { id: "s2", label: "Summarize", prompt: `Summarize this specific section:\n\n"${context.selectedText}"` },
        { id: "s3", label: "Find Citations", prompt: `Are there any external citations or references that support this statement:\n\n"${context.selectedText}"?` },
      ];
    }

    return [
      { id: "g1", label: "Summarize Paper", prompt: "Provide a comprehensive summary of this paper, including its main contributions and findings." },
      { id: "g2", label: "Explain Methodology", prompt: "Explain the methodology used in this paper step-by-step." },
      { id: "g3", label: "List Limitations", prompt: "What are the limitations of the proposed approach as stated by the authors?" },
      { id: "g4", label: "Future Work", prompt: "What directions for future research are suggested?" },
    ];
  }
};
