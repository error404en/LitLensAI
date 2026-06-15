import { AIConversation, AIChatMessage } from "../types/ai";

// In-memory mock storage
let conversationsData: AIConversation[] = [];
let messagesData: AIChatMessage[] = [];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AIRepository = {
  // Conversations
  async getConversations(paperId: string): Promise<AIConversation[]> {
    await delay(100);
    return conversationsData
      .filter((c) => c.paperId === paperId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  async getConversation(id: string): Promise<AIConversation | null> {
    await delay(50);
    return conversationsData.find((c) => c.id === id) || null;
  },

  async createConversation(conversation: Omit<AIConversation, "id" | "createdAt" | "updatedAt">): Promise<AIConversation> {
    await delay(100);
    const newConv: AIConversation = {
      ...conversation,
      id: `conv_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    conversationsData.push(newConv);
    return newConv;
  },

  async updateConversation(id: string, updates: Partial<Pick<AIConversation, "title" | "isPinned" | "isFavorite">>): Promise<AIConversation> {
    await delay(100);
    const index = conversationsData.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Conversation not found");

    const updated = {
      ...conversationsData[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    conversationsData[index] = updated;
    return updated;
  },

  async deleteConversation(id: string): Promise<void> {
    await delay(100);
    conversationsData = conversationsData.filter((c) => c.id !== id);
    messagesData = messagesData.filter((m) => m.conversationId !== id);
  },

  // Messages
  async getMessages(conversationId: string): Promise<AIChatMessage[]> {
    await delay(150);
    return messagesData
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  async saveMessage(message: Omit<AIChatMessage, "id" | "createdAt">): Promise<AIChatMessage> {
    await delay(100);
    const newMsg: AIChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    messagesData.push(newMsg);

    // Update conversation timestamp
    const convIndex = conversationsData.findIndex((c) => c.id === message.conversationId);
    if (convIndex !== -1) {
      conversationsData[convIndex] = {
        ...conversationsData[convIndex],
        updatedAt: new Date().toISOString()
      };
    }

    return newMsg;
  },

  async deleteMessage(id: string): Promise<void> {
    await delay(50);
    messagesData = messagesData.filter((m) => m.id !== id);
  },
};
