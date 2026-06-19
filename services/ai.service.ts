import { AIRepository } from "../lib/repositories/ai.repository";
import { AIChatMessage, AIConversation, AIContext, AISuggestedQuestion } from "../lib/types/ai";
import { CreateConversationSchema, UpdateConversationSchema, SendMessageSchema } from "../lib/validations/ai";

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

  // Simulated Streaming Response
  // In a real implementation, this would use the Fetch API with a ReadableStream
  // connecting to OpenAI/LangChain via an API route.
  async streamAssistantResponse(
    conversationId: string,
    prompt: string,
    context: AIContext | null,
    onChunk: (text: string) => void
  ): Promise<AIChatMessage> {
    const responseText = `Here is an analysis based on your request: "${prompt}".\n\nI have reviewed the paper's context. ${context?.selectedText ? `You highlighted: > ${context.selectedText}\n\n` : ''}The methodology utilizes a novel transformer-based architecture which significantly reduces training time while maintaining high accuracy.\n\n### Key Points:\n- **Efficiency:** 40% reduction in compute overhead.\n- **Scalability:** Capable of handling sequences up to 32k tokens.\n\nThis approach directly addresses the limitations mentioned in previous works.`;
    
    // Simulate thinking delay
    await new Promise((r) => setTimeout(r, 800));

    // Simulate streaming chunks
    const chunks = responseText.split(" ");
    for (const chunk of chunks) {
      onChunk(chunk + " ");
      await new Promise((r) => setTimeout(r, 30 + Math.random() * 50));
    }

    // Save the final message to the repository
    return AIRepository.saveMessage({
      conversationId,
      role: "assistant",
      content: responseText,
      citations: [
        {
          id: "cit_1",
          paperId: context?.paperId || "paper_1",
          paperTitle: "Simulated Paper Title",
          page: context?.selectedPage || 1,
        }
      ]
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
