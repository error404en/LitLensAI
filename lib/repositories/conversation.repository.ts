import { adminClient } from "../supabase/admin";

export interface Message {
  id?: string;
  role: "system" | "user" | "assistant";
  content: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  projectId?: string;
  paperId?: string;
  createdAt: string;
  updatedAt: string;
}

export const ConversationRepository = {
  async createConversation(userId: string, title: string, context?: { projectId?: string; paperId?: string }) {
    const { data, error } = await adminClient
      .from("conversations")
      .insert({
        user_id: userId,
        title,
        project_id: context?.projectId,
        paper_id: context?.paperId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addMessage(conversationId: string, message: Message) {
    const { data, error } = await adminClient
      .from("conversation_messages")
      .insert({
        conversation_id: conversationId,
        role: message.role,
        content: message.content,
        metadata: message.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMessages(conversationId: string) {
    const { data, error } = await adminClient
      .from("conversation_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getConversations(userId: string, context?: { projectId?: string; paperId?: string }) {
    let query = adminClient
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (context?.projectId) query = query.eq("project_id", context.projectId);
    if (context?.paperId) query = query.eq("paper_id", context.paperId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
};
