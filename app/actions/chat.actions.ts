"use server";

import { AIService } from "../../services/ai.service";
import { auth } from "@clerk/nextjs/server";
import { AIConversation, AIChatMessage, AIContext, AISuggestedQuestion } from "../../lib/types/ai";

export async function loadConversationsAction(paperId: string): Promise<AIConversation[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return AIService.loadConversations(paperId);
}

export async function createConversationAction(
  paperId: string,
  projectId?: string,
  title?: string
): Promise<AIConversation> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return AIService.createConversation(paperId, projectId, title);
}

export async function updateConversationAction(
  id: string,
  updates: { title?: string; isPinned?: boolean; isFavorite?: boolean }
): Promise<AIConversation> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return AIService.updateConversation(id, updates);
}

export async function deleteConversationAction(id: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return AIService.deleteConversation(id);
}

export async function loadMessagesAction(conversationId: string): Promise<AIChatMessage[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return AIService.loadMessages(conversationId);
}

export async function saveUserMessageAction(conversationId: string, content: string): Promise<AIChatMessage> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return AIService.saveUserMessage(conversationId, content);
}

export async function deleteMessageAction(id: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return AIService.deleteMessage(id);
}

export async function generateSuggestionsAction(context: AIContext | null): Promise<AISuggestedQuestion[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return AIService.generateSuggestions(context);
}
