import { AIConversation, AIChatMessage } from "../types/ai";
import { createClient } from "../supabase/client";
import { DatabaseError } from "../errors";

export const AIRepository = {
  // Conversations
  async getConversations(paperId: string): Promise<AIConversation[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("paper_id", paperId)
      .order("updated_at", { ascending: false });

    if (error) throw new DatabaseError(error.message, error);
    return data.map((c: any) => ({
      id: c.id,
      paperId: c.paper_id,
      projectId: c.project_id,
      title: c.title,
      isPinned: c.is_pinned,
      isFavorite: false,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }));
  },

  async getConversation(id: string): Promise<AIConversation | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new DatabaseError(error.message, error);
    }
    return {
      id: data.id,
      paperId: data.paper_id,
      projectId: data.project_id,
      title: data.title,
      isPinned: data.is_pinned,
      isFavorite: false,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async createConversation(conversation: Omit<AIConversation, "id" | "createdAt" | "updatedAt">): Promise<AIConversation> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        paper_id: conversation.paperId,
        project_id: conversation.projectId,
        user_id: userUUID || undefined,
        title: conversation.title,
        is_pinned: conversation.isPinned || false,
      })
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error);
    return {
      id: data.id,
      paperId: data.paper_id,
      projectId: data.project_id,
      title: data.title,
      isPinned: data.is_pinned,
      isFavorite: false,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async updateConversation(id: string, updates: Partial<Pick<AIConversation, "title" | "isPinned" | "isFavorite">>): Promise<AIConversation> {
    const supabase = createClient();
    const updateData: any = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.isPinned !== undefined) updateData.is_pinned = updates.isPinned;

    const { data, error } = await supabase
      .from("conversations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error);
    return {
      id: data.id,
      paperId: data.paper_id,
      projectId: data.project_id,
      title: data.title,
      isPinned: data.is_pinned,
      isFavorite: false,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async deleteConversation(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("conversations").delete().eq("id", id);
    if (error) throw new DatabaseError(error.message, error);
  },

  // Messages
  async getMessages(conversationId: string): Promise<AIChatMessage[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw new DatabaseError(error.message, error);
    return data.map((m: any) => ({
      id: m.id,
      conversationId: m.conversation_id,
      role: m.role as any,
      content: m.content,
      citations: m.citations ? JSON.parse(m.citations) : undefined,
      createdAt: m.created_at,
    }));
  },

  async saveMessage(message: Omit<AIChatMessage, "id" | "createdAt">): Promise<AIChatMessage> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: message.conversationId,
        user_id: userUUID || undefined,
        role: message.role,
        content: message.content,
        citations: message.citations,
      })
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error);

    // Update conversation timestamp
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", message.conversationId);

    return {
      id: data.id,
      conversationId: data.conversation_id,
      role: data.role as any,
      content: data.content,
      citations: data.citations,
      createdAt: data.created_at,
    };
  },

  async deleteMessage(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) throw new DatabaseError(error.message, error);
  },
};
